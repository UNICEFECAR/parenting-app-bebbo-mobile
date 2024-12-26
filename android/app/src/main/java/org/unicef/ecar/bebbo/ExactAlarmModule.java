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

    ExactAlarmModule(ReactApplicationContext context) {
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
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU || Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
                if (alarmManager.canScheduleExactAlarms()) {
                    promise.resolve(true); // Permission already granted
                } else {
                    // Redirect user to system settings to enable SCHEDULE_EXACT_ALARM permission
                    Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.startActivity(intent); // Open settings to request permission
                    promise.resolve(false); // Redirecting user to enable the permission
                }
            } else {
                promise.resolve(true); // Permission not needed for versions below Android 12
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage()); // Handle exception if permission check fails
        }
    }
}
