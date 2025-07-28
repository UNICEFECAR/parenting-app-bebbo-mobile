package org.unicef.ecar.bebbo

import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ExactAlarmModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(
        reactContext
    ) {
    override fun getName(): String {
        return "ExactAlarmModule"
    }

    @ReactMethod
    fun requestExactAlarmPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) { // Android 12+
                val alarmManager =
                    reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                if (alarmManager != null && alarmManager.canScheduleExactAlarms()) {
                    promise.resolve(true) // Permission granted
                } else {
                    // Redirect user to system settings to enable the permission
                    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    reactContext.startActivity(intent)
                    promise.resolve(false) // Redirecting user
                }
            } else {
                promise.resolve(true) // Permission not required for Android versions < 12
            }
        } catch (e: SecurityException) {
            promise.reject(
                "SECURITY_EXCEPTION",
                "Failed to request exact alarm permission: " + e.message
            )
        } catch (e: IllegalStateException) {
            promise.reject(
                "ILLEGAL_STATE_EXCEPTION",
                "Invalid state for requesting exact alarm permission: " + e.message
            )
        } catch (e: UnsupportedOperationException) {
            promise.reject(
                "UNSUPPORTED_OPERATION",
                "Exact alarms are not supported on this device: " + e.message
            )
        } catch (e: NullPointerException) {
            promise.reject("NULL_POINTER_EXCEPTION", "A null pointer error occurred: " + e.message)
        } catch (e: Exception) {
            promise.reject("ERROR", "Unexpected error: " + e.message)
        }
    }
}
