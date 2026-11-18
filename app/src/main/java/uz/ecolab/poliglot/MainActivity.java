package uz.ecolab.poliglot;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.MediaMetadataRetriever;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final int REQ_SPEECH = 11;
    private static final int REQ_MIC = 12;
    private static final int REQ_NOTIF = 13;

    private WebView web;
    private TextToSpeech tts;
    private boolean ttsReady = false;
    private MediaRecorder recorder;
    private File recFile;
    private MediaPlayer player;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xFF14213D);
        getWindow().setNavigationBarColor(0xFFFFFFFF);

        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new Bridge(), "Android");

        tts = new TextToSpeech(this, status -> ttsReady = (status == TextToSpeech.SUCCESS));
        Reminder.ensureChannel(this);
        web.loadUrl("file:///android_asset/www/index.html");
    }

    private void js(String type, String arg) {
        final String code = "window.onNative&&window.onNative(" + JSONObject.quote(type) + "," + JSONObject.quote(arg == null ? "" : arg) + ")";
        web.post(() -> web.evaluateJavascript(code, null));
    }

    private File recDir() {
        File d = new File(getFilesDir(), "rec");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    private void stopPlayer() {
        if (player != null) {
            try { player.stop(); } catch (Exception ignored) { }
            player.release();
            player = null;
        }
    }

    private boolean safeName(String name) {
        return name != null && !name.isEmpty() && !name.contains("/") && !name.contains("..");
    }

    public class Bridge {
        @JavascriptInterface
        public void speak(String text, String lang, float rate) {
            if (!ttsReady) { js("tts", "notready"); return; }
            Locale loc = lang != null && lang.startsWith("ar") ? new Locale("ar") : Locale.US;
            int r = tts.setLanguage(loc);
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                js("tts", "missing:" + (loc.getLanguage()));
                return;
            }
            tts.setSpeechRate(rate);
            tts.setPitch(1.0f);
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "poliglot");
        }

        /** Dialog: har bir rol o'z ovoz balandligi (pitch) bilan o'qiladi. */
        @JavascriptInterface
        public void speakAs(String text, String lang, float rate, float pitch) {
            if (!ttsReady) { js("tts", "notready"); return; }
            Locale loc = lang != null && lang.startsWith("ar") ? new Locale("ar") : Locale.US;
            int r = tts.setLanguage(loc);
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                js("tts", "missing:" + (loc.getLanguage()));
                return;
            }
            tts.setSpeechRate(rate);
            tts.setPitch(Math.max(0.5f, Math.min(2.0f, pitch)));
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "poliglot");
        }

        @JavascriptInterface
        public void listen(String lang) {
            runOnUiThread(() -> {
                Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang);
                i.putExtra(RecognizerIntent.EXTRA_PROMPT, "Gapiring...");
                i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
                try {
                    startActivityForResult(i, REQ_SPEECH);
                } catch (Exception e) {
                    js("speechError", "none");
                }
            });
        }

        @JavascriptInterface
        public boolean startRecording(String tag) {
            if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC));
                return false;
            }
            try {
                runOnUiThread(MainActivity.this::stopPlayer);
                String safe = (tag == null ? "yozuv" : tag).replaceAll("[^A-Za-z0-9-]", "-");
                recFile = new File(recDir(), System.currentTimeMillis() + "_" + safe + ".m4a");
                MediaRecorder r = Build.VERSION.SDK_INT >= 31 ? new MediaRecorder(MainActivity.this) : new MediaRecorder();
                r.setAudioSource(MediaRecorder.AudioSource.MIC);
                r.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
                r.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
                r.setAudioEncodingBitRate(96000);
                r.setAudioSamplingRate(44100);
                r.setOutputFile(recFile.getAbsolutePath());
                r.prepare();
                r.start();
                recorder = r;
                return true;
            } catch (Exception e) {
                recorder = null;
                return false;
            }
        }

        @JavascriptInterface
        public String stopRecording() {
            if (recorder == null) return "";
            boolean ok = true;
            try { recorder.stop(); } catch (Exception e) { ok = false; }
            recorder.release();
            recorder = null;
            if (!ok) { if (recFile != null) recFile.delete(); return ""; }
            return recFile != null && recFile.exists() ? recFile.getName() : "";
        }

        @JavascriptInterface
        public String listRecordings() {
            JSONArray arr = new JSONArray();
            File[] files = recDir().listFiles();
            if (files == null) return "[]";
            Arrays.sort(files, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
            for (File f : files) {
                if (!f.getName().endsWith(".m4a")) continue;
                long dur = 0;
                MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                try {
                    mmr.setDataSource(f.getAbsolutePath());
                    String d = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
                    if (d != null) dur = Long.parseLong(d);
                } catch (Exception ignored) {
                } finally {
                    try { mmr.release(); } catch (Exception ignored) { }
                }
                try {
                    JSONObject o = new JSONObject();
                    o.put("name", f.getName());
                    o.put("time", f.lastModified());
                    o.put("dur", dur);
                    arr.put(o);
                } catch (Exception ignored) { }
            }
            return arr.toString();
        }

        @JavascriptInterface
        public void play(String name) {
            if (!safeName(name)) return;
            runOnUiThread(() -> {
                stopPlayer();
                File f = new File(recDir(), name);
                if (!f.exists()) return;
                MediaPlayer p = new MediaPlayer();
                try {
                    p.setDataSource(f.getAbsolutePath());
                    p.setOnCompletionListener(mp -> { stopPlayer(); js("playEnd", name); });
                    p.prepare();
                    p.start();
                    player = p;
                    js("playStart", name);
                } catch (Exception e) {
                    p.release();
                    js("playEnd", name);
                }
            });
        }

        @JavascriptInterface
        public void stopPlay() {
            runOnUiThread(() -> { stopPlayer(); js("playEnd", ""); });
        }

        @JavascriptInterface
        public boolean deleteRecording(String name) {
            if (!safeName(name)) return false;
            return new File(recDir(), name).delete();
        }

        @JavascriptInterface
        public void share(String text) {
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(i, "Hisobotni yuborish"));
            });
        }

        @JavascriptInterface
        public void copy(String text) {
            runOnUiThread(() -> {
                ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("Poliglot", text));
            });
        }

        @JavascriptInterface
        public void setReminder(int hour, int minute) {
            SharedPreferences p = getSharedPreferences(Reminder.PREFS, MODE_PRIVATE);
            p.edit().putInt("hour", hour).putInt("minute", minute).apply();
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                runOnUiThread(() -> requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF));
            }
            Reminder.schedule(MainActivity.this);
        }

        @JavascriptInterface
        public void cancelReminder() {
            getSharedPreferences(Reminder.PREFS, MODE_PRIVATE).edit().putInt("hour", -1).apply();
            Reminder.schedule(MainActivity.this);
        }

        @JavascriptInterface
        public void setStatus(String status) {
            getSharedPreferences(Reminder.PREFS, MODE_PRIVATE).edit().putString("status", status).apply();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_SPEECH) {
            if (resultCode == RESULT_OK && data != null) {
                ArrayList<String> res = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                js("speech", res != null && !res.isEmpty() ? res.get(0) : "");
            } else {
                js("speechError", "cancel");
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (requestCode == REQ_MIC) js("mic", granted ? "granted" : "denied");
        if (requestCode == REQ_NOTIF) js("notif", granted ? "granted" : "denied");
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onBack?window.onBack():false", value -> {
            if (!"true".equals(value)) finish();
        });
    }

    @Override
    protected void onDestroy() {
        if (recorder != null) {
            try { recorder.stop(); } catch (Exception ignored) { }
            recorder.release();
            recorder = null;
        }
        stopPlayer();
        if (tts != null) tts.shutdown();
        super.onDestroy();
    }
}
