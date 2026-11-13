package org.unicef.ecar.bebbo

import android.app.Activity
import android.accounts.Account
import android.accounts.AccountManager
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.google.android.gms.auth.api.identity.AuthorizationRequest
import com.google.android.gms.auth.api.identity.AuthorizationResult
import com.google.android.gms.auth.api.identity.ClearTokenRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Scope

/** Drive authorization only: no legacy GoogleSignIn or app-login identity is needed. */
class DriveAuthorizationModule(private val context: ReactApplicationContext) :
    NativeDriveAuthorizationSpec(context), LifecycleEventListener {
    companion object {
        const val NAME = "DriveAuthorization"
        private const val TAG = "BebboDriveAuth"
        private const val REQUEST_CODE = 49612
        private const val ACCOUNT_REQUEST_CODE = 49611
        private val SCOPES = listOf(
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.appfolder"
        )
    }

    private var pending: Promise? = null
    private var pendingAccountName: String? = null
    private val handler = Handler(Looper.getMainLooper())
    private var networkTimeout: Runnable? = null
    private var invalidated = false
    // Persist only the account selected by the user, never OAuth tokens.
    private val preferences = context.getSharedPreferences("drive_authorization", Context.MODE_PRIVATE)
    private val client get() = Identity.getAuthorizationClient(context)
    private val activityListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
            if (requestCode != REQUEST_CODE && requestCode != ACCOUNT_REQUEST_CODE) return
            val promise = pending ?: return
            if (resultCode == Activity.RESULT_CANCELED) {
                finish(promise) { it.resolve(null) }
                return
            }
            if (resultCode != Activity.RESULT_OK || data == null) {
                finish(promise) { it.reject("INVALID_AUTHORIZATION_RESULT", "Google authorization returned no result") }
                return
            }
            try {
                if (requestCode == ACCOUNT_REQUEST_CODE) {
                    val name = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME)
                    val type = data.getStringExtra(AccountManager.KEY_ACCOUNT_TYPE)
                    if (name.isNullOrBlank() || type != "com.google") {
                        finish(promise) { it.reject("INVALID_ACCOUNT", "No Google account was selected") }
                    } else {
                        requestAuthorization(name, true, promise)
                    }
                } else {
                    complete(client.getAuthorizationResultFromIntent(data), promise)
                }
            } catch (error: Exception) {
                fail(promise, error)
            }
        }
    }

    init {
        context.addActivityEventListener(activityListener)
        context.addLifecycleEventListener(this)
    }
    override fun getName() = NAME

    override fun authorize(allowUserInteraction: Boolean, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            if (invalidated) {
                promise.reject("AUTHORIZATION_UNAVAILABLE", "Authorization module is no longer active")
                return@runOnUiThread
            }
            if (pending != null) {
                promise.reject("IN_PROGRESS", "Google authorization is already running")
                return@runOnUiThread
            }
            if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context) != ConnectionResult.SUCCESS) {
                promise.reject("PLAY_SERVICES_NOT_AVAILABLE", "Google Play services are unavailable or need updating")
                return@runOnUiThread
            }
            val activity = context.currentActivity
            if (allowUserInteraction && (activity == null || activity.isFinishing || activity.isDestroyed)) {
                promise.reject("NO_ACTIVITY", "An active screen is required for Google authorization")
                return@runOnUiThread
            }
            pending = promise
            try {
                val savedAccount = preferences.getString("account_name", null)
                if (!savedAccount.isNullOrBlank()) {
                    requestAuthorization(savedAccount, allowUserInteraction, promise)
                } else if (allowUserInteraction) {
                    // Pin the user's choice for all subsequent Drive requests.
                    val intent = AccountManager.newChooseAccountIntent(
                        null, null, arrayOf("com.google"), null, null, null, null
                    )
                    activity!!.startActivityForResult(intent, ACCOUNT_REQUEST_CODE)
                } else {
                    finish(promise) { it.reject("AUTHORIZATION_REQUIRED", "Choose a Google account before accessing Drive") }
                }
            } catch (error: Exception) { fail(promise, error) }
        }
    }

    private fun requestAuthorization(accountName: String, allowUserInteraction: Boolean, promise: Promise) {
        pendingAccountName = accountName
        // Bound the network call, but never time out while the user is choosing/consenting.
        val timeout = Runnable {
            Log.w(TAG, "Google authorization timed out")
            finish(promise) { it.reject("AUTHORIZATION_TIMEOUT", "Google Drive authorization timed out") }
        }
        networkTimeout = timeout
        handler.postDelayed(timeout, 60_000)
        val request = AuthorizationRequest.builder()
            .setAccount(Account(accountName, "com.google"))
            .setRequestedScopes(SCOPES.map(::Scope)).build()
        client.authorize(request)
            .addOnSuccessListener { result ->
                if (pending !== promise) return@addOnSuccessListener
                stopTimeout()
                if (!result.hasResolution()) {
                    complete(result, promise)
                } else if (!allowUserInteraction) {
                    finish(promise) { it.reject("AUTHORIZATION_REQUIRED", "Google Drive consent is required") }
                } else {
                    val current = context.currentActivity
                    val intent = result.pendingIntent
                    if (current == null || current.isFinishing || current.isDestroyed || intent == null) {
                        finish(promise) { it.reject("NO_ACTIVITY", "Cannot present Google authorization") }
                    } else {
                        try {
                            current.startIntentSenderForResult(intent.intentSender, REQUEST_CODE, null, 0, 0, 0)
                        } catch (error: Exception) { fail(promise, error) }
                    }
                }
            }
            .addOnFailureListener { error -> fail(promise, error) }
    }

    private fun complete(result: AuthorizationResult, promise: Promise) {
        val token = result.accessToken
        // Google documents appdata/appfolder as equivalent names for the same scope.
        val granted = result.grantedScopes.map {
            if (it == "https://www.googleapis.com/auth/drive.appdata") SCOPES[1] else it
        }
        if (token.isNullOrBlank() || !granted.containsAll(SCOPES)) {
            finish(promise) { it.reject("MISSING_DRIVE_PERMISSION", "Google did not grant the requested Drive permissions") }
        } else {
            Log.i(TAG, "Google Drive authorization completed")
            preferences.edit().putString("account_name", pendingAccountName).apply()
            finish(promise) { it.resolve(token) }
        }
    }

    private fun fail(promise: Promise, error: Exception) {
        if (pending !== promise) return
        Log.w(TAG, if (error is ApiException) "Google authorization failed: ${error.statusCode}" else "Google authorization failed")
        if (error is ApiException && error.statusCode in listOf(CommonStatusCodes.SIGN_IN_REQUIRED, CommonStatusCodes.INVALID_ACCOUNT)) {
            preferences.edit().remove("account_name").apply()
        }
        finish(promise) {
            if (error is ApiException && error.statusCode == CommonStatusCodes.CANCELED) it.resolve(null)
            else it.reject(
                if (error is ApiException) "GOOGLE_AUTH_${error.statusCode}" else "DRIVE_AUTHORIZATION_FAILED",
                "Google Drive authorization failed", error
            )
        }
    }

    private fun finish(promise: Promise, action: (Promise) -> Unit) {
        if (pending !== promise) return
        stopTimeout()
        pending = null
        pendingAccountName = null
        action(promise)
    }

    private fun stopTimeout() {
        networkTimeout?.let { handler.removeCallbacks(it) }
        networkTimeout = null
    }

    override fun clearToken(accessToken: String, promise: Promise) {
        if (accessToken.isBlank()) { promise.resolve(null); return }
        client.clearToken(ClearTokenRequest.builder().setToken(accessToken).build())
            .addOnSuccessListener { promise.resolve(null) }
            .addOnFailureListener { promise.reject("TOKEN_CLEAR_FAILED", "Could not clear the Google token cache", it) }
    }

    override fun forgetAccount(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            if (pending != null) {
                promise.reject("IN_PROGRESS", "Google authorization is already running")
            } else {
                preferences.edit().remove("account_name").apply()
                promise.resolve(null)
            }
        }
    }

    override fun invalidate() {
        context.removeActivityEventListener(activityListener)
        context.removeLifecycleEventListener(this)
        UiThreadUtil.runOnUiThread {
            invalidated = true
            pending?.let { promise ->
                finish(promise) { it.reject("AUTHORIZATION_INTERRUPTED", "Google authorization was interrupted") }
            }
        }
        super.invalidate()
    }

    override fun onHostResume() = Unit
    override fun onHostPause() = Unit // Google's consent activity pauses the app normally.
    override fun onHostDestroy() {
        pending?.let { promise ->
            finish(promise) { it.reject("AUTHORIZATION_INTERRUPTED", "The authorization screen was closed") }
        }
    }
}
