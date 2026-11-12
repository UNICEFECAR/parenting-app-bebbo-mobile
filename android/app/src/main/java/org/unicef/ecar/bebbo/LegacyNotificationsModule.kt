package org.unicef.ecar.bebbo

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import org.json.JSONArray
import org.json.JSONObject

/** Only used to carry reminders over from react-native-push-notification. */
class LegacyNotificationsModule(private val context: ReactApplicationContext) :
    NativeLegacyNotificationsSpec(context) {
    override fun getName() = NAME

    override fun getNotificationColor(promise: Promise) {
        val color = androidx.core.content.ContextCompat.getColor(context, R.color.noti_color)
        promise.resolve(String.format("#%06X", color and 0xFFFFFF))
    }

    override fun getPendingNotifications(promise: Promise) {
        try {
            val result = JSONArray()
            val preferences = context.getSharedPreferences("rn_push_notification", Context.MODE_PRIVATE)
            for ((id, value) in preferences.all) {
                val old = JSONObject(value.toString())
                val data = old.opt("userInfo")
                result.put(JSONObject().apply {
                    put("id", id)
                    put("timestamp", old.optDouble("fireDate", 0.0))
                    put("title", old.optString("title", ""))
                    put("body", old.optString("message", ""))
                    put("data", if (data is String && data.isNotEmpty()) JSONObject(data)
                        else if (data is JSONObject) data else JSONObject())
                })
            }
            promise.resolve(result.toString())
        } catch (error: Exception) {
            promise.reject("LEGACY_NOTIFICATIONS_READ", error)
        }
    }

    override fun completeMigration(notificationIds: String, promise: Promise) {
        try {
            val ids = JSONArray(notificationIds)
            val alarms = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val preferences = context.getSharedPreferences("rn_push_notification", Context.MODE_PRIVATE)
            val editor = preferences.edit()
            for (index in 0 until ids.length()) {
                val id = ids.getString(index)
                val intent = Intent().setClassName(context.packageName,
                    "com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher")
                val pending = id.toIntOrNull()?.let {
                    PendingIntent.getBroadcast(context, it, intent,
                        PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE)
                }
                if (pending != null) {
                    alarms.cancel(pending)
                    pending.cancel()
                }
                editor.remove(id)
            }
            if (!editor.commit()) throw IllegalStateException("Cannot save notification migration")
            promise.resolve(null)
        } catch (error: Exception) {
            promise.reject("LEGACY_NOTIFICATIONS_CANCEL", error)
        }
    }

    companion object { const val NAME = "LegacyNotifications" }
}
