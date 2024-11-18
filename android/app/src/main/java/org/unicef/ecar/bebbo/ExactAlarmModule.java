package org.unicef.ecar.bebbo;

import android.app.AlarmManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class ExactAlarmModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ExactAlarmModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ExactAlarmModule";
    }

    @ReactMethod
    public void requestExactAlarmPermission(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) { // Android 12+
                AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
                if (alarmManager != null && alarmManager.canScheduleExactAlarms()) {
                    promise.resolve(true); // Permission granted
                } else {
                    // Redirect user to system settings to enable the permission
                    Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.startActivity(intent);
                    promise.resolve(false); // Redirecting user
                }
            } else {
                promise.resolve(true); // Permission not required for Android versions < 12
            }
        } catch (SecurityException e) {
            promise.reject("SECURITY_EXCEPTION", "Failed to request exact alarm permission: " + e.getMessage());
        } catch (IllegalStateException e) {
            promise.reject("ILLEGAL_STATE_EXCEPTION", "Invalid state for requesting exact alarm permission: " + e.getMessage());
        } catch (UnsupportedOperationException e) {
            promise.reject("UNSUPPORTED_OPERATION", "Exact alarms are not supported on this device: " + e.getMessage());
        } catch (NullPointerException e) {
            promise.reject("NULL_POINTER_EXCEPTION", "A null pointer error occurred: " + e.getMessage());
        } catch (Exception e) {
            promise.reject("ERROR", "Unexpected error: " + e.getMessage());
        }
    }
}
