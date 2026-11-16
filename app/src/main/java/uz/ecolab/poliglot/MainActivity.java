package uz.ecolab.poliglot;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener {
    private static final int REQ_MIC = 11;
    private static final int REQ_SR = 12;
    private static final int REQ_NOTIF = 13;
    private static final String START_URL = "https://appassets.androidplatform.net/assets/index.html";

    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;
    private PermissionRequest pendingWebPerm;
    private WebViewAssetLoader loader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setTextZoom(100);

        loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("appassets.androidplatform.net".equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    boolean wantsAudio = false;
                    for (String r : request.getResources()) {
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) wantsAudio = true;
                    }
                    if (!wantsAudio) { request.deny(); return; }
                    if (hasMic()) {
                        request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    } else {
                        pendingWebPerm = request;
                        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
                    }
                });
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");
        tts = new TextToSpeech(this, this);
        ReminderReceiver.ensureChannel(this);
        ReminderReceiver.rescheduleFromPrefs(this);
        web.loadUrl(START_URL);
    }

    private boolean hasMic() {
        return checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
    }

    private void js(final String code) {
        runOnUiThread(() -> { if (web != null) web.evaluateJavascript(code, null); });
    }

    @Override
    public void onInit(int status) {
        ttsReady = (status == TextToSpeech.SUCCESS);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean ok = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (requestCode == REQ_MIC) {
            if (pendingWebPerm != null) {
                if (ok) pendingWebPerm.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                else pendingWebPerm.deny();
                pendingWebPerm = null;
            }
            js("window.__mic&&window.__mic(" + ok + ")");
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_SR) return;
        if (resultCode == RESULT_OK && data != null) {
            ArrayList<String> list = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            if (list != null && !list.isEmpty()) {
                js("window.__sr&&window.__sr(" + JSONObject.quote(list.get(0)) + ",null)");
                return;
            }
        }
        js("window.__sr&&window.__sr(null,'cancel')");
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript("window.goBack?window.goBack():false", value -> {
            if (!"true".equals(value)) finish();
        });
    }

    @Override
    protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }

    public class Bridge {
        @JavascriptInterface
        public String speak(String text, String lang, float rate) {
            if (!ttsReady || tts == null) return "notready";
            int r = tts.setLanguage(Locale.forLanguageTag(lang));
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) return "missing";
            tts.setSpeechRate(rate);
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "u" + System.currentTimeMillis());
            return "ok";
        }

        @JavascriptInterface
        public void stopSpeak() { if (tts != null) tts.stop(); }

        @JavascriptInterface
        public void openTtsSettings() {
            runOnUiThread(() -> {
                try {
                    Intent i = new Intent("com.android.settings.TTS_SETTINGS");
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(i);
                } catch (Exception e) {
                    startActivity(new Intent(Settings.ACTION_SETTINGS));
                }
            });
        }

        @JavascriptInterface
        public void ensureMic() {
            runOnUiThread(() -> {
                if (hasMic()) js("window.__mic&&window.__mic(true)");
                else requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
            });
        }

        @JavascriptInterface
        @SuppressWarnings("deprecation")
        public void listen(final String lang) {
            runOnUiThread(() -> {
                Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang);
                i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
                i.putExtra(RecognizerIntent.EXTRA_PROMPT, lang.startsWith("ar") ? "Arabcha ayting..." : "Say it in English...");
                try {
                    startActivityForResult(i, REQ_SR);
                } catch (ActivityNotFoundException e) {
                    js("window.__sr&&window.__sr(null,'nosr')");
                }
            });
        }

        @JavascriptInterface
        public void share(final String text) {
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(i, "Hisobotni yuborish"));
            });
        }

        @JavascriptInterface
        public void setReminder(final int hour, final int minute) {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 33
                        && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF);
                }
                ReminderReceiver.schedule(MainActivity.this, hour, minute);
            });
        }

        @JavascriptInterface
        public void cancelReminder() {
            runOnUiThread(() -> ReminderReceiver.cancel(MainActivity.this));
        }
    }
}
