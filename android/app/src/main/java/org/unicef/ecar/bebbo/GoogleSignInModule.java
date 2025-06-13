package org.unicef.ecar.bebbo;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.*;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.api.identity.BeginSignInRequest;
import com.google.android.gms.auth.api.identity.BeginSignInRequest.GoogleIdTokenRequestOptions;
import com.google.android.gms.auth.api.identity.Identity;
import com.google.android.gms.auth.api.identity.SignInClient;
import com.google.android.gms.auth.api.identity.SignInCredential;
import com.google.android.gms.common.api.ApiException;

public class GoogleSignInModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int REQ_ONE_TAP = 9001;
    private Promise promise;
    private final SignInClient oneTapClient;
    private final ReactApplicationContext reactContext;

    public GoogleSignInModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);
        oneTapClient = Identity.getSignInClient(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "GoogleSignInModule";
    }

    @ReactMethod
    public void signInWithGoogle(String serverClientId,Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No current activity");
            return;
        }

        this.promise = promise;

        BeginSignInRequest signInRequest = BeginSignInRequest.builder()
            .setGoogleIdTokenRequestOptions(
                GoogleIdTokenRequestOptions.builder()
                    .setSupported(true)
                    .setServerClientId(serverClientId)
                    .setFilterByAuthorizedAccounts(false)
                    .build()
            )
            .setAutoSelectEnabled(true)
            .build();

        oneTapClient.beginSignIn(signInRequest)
            .addOnSuccessListener(activity, result -> {
                try {
                    activity.startIntentSenderForResult(
                        result.getPendingIntent().getIntentSender(),
                        REQ_ONE_TAP, null, 0, 0, 0, null
                    );
                } catch (Exception e) {
                    if (this.promise != null) {
                        this.promise.reject("INTENT_FAILED", e.getMessage());
                        this.promise = null;
                    }
                }
            })
            .addOnFailureListener(activity, e -> {
                if (this.promise != null) {
                    this.promise.reject("SIGN_IN_FAILED", e.getMessage());
                    this.promise = null;
                }
            });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQ_ONE_TAP && data != null) {
            try {
                SignInCredential credential = oneTapClient.getSignInCredentialFromIntent(data);
                String idToken = credential.getGoogleIdToken();
                String email = credential.getId();
                String name = credential.getDisplayName();

                WritableMap result = Arguments.createMap();
                result.putString("idToken", idToken);
                result.putString("email", email);
                result.putString("name", name);

                // ✅ Use email directly from credential to get access token
                new Thread(() -> {
                    try {
                        String scope = "oauth2:https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
                        String accessToken = GoogleAuthUtil.getToken(reactContext, email, scope);

                        result.putString("accessToken", accessToken);

                        if (promise != null) {
                            promise.resolve(result);
                            promise = null;
                        }
                    } catch (Exception e) {
                        if (promise != null) {
                            promise.reject("TOKEN_ERROR", "Failed to get access token: " + e.getMessage());
                            promise = null;
                        }
                    }
                }).start();

            } catch (ApiException e) {
                if (promise != null) {
                    promise.reject("API_EXCEPTION", e.getMessage());
                    promise = null;
                }
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // no-op
    }
}
