package uz.ecolab.poliglot;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import java.util.Calendar;

public class ReminderReceiver extends BroadcastReceiver {
    static final String CHANNEL = "daily";
    static final String PREFS = "reminder";

    @Override
    public void onReceive(Context ctx, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            rescheduleFromPrefs(ctx);
            return;
        }
        ensureChannel(ctx);
        Intent open = new Intent(ctx, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, 1, open,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Notification n = new Notification.Builder(ctx, CHANNEL)
                .setSmallIcon(R.drawable.ic_notify)
                .setContentTitle("Poliglot: mashq vaqti")
                .setContentText("30 daqiqa: ingliz + arab. Seriyani uzmang!")
                .setContentIntent(pi)
                .setAutoCancel(true)
                .build();
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(1, n);
    }

    static void ensureChannel(Context ctx) {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null && nm.getNotificationChannel(CHANNEL) == null) {
            nm.createNotificationChannel(new NotificationChannel(CHANNEL, "Kunlik eslatma",
                    NotificationManager.IMPORTANCE_DEFAULT));
        }
    }

    private static PendingIntent alarmIntent(Context ctx) {
        Intent i = new Intent(ctx, ReminderReceiver.class);
        return PendingIntent.getBroadcast(ctx, 0, i,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    static void schedule(Context ctx, int hour, int minute) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putBoolean("on", true).putInt("h", hour).putInt("m", minute).apply();
        Calendar c = Calendar.getInstance();
        c.set(Calendar.HOUR_OF_DAY, hour);
        c.set(Calendar.MINUTE, minute);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        if (c.getTimeInMillis() <= System.currentTimeMillis()) c.add(Calendar.DAY_OF_YEAR, 1);
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am != null) {
            am.setInexactRepeating(AlarmManager.RTC_WAKEUP, c.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, alarmIntent(ctx));
        }
    }

    static void cancel(Context ctx) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putBoolean("on", false).apply();
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(alarmIntent(ctx));
    }

    static void rescheduleFromPrefs(Context ctx) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (p.getBoolean("on", false)) schedule(ctx, p.getInt("h", 20), p.getInt("m", 0));
    }
}
