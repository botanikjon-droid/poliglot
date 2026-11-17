/* Poliglot — ilova mantig'i */
(function () {
  "use strict";
  var A = window.Android || null; // APK ichida: native ko'prik
  var KEY = "poliglot.v1";

  // ---------- holat ----------
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && s.v === 1) return s; } catch (e) {}
    return null;
  }
  var S = load() || { v: 1, start: today(), en: {}, ar: {}, active: [], reports: {}, known: { en: [], ar: [] }, rem: "20:00", remOn: false, doneAt: {} };
  if (!S.forgot) S.forgot = {}; // unutilgan so`zlar: { soz: kun }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} pushStatus(); }

  var ui = { tab: "today", day: curDay(), cat: "all", card: 0, flip: false, arMode: "letters", phrLang: "en",
    recOn: false, recT0: 0, recTick: null, playing: "", check: null, sheet: null, timer: { sec: 120, left: 120, run: false, h: null } };

  // ---------- yordamchilar ----------
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(s) { return document.querySelector(s); }
  function fmtDate(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }

  function trackDone(tr, d) { var tasks = tr === "en" ? enTasks(d) : arTasks(d); var st = S[tr][d] || []; return tasks.every(function (_, i) { return !!st[i]; }); }
  function dayDone(d) { return trackDone("en", d) && trackDone("ar", d); }
  function dayCount(d) { var n = 0, st; st = S.en[d] || []; st.forEach(function (x) { if (x) n++; }); st = S.ar[d] || []; st.forEach(function (x) { if (x) n++; }); return n; }
  function dayTotal(d) { return enTasks(d).length + arTasks(d).length; }
  function curDay() { for (var d = 1; d <= 30; d++) if (!dayDone(d)) return d; return 30; }
  function doneDays() { var n = 0; for (var d = 1; d <= 30; d++) if (dayDone(d)) n++; return n; }

  function streak() {
    var set = {}; S.active.forEach(function (x) { set[x] = 1; });
    var dt = new Date(), n = 0;
    function k(x) { return x.getFullYear() + "-" + pad(x.getMonth() + 1) + "-" + pad(x.getDate()); }
    if (!set[k(dt)]) dt.setDate(dt.getDate() - 1);
    while (set[k(dt)]) { n++; dt.setDate(dt.getDate() - 1); }
    return n;
  }
  function markActive() { var t = today(); if (S.active.indexOf(t) < 0) S.active.push(t); }

  function phrasesFor(d) {
    var cat = EN_DAYS[d][2];
    var list = EN_PHR.map(function (p, i) { return { i: i, c: p[0], p: p[1], u: p[2], e: p[3] || p[1], eu: p[4] || p[2] }; }).filter(function (x) { return x.c === cat; });
    var start = (d * 3) % list.length, out = [];
    for (var k = 0; k < Math.min(4, list.length); k++) out.push(list[(start + k) % list.length]);
    return out;
  }

  function statusText() { var d = curDay(); return d + "-kun: " + EN_DAYS[d][0] + " · Arab: " + AR_DAYS[d].t + ". Seriya: " + streak() + " kun. 30 daqiqa ajrating!"; }
  function pushStatus() {
    if (!A || !A.setStatus) return;
    try { A.setStatus(statusText()); } catch (e) {}
  }

  // ---------- kompyuter (brauzer) rejimi: mikrofon, yozuvlar, eslatma ----------
  var mic = { devices: [], stream: null, rec: null, chunks: [], meter: null, meterH: null, testing: false };
  var hasMD = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  function isFifine(d) { return /fifine/i.test(d.label || ""); }
  function refreshMics() {
    if (!hasMD || !navigator.mediaDevices.enumerateDevices) return Promise.resolve([]);
    return navigator.mediaDevices.enumerateDevices().then(function (ds) {
      mic.devices = ds.filter(function (d) { return d.kind === "audioinput" && d.deviceId !== "communications"; });
      var cur = null, fif = null;
      mic.devices.forEach(function (d) { if (d.deviceId === S.mic) cur = d; if (!fif && isFifine(d)) fif = d; });
      // Fifine ulangan bo'lsa va boshqa mikrofon qo'lda tanlanmagan bo'lsa — Fifine'ni olamiz
      if (fif && (!cur || (!S.micManual && !isFifine(cur)))) { S.mic = fif.deviceId; S.micLabel = fif.label; save(); }
      else if (cur && cur.label) S.micLabel = cur.label;
      if (ui.tab === "set" && !ui.sheet) render();
      return mic.devices;
    }, function () { return []; });
  }
  function getMicStream(again) {
    if (!hasMD) return Promise.reject({ name: "NoSupport" });
    var a = { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 };
    if (S.mic && S.mic !== "default") a.deviceId = { exact: S.mic };
    return navigator.mediaDevices.getUserMedia({ audio: a }).catch(function (e) {
      if (a.deviceId && (e.name === "OverconstrainedError" || e.name === "NotFoundError")) { S.mic = ""; return navigator.mediaDevices.getUserMedia({ audio: true }); }
      throw e;
    }).then(function (st) {
      mic.stream = st;
      return refreshMics().then(function () {
        // ruxsatdan keyin nom ko'rinadi: Fifine topilsa va hozirgi oqim boshqa qurilmadan bo'lsa, qayta ochamiz
        var tr = st.getAudioTracks()[0], id = tr && tr.getSettings ? tr.getSettings().deviceId : "";
        if (!again && S.mic && id && id !== S.mic) { stopStream(); return getMicStream(true); }
        return st;
      });
    });
  }
  function stopStream() { if (mic.stream) { mic.stream.getTracks().forEach(function (t) { t.stop(); }); mic.stream = null; } }
  function micError(e) {
    var n = (e && e.name) || "";
    if (n === "NotAllowedError" || n === "SecurityError") toast("Mikrofonga ruxsat berilmadi. Manzil satri chap tomonidagi belgidan ruxsat bering.");
    else if (n === "NotFoundError") toast("Mikrofon topilmadi. Fifine USB kabelini ulang.");
    else if (n === "NotReadableError") toast("Mikrofon band: boshqa dastur (Zoom, Telegram) uni ishlatyapti.");
    else if (n === "NoSupport") toast("Bu brauzer mikrofonni qo'llamaydi: Edge yoki Chrome'da oching.");
    else toast("Mikrofon ochilmadi.");
  }
  function startMeter(stream, id) {
    stopMeter();
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.resume) actx.resume();
      var src = actx.createMediaStreamSource(stream), an = actx.createAnalyser();
      an.fftSize = 1024; src.connect(an);
      var buf = new Float32Array(an.fftSize);
      mic.meter = src;
      (function loop() {
        an.getFloatTimeDomainData(buf);
        var p = 0; for (var i = 0; i < buf.length; i++) { var v = Math.abs(buf[i]); if (v > p) p = v; }
        var el = document.getElementById(id);
        if (el) { var w = Math.min(100, Math.round(Math.sqrt(p) * 110)); el.style.width = w + "%"; el.className = p > 0.95 ? "clip" : ""; }
        mic.meterH = requestAnimationFrame(loop);
      })();
    } catch (e) {}
  }
  function stopMeter() {
    if (mic.meterH) cancelAnimationFrame(mic.meterH);
    mic.meterH = null;
    if (mic.meter) { try { mic.meter.disconnect(); } catch (e) {} mic.meter = null; }
  }
  function micTest() {
    if (mic.testing) { mic.testing = false; stopMeter(); if (!ui.recOn) stopStream(); render(); return; }
    getMicStream().then(function (st) { mic.testing = true; render(); startMeter(st, "testMeter"); }, micError);
  }

  // yozuvlar kompyuterda IndexedDB'da saqlanadi
  var DBP = null, WR = [];
  function db() {
    if (!DBP) DBP = new Promise(function (res, rej) {
      if (!window.indexedDB) { rej(new Error("no idb")); return; }
      var r = indexedDB.open("poliglot", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("recs", { keyPath: "name" }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return DBP;
  }
  function idb(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction("recs", mode), q = fn(tx.objectStore("recs"));
        tx.oncomplete = function () { res(q ? q.result : null); };
        tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function loadRecs() {
    return idb("readonly", function (st) { return st.getAll(); }).then(function (list) {
      WR = (list || []).sort(function (a, b) { return b.time - a.time; });
      if (ui.tab === "rec" && !ui.recOn) render();
    }, function () {});
  }
  function webRecStart() {
    if (!window.MediaRecorder) { toast("Bu brauzer ovoz yozishni qo'llamaydi: Edge yoki Chrome'da oching."); return; }
    getMicStream().then(function (stream) {
      var types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"], mt = "";
      for (var i = 0; i < types.length; i++) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(types[i])) { mt = types[i]; break; }
      var mr = new MediaRecorder(stream, mt ? { mimeType: mt, audioBitsPerSecond: 128000 } : undefined);
      mic.chunks = [];
      mr.ondataavailable = function (e) { if (e.data && e.data.size) mic.chunks.push(e.data); };
      mr.onstop = function () {
        var dur = Date.now() - ui.recT0, type = mr.mimeType || "audio/webm";
        var blob = new Blob(mic.chunks, { type: type }), ext = /mp4/.test(type) ? "m4a" : /ogg/.test(type) ? "ogg" : "webm";
        stopMeter(); if (!mic.testing) stopStream();
        var name = Date.now() + "_" + ui.day + "-kun." + ext;
        idb("readwrite", function (st) { return st.put({ name: name, time: Date.now(), dur: dur, blob: blob }); })
          .then(function () { toast("Saqlandi. Endi tinglang!"); return loadRecs(); }, function () { toast("Yozuv saqlanmadi."); });
      };
      mr.start(1000); mic.rec = mr;
      ui.recOn = true; ui.recT0 = Date.now(); ui.recTick = setInterval(updRecClock, 500); render();
      startMeter(stream, "recMeter");
    }, micError);
  }
  function webRecStop() {
    ui.recOn = false; clearInterval(ui.recTick);
    try { if (mic.rec && mic.rec.state !== "inactive") mic.rec.stop(); } catch (e) {}
    mic.rec = null; markActive(); save(); render();
  }
  var player = null, playerUrl = "";
  function webStopPlay() {
    if (player) { player.pause(); player = null; }
    if (playerUrl) { URL.revokeObjectURL(playerUrl); playerUrl = ""; }
    if (ui.playing) window.onNative("playEnd", "");
  }
  function webPlay(name) {
    webStopPlay();
    var r = null; WR.forEach(function (x) { if (x.name === name) r = x; });
    if (!r) return;
    playerUrl = URL.createObjectURL(r.blob); player = new Audio(playerUrl);
    if (S.out && player.setSinkId) { try { player.setSinkId(S.out); } catch (e) {} }
    player.onended = webStopPlay;
    player.play().then(function () { window.onNative("playStart", name); }, function () { toast("Tinglab bo'lmadi."); webStopPlay(); });
  }
  function webDownload(name) {
    var r = null; WR.forEach(function (x) { if (x.name === name) r = x; });
    if (!r) return;
    var a = document.createElement("a"), u = URL.createObjectURL(r.blob);
    a.href = u; a.download = "poliglot_" + name.split("_").slice(1).join("_"); document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.parentNode.removeChild(a); }, 1000);
  }

  // kompyuterda eslatma: Poliglot oynasi ochiq bo'lsa ishlaydi
  function webReminderTick() {
    if (A || !S.remOn || !("Notification" in window) || Notification.permission !== "granted") return;
    var d = new Date(), hm = pad(d.getHours()) + ":" + pad(d.getMinutes()), t = today();
    if (hm >= S.rem && S.remLast !== t && S.active.indexOf(t) < 0) {
      S.remLast = t; save();
      try { new Notification("Poliglot", { body: statusText() }); } catch (e) {}
    }
  }

  function copyText(txt, okMsg) {
    if (A && A.copy) { try { A.copy(txt); toast(okMsg); return; } catch (e) {} }
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast(okMsg); }, function () { toast("Nusxa olib bo'lmadi: matnni belgilab, Ctrl+C bosing."); });
    else toast("Matnni belgilab, Ctrl+C bosing.");
  }

  // ---------- ovoz ----------
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, srObj = null;
  function pickVoice(lang) {
    if (!("speechSynthesis" in window)) return null;
    var vs = speechSynthesis.getVoices() || [], best = null, bs = -1;
    vs.forEach(function (v) {
      var l = (v.lang || "").replace("_", "-").toLowerCase(), s = 0;
      if (lang === "ar") { if (l.indexOf("ar") !== 0) return; }
      else { if (l.indexOf("en") !== 0) return; if (l === "en-us") s += 4; }
      if (/natural|online/i.test(v.name)) s += 3;
      if (/google/i.test(v.name)) s += 2;
      if (v.localService === false) s += 1;
      if (s > bs) { bs = s; best = v; }
    });
    return best;
  }
  function speak(text, lang) {
    text = text.replace(/\.\.\./g, " ");
    if (A) { try { A.speak(text, lang === "ar" ? "ar" : "en-US", lang === "ar" ? 0.75 : 0.9); return; } catch (e) {} }
    if ("speechSynthesis" in window) {
      var v = pickVoice(lang);
      if (!v && lang === "ar" && speechSynthesis.getVoices().length) { openSheet("arvoice"); return; }
      var u = new SpeechSynthesisUtterance(text); u.lang = lang === "ar" ? "ar-SA" : "en-US"; u.rate = lang === "ar" ? 0.75 : 0.9;
      if (v) u.voice = v;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } else toast("Bu qurilmada ovoz chiqarish yo'q.");
  }

  function norm(s, lang) {
    s = s.toLowerCase();
    if (lang === "ar") s = s.replace(/[ً-ْٰـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    s = s.replace(/\.\.\./g, " ").replace(/[^\p{L}\p{N}\s']/gu, " ");
    return s.split(/\s+/).filter(Boolean);
  }
  function scoreOf(target, heard, lang) {
    var t = norm(target, lang), h = norm(heard, lang), pool = h.slice(), res = [];
    t.forEach(function (w) { var j = pool.indexOf(w); if (j >= 0) { pool.splice(j, 1); res.push({ w: w, ok: true }); } else res.push({ w: w, ok: false }); });
    var ok = res.filter(function (r) { return r.ok; }).length;
    return { pct: t.length ? Math.round(ok * 100 / t.length) : 0, words: res };
  }
  function startCheck(text, lang) {
    if (ui.sh) { shClear(); ui.sh = null; }
    ui.check = { text: text, lang: lang, heard: null };
    openSheet("check");
    listen();
  }
  function listen() {
    if (!ui.check) return;
    ui.check.heard = null; ui.check.listening = true;
    if (!A) {
      if (!SR) { ui.check.listening = false; renderSheet(); toast("Talaffuzni tekshirish uchun Poliglot'ni Edge yoki Chrome'da oching."); return; }
      renderSheet();
      try {
        if (srObj) srObj.abort();
        var c = ui.check, r = new SR();
        r.lang = c.lang === "ar" ? "ar-SA" : "en-US"; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
        r.onresult = function (e) {
          var res = e.results[0], best = "", bs = -1;
          for (var i = 0; i < res.length; i++) { var s = scoreOf(c.text, res[i].transcript, c.lang).pct; if (s > bs) { bs = s; best = res[i].transcript; } }
          window.onNative("speech", best);
        };
        r.onerror = function (e) {
          if (e.error === "aborted") return;
          window.onNative("speechError", e.error === "not-allowed" || e.error === "service-not-allowed" ? "perm" : e.error === "network" ? "net" : e.error === "audio-capture" ? "mic" : "x");
        };
        r.onend = function () { if (srObj === r) srObj = null; if (ui.check === c && c.heard == null) { c.listening = false; renderSheet(); } };
        r.start(); srObj = r;
      } catch (e) { ui.check.listening = false; renderSheet(); toast("Nutqni tanish ishga tushmadi."); }
      return;
    }
    renderSheet();
    try { A.listen(ui.check.lang === "ar" ? "ar-SA" : "en-US"); } catch (e) { toast("Nutqni tanish ishga tushmadi."); }
  }

  window.onNative = function (type, arg) {
    if (type === "speech") { if (ui.check) { ui.check.heard = arg; renderSheet(); } }
    else if (type === "speechError") {
      toast(arg === "none" ? "Telefonda nutqni tanish xizmati topilmadi (Google ilovasini o'rnating)."
        : arg === "perm" ? "Mikrofonga ruxsat berilmadi. Manzil satridagi belgidan ruxsat bering."
        : arg === "net" ? "Talaffuzni tekshirish uchun internet kerak."
        : arg === "mic" ? "Mikrofon topilmadi. Fifine ulanganini tekshiring."
        : "Ovoz eshitilmadi. Qayta urinib ko'ring.");
    }
    else if (type === "tts") {
      if (arg.indexOf("missing:ar") === 0) openSheet("arvoice");
      else if (arg === "notready") toast("Ovoz dvigateli hali tayyor emas, bir soniyadan keyin bosing.");
      else toast("Bu til uchun ovoz o'rnatilmagan.");
    }
    else if (type === "mic") { toast(arg === "granted" ? "Mikrofonga ruxsat berildi. Yozishni qayta bosing." : "Mikrofonga ruxsat berilmadi. Sozlamalardan ruxsat bering."); }
    else if (type === "playStart") { ui.playing = arg; if (ui.tab === "rec") render(); }
    else if (type === "playEnd") { ui.playing = ""; if (ui.tab === "rec") render(); }
    else if (type === "notif") { toast(arg === "granted" ? "Bildirishnomaga ruxsat berildi." : "Bildirishnomaga ruxsat berilmadi: eslatma kelmaydi."); }
  };
  window.onBack = function () {
    if (ui.sheet) { closeSheet(); return true; }
    if (ui.tab !== "today") { ui.tab = "today"; render(); return true; }
    return false;
  };

  // ---------- ikonlar ----------
  var I = {
    flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    tick: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>',
    today: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
    cards: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
    rec: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.3 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.6a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.5.1-.9.1-1.3z"/></svg>',
    micFill: '<svg viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 11a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0zM11 18h2v4h-2z"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'
  };
  function speakBtn(text, lang) { return '<button class="iconbtn speak" data-speak="' + esc(text) + '" data-lang="' + lang + '" aria-label="Tinglash">' + I.sound + "</button>"; }
  // misol gapda iborani ajratib ko'rsatish
  function hlEx(ex, phr) {
    var h = esc(ex);
    phr.split("...").map(function (x) { return x.replace(/^[\s,]+|[\s,.!?]+$/g, ""); }).filter(function (x) { return x.length > 1; }).forEach(function (part) {
      var e = esc(part).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      h = h.replace(new RegExp(e, "i"), function (m) { return "<b>" + m + "</b>"; });
    });
    return h;
  }
  function phrRow(p) {
    return '<div class="phr"><div class="grow"><div class="ex">' + hlEx(p.e, p.p) + '</div><div class="muted small">' + esc(p.eu) + "</div></div>" +
      '<div class="pbtns">' + speakBtn(p.e, "en") + checkBtn(p.e, "en") + "</div></div>";
  }
  function checkBtn(text, lang) { return '<button class="iconbtn" data-check="' + esc(text) + '" data-lang="' + lang + '" aria-label="Talaffuzni tekshirish">' + I.mic + "</button>"; }

  // ---------- render ----------
  var TABS = [["today", "Bugun", I.today], ["map", "Xarita", I.map], ["cards", "Iboralar", I.cards], ["rec", "Yozuvlar", I.rec], ["set", "Sozlama", I.gear]];
  function renderTabs() {
    $("#tabs").innerHTML = TABS.map(function (t) { return '<button data-tab="' + t[0] + '" class="' + (ui.tab === t[0] ? "on" : "") + '">' + t[2] + "<span>" + t[1] + "</span></button>"; }).join("");
  }
  function render() {
    $("#streak").innerHTML = I.flame + "<span>" + streak() + "</span>";
    renderTabs();
    var m = $("#main");
    m.innerHTML = ({ today: vToday, map: vMap, cards: vCards, rec: vRec, set: vSet })[ui.tab]();
    if (ui.tab === "rec") updRecClock();
  }

  function taskRow(tr, d, i, t) {
    var done = !!(S[tr][d] || [])[i];
    var act = "";
    if (t.a === "phr") act = '<button class="btn ghost sm" data-go="phr">Shadowing</button>';
    else if (t.a === "timer") act = '<button class="btn ghost sm" data-go="timer">Taymer</button>';
    else if (t.a === "rec") act = '<button class="btn ghost sm" data-go="rec">Yozish</button>';
    else if (t.a === "report") act = '<button class="btn ghost sm" data-go="report">Hisobot</button>';
    else if (t.a === "arcards") act = '<button class="btn ghost sm" data-go="arcards">Kartochkalar</button>';
    else if (t.a === "story") act = '<button class="btn ghost sm" data-go="story">Hikoyaga o\'tish</button>';
    return '<div class="task ' + (done ? "done" : "") + '"><button class="check" data-toggle="' + tr + "|" + d + "|" + i + '" aria-label="Bajarildi">' + I.tick + '</button>' +
      '<div class="grow"><div class="row"><span class="tt grow">' + esc(t.t) + '</span><span class="muted small">' + t.m + " daq</span></div>" +
      '<div class="td">' + esc(t.d) + "</div>" + (act ? '<div class="btns" style="margin-top:6px">' + act + "</div>" : "") + "</div></div>";
  }

  function arItemHtml(x) {
    var L = x.letter != null ? AR_LETTERS[x.letter] : null, forms = "";
    if (L) { var c = L[0]; forms = L[7] ? c + " ـ" + c : c + "ـ ـ" + c + "ـ ـ" + c; }
    return '<button class="aritem" data-speak="' + esc(L ? L[4] : x.ar) + '" data-lang="ar">' +
      '<span class="big">' + esc(x.ar) + "</span>" + (forms ? '<span class="forms">' + forms + "</span>" : "") +
      '<span class="tr">' + esc(x.tr) + '</span><span class="uz">' + esc(x.uz) + "</span>" +
      (L ? '<span class="uz">Misol: <span class="arw" style="font-size:20px">' + esc(x.ex) + "</span> " + esc(x.exTr) + " — " + esc(x.exUz) + "</span>" : "") +
      "</button>";
  }

  // ---------- kun hikoyasi ----------
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function forgotBefore(d) { return Object.keys(S.forgot).filter(function (k) { return S.forgot[k] < d; }); }
  function storyHtml(d) {
    var s = STORIES[d]; if (!s) return "";
    var map = {}, fu = S.forgotUz || {};
    storyReviewWords(d).forEach(function (x) { map[x.en.toLowerCase()] = { uz: x.uz, c: "rev" }; });
    forgotBefore(d).forEach(function (k) { if (!map[k.toLowerCase()]) map[k.toLowerCase()] = { uz: fu[k] || "", c: "rev" }; });
    s.w.forEach(function (x) { map[x[0].toLowerCase()] = { uz: x[1], c: "new" }; });
    var keys = Object.keys(map).sort(function (a, b) { return b.length - a.length; });
    var re = new RegExp("\\b(" + keys.map(reEsc).join("|") + ")\\b", "gi");
    var body = "", last = 0, m;
    while ((m = re.exec(s.text))) {
      var k = map[m[0].toLowerCase()];
      body += esc(s.text.slice(last, m.index)) + '<button class="w ' + k.c + '" data-mean="' + esc(m[0] + " — " + k.uz) + '">' + esc(m[0]) + "</button>";
      last = m.index + m[0].length;
    }
    body += esc(s.text.slice(last));
    var h = '<section class="card" id="story"><div class="row"><span class="pill en">Kun hikoyasi</span><span class="grow"></span>' + speakBtn(s.text, "en") + "</div>" +
      "<h2>" + esc(s.title) + '</h2><div class="muted small"><b class="lg new">Yangi so\'zlar</b> · <b class="lg rev">Takrorlanadigan so\'zlar</b> — so\'zni bossangiz, tarjimasi chiqadi.</div>' +
      '<p class="story">' + body + "</p>";
    if (s.hadith) h += '<div class="hadith"><div class="hen">' + esc(s.hadith.en) + '</div><div class="huz">' + esc(s.hadith.uz) + '</div><div class="muted small">' + esc(s.hadith.src) + "</div></div>";
    h += '<h3>Savollar</h3><ol class="qs">' + s.q.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol>" +
      '<h3>O\'zingiz haqida qayta ayting</h3><div class="retell">' + esc(s.retell) + "</div>" +
      '<h3>Bugungi so\'zlar</h3><div class="muted small">Eslay olmagan so\'zingizni bosib belgilang — u keyingi kunlarda yana chiqadi.</div><div class="chips">' +
      s.w.map(function (x) { var f = S.forgot[x[0]] != null; return '<button class="chip ' + (f ? "on" : "") + '" data-forgot="' + esc(x[0]) + '" data-fuz="' + esc(x[1]) + '"><b>' + esc(x[0]) + "</b> " + esc(x[1]) + (f ? " · unutdim" : "") + "</button>"; }).join("") + "</div>";
    var fb = forgotBefore(d);
    if (fb.length) h += '<h3>Takrorlang: oldin unutilgan so\'zlar</h3><div class="muted small">Eslasangiz, bosing — ro\'yxatdan chiqadi.</div><div class="chips">' +
      fb.map(function (k) { return '<button class="chip rev" data-remember="' + esc(k) + '"><b>' + esc(k) + "</b> " + esc(fu[k] || "") + " · esladim ✓</button>"; }).join("") + "</div>";
    return h + "</section>";
  }

  function vToday() {
    var d = ui.day, w = weekOf(d), wk = WEEKS[w - 1], en = EN_DAYS[d], ar = AR_DAYS[d];
    var tot = dayTotal(d), cnt = dayCount(d), pct = Math.round(cnt * 100 / tot);
    var enT = enTasks(d), arT = arTasks(d), rev = d % 7 === 0;
    var enMin = enT.reduce(function (a, t) { return a + t.m; }, 0), arMin = arT.reduce(function (a, t) { return a + t.m; }, 0);
    var h = '<section class="card"><div class="daybar"><button class="iconbtn" data-day="' + (d - 1) + '" ' + (d <= 1 ? "disabled" : "") + ' aria-label="Oldingi kun">' + I.left + '</button>' +
      '<div class="grow"><div class="num">' + d + "-kun <small>/ 30</small></div><div class=\"muted small\">" + w + "-hafta · " + esc(wk.en) + (rev ? " · <b>Haftalik nazorat (yakshanba)</b>" : "") + "</div></div>" +
      '<button class="iconbtn" data-day="' + (d + 1) + '" ' + (d >= 30 ? "disabled" : "") + ' aria-label="Keyingi kun">' + I.right + "</button></div>" +
      '<div class="bar"><i style="width:' + pct + '%"></i></div><div class="row small muted"><span class="grow">' + cnt + " / " + tot + " vazifa · ~" + (enMin + arMin) + " daqiqa</span>" +
      (dayDone(d) ? '<span class="pill ok">Kun bajarildi</span>' : d === curDay() ? '<span class="pill en">Bugungi kun</span>' : "") + "</div></section>";

    h += storyHtml(d);

    // Ingliz
    h += '<section class="card"><div class="row"><span class="pill en">Ingliz tili · B1</span><span class="muted small grow" style="text-align:right">' + enMin + " daq</span></div>" +
      "<h2>" + esc(en[0]) + '</h2><ol class="qs">' + en[1].map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol>" +
      '<div class="phrbox" id="phr"><div class="row"><h3 class="grow">Kun iboralari — javobda ishlating</h3><button class="btn acc sm" data-act="shadow">Shadowing</button></div>' +
      phrasesFor(d).map(phrRow).join("") + "</div>" +
      enT.map(function (t, i) { return taskRow("en", d, i, t); }).join("") + "</section>";

    // Arab
    h += '<section class="card"><div class="row"><span class="pill ar">Arab tili · 0 dan</span><span class="muted small grow" style="text-align:right">' + arMin + " daq</span></div>" +
      "<h2>" + esc(ar.t) + '</h2><div class="muted small">' + esc(WEEKS[w - 1].ar) + ". Arab yozuvi o'ngdan chapga o'qiladi. Kartochkani bossangiz, o'qilishini eshitasiz.</div>" +
      '<div class="argrid">' + arItems(d).map(arItemHtml).join("") + "</div>" +
      arT.map(function (t, i) { return taskRow("ar", d, i, t); }).join("") + "</section>";

    // Hisobot
    var r = S.reports[d] || {};
    h += '<section class="card" id="report"><h2>Kunlik hisobot</h2><div class="muted small">Har kuni kechqurun to\'ldiring va Claude\'ga yuboring: men baholab, ertangi kunga maslahat beraman.</div>' +
      '<label class="f" for="rmin">Bugun necha daqiqa mashq qildingiz?<input id="rmin" type="number" min="0" max="300" inputmode="numeric" value="' + (r.min != null ? r.min : "") + '"></label>' +
      '<div class="f small muted">Ravonligingizni baholang (1 — qiyin, 5 — erkin)</div><div class="rate">' +
      [1, 2, 3, 4, 5].map(function (n) { return '<button data-rate="' + n + '" class="' + (r.rate === n ? "on" : "") + '">' + n + "</button>"; }).join("") + "</div>" +
      '<label class="f" for="rnote">Nima qiyin bo\'ldi? Nimani yaxshi qildingiz?<textarea id="rnote">' + esc(r.note || "") + "</textarea></label>" +
      '<div class="btns"><button class="btn" data-act="saveReport">Saqlash</button><button class="btn acc" data-act="sendReport">Claude\'ga yuborish</button></div></section>';
    return h;
  }

  function vMap() {
    var cd = curDay(), mins = 0, rates = [], h = "";
    Object.keys(S.reports).forEach(function (k) { var r = S.reports[k]; if (r.min) mins += +r.min; if (r.rate) rates.push(r.rate); });
    var avg = rates.length ? (rates.reduce(function (a, b) { return a + b; }, 0) / rates.length).toFixed(1) : "—";
    h += '<div class="tiles"><div class="tile"><b>' + streak() + '</b><span>seriya</span></div><div class="tile"><b>' + doneDays() + '</b><span>kun bajarildi</span></div>' +
      '<div class="tile"><b>' + mins + '</b><span>daqiqa</span></div><div class="tile"><b>' + avg + "</b><span>o'rtacha baho</span></div></div>";
    h += '<section class="card"><h2>30 kunlik yo\'l xaritasi</h2><div class="muted small">Har hafta: ingliz tilida bitta ko\'nikma, arab tilida bitta qadam. To\'q sariq nuqta — yakshanba nazorati.</div>';
    WEEKS.forEach(function (wk) {
      var from = (wk.n - 1) * 7 + 1, to = wk.n === 5 ? 30 : wk.n * 7;
      h += '<div class="wk"><div class="wh"><b>' + wk.n + "-hafta · " + esc(wk.en) + '</b><span class="muted">Arab: ' + esc(wk.ar) + '</span></div><div class="muted small">Maqsad: ' + esc(wk.goal) + '</div><div class="cells">';
      for (var d = from; d <= to; d++) {
        var cls = dayDone(d) ? "done" : dayCount(d) > 0 ? "half" : d === cd ? "cur" : "";
        if (d % 7 === 0) cls += " rev";
        h += '<button class="cell ' + cls + '" data-open="' + d + '" aria-label="' + d + '-kun">' + d + "</button>";
      }
      h += "</div></div>";
    });
    h += "</section>";
    h += '<section class="card"><h2>Ravonlik bahosi</h2><div class="muted small">Har kungi hisobotdagi bahoingiz (1-5).</div><div class="chart">';
    for (var d2 = 1; d2 <= 30; d2++) { var rr = (S.reports[d2] || {}).rate; h += '<i class="' + (rr ? "" : "none") + '" style="height:' + (rr ? rr * 20 : 2) + '%" title="' + d2 + '-kun"></i>'; }
    h += '</div><div class="row small muted"><span class="grow">1-kun</span><span>30-kun</span></div></section>';
    return h;
  }

  function cardList() {
    if (ui.phrLang === "en") {
      var uzFirst = S.cardDir !== "en";
      return EN_PHR.map(function (p, i) { return { id: i, c: p[0], f: uzFirst ? p[2] : p[1], b: uzFirst ? p[1] : p[2], en: p[1], ex: p[3] || "", exU: p[4] || "", uzf: uzFirst }; }).filter(function (x) { return ui.cat === "all" || x.c === ui.cat || (ui.cat === "rep" && S.known.en.indexOf(x.id) < 0); });
    }
    var out = [], seen = {}, cd = Math.max(curDay(), ui.day);
    for (var d = 1; d <= cd; d++) {
      var day = AR_DAYS[d]; if (day.k === "review") continue;
      day.items.forEach(function (x) { if (seen[x.ar]) return; seen[x.ar] = 1; out.push({ id: x.ar, f: x.ar, b: x.tr + " — " + (x.letter != null ? x.uz : x.uz) }); });
    }
    if (ui.cat === "rep") out = out.filter(function (x) { return S.known.ar.indexOf(x.id) < 0; });
    return out;
  }
  function vCards() {
    var en = ui.phrLang === "en", list = cardList();
    if (ui.card >= list.length) ui.card = 0;
    var c = list[ui.card], known = S.known[ui.phrLang];
    var h = '<div class="chips"><button class="chip ' + (en ? "on" : "") + '" data-plang="en">Ingliz</button><button class="chip ' + (!en ? "on" : "") + '" data-plang="ar">Arab</button>' +
      (en ? '<span class="grow"></span><button class="chip" data-act="cardDir" aria-label="Yo\'nalishni almashtirish">' + (S.cardDir !== "en" ? "O'zbekcha → inglizcha" : "Inglizcha → o'zbekcha") + " ⇄</button>" : "") + "</div>";
    var cats = en ? [["all", "Hammasi"], ["rep", "Takrorlash"]].concat(Object.keys(EN_CATS).map(function (k) { return [k, EN_CATS[k]]; })) : [["all", "Hammasi"], ["rep", "Takrorlash"]];
    h += '<div class="chips">' + cats.map(function (x) { return '<button class="chip ' + (ui.cat === x[0] ? "on" : "") + '" data-cat="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div>";
    if (!c) return h + '<section class="card"><h2>Bu yerda karta yo\'q</h2><div class="muted">"Takrorlash" bo\'sh bo\'lsa — hammasini bilasiz. Barakalla!</div></section>';
    var uzf = en && c.uzf, sayTxt = en ? (c.ex || c.en) : c.f;
    h += '<button class="flash" data-act="flip"><div class="f1 ' + (en ? "" : "arabic") + '">' + esc(c.f) + "</div>" +
      (ui.flip ? '<div class="f2' + (uzf ? " big" : "") + '">' + esc(c.b) + "</div>" + (en && c.ex ? '<div class="f3"><div>' + hlEx(c.ex, c.en) + '</div><span>' + esc(c.exU) + "</span></div>" : "")
        : '<div class="hint">' + (uzf ? "Inglizchasini ovoz chiqarib ayting, keyin ag'daring" : "Ma'nosini ayting, keyin ag'daring") + "</div>") + "</button>";
    h += '<div class="row"><span class="muted small grow">' + (ui.card + 1) + " / " + list.length + " · bilaman: " + known.length + "</span>" +
      (uzf && !ui.flip ? "" : speakBtn(sayTxt, ui.phrLang) + checkBtn(sayTxt, ui.phrLang)) + "</div>";
    h += '<div class="btns"><button class="btn ghost grow" data-act="again">Takrorlash</button><button class="btn grow" style="background:var(--ok)" data-act="know">Bilaman</button></div>';
    if (!en) {
      h += '<section class="card"><h2>Arab alifbosi</h2><div class="muted small">28 harf. Harfni bossangiz, misol so\'z o\'qiladi. Ikkinchi qatorda: alohida, boshida, o\'rtada, oxirida.</div><div class="argrid">' +
        AR_LETTERS.map(function (L, i) { return arItemHtml({ ar: L[0], tr: L[1] + " — " + L[2], uz: L[3], ex: L[4], exTr: L[5], exUz: L[6], letter: i }); }).join("") + "</div></section>";
    }
    return h;
  }

  function recs() {
    if (!A) return WR.map(function (r) { return { name: r.name, time: r.time, dur: r.dur }; });
    try { return JSON.parse(A.listRecordings() || "[]"); } catch (e) { return []; }
  }
  function micName() {
    var l = S.mic ? S.micLabel : "";
    if (!l) mic.devices.forEach(function (d) { if (d.deviceId === "default" && d.label) l = d.label.replace(/^(Default|По умолчанию)\s*-\s*/i, ""); });
    return l ? l.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, "") : "";
  }
  function vRec() {
    var h = '<section class="card"><h2>O\'zingizni yozib oling</h2><div class="muted small">' + ui.day + "-kun mavzusi: <b>" + esc(EN_DAYS[ui.day][0]) + "</b>. Yozing → tinglang → qayerda to'xtaganingizni toping → qayta yozing.</div>";
    if (!A) h += '<div class="row small"><span class="grow muted">Mikrofon: <b style="color:var(--ink)">' + esc(micName() || "tizimdagi asosiy") + '</b></span><button class="btn ghost sm" data-tab="set">O\'zgartirish</button></div>';
    h += '<button class="recbig ' + (ui.recOn ? "on" : "") + '" data-act="rec" aria-label="' + (ui.recOn ? "To'xtatish" : "Yozishni boshlash") + '">' + (ui.recOn ? I.stop : I.micFill) + '</button><div class="clock" id="recClock">00:00</div>' +
      (!A && ui.recOn ? '<div class="meter"><i id="recMeter"></i></div>' : "") +
      (!A ? '<div class="muted small" style="text-align:center">Probel (Space) tugmasi bilan ham yozishni boshlash/to\'xtatish mumkin.</div>' : "") + "</section>";
    var list = recs();
    h += '<section class="card"><h2>Yozuvlarim</h2>';
    if (!list.length) h += '<div class="muted small">Hali yozuv yo\'q. 1-kundagi yozuvingizni saqlab qo\'ying: 30-kuni solishtirasiz.</div>';
    list.forEach(function (r) {
      var on = ui.playing === r.name, m = Math.floor(r.dur / 60000), s = Math.round((r.dur % 60000) / 1000);
      var tag = (r.name.split("_")[1] || "").replace(/\.\w+$/, ""), dt = new Date(r.time);
      h += '<div class="recitem"><button class="iconbtn" data-play="' + esc(r.name) + '" aria-label="' + (on ? "To'xtatish" : "Tinglash") + '">' + (on ? I.stop : I.sound) + "</button>" +
        '<div class="grow"><b>' + esc(tag.replace("-", " - ")) + '</b><div class="muted small">' + pad(dt.getDate()) + "." + pad(dt.getMonth() + 1) + " " + pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + " · " + m + ":" + pad(s) + "</div></div>" +
        (!A ? '<button class="btn ghost sm" data-dl="' + esc(r.name) + '">Yuklab olish</button>' : "") +
        '<button class="btn ghost sm" data-del="' + esc(r.name) + '">O\'chirish</button></div>';
    });
    h += "</section>";
    h += '<section class="card"><h2>Gapirish taymeri</h2><div class="muted small">To\'xtamasdan gapirish uchun.</div><button class="btn" data-go="timer">Taymerni ochish</button></section>';
    return h;
  }

  function vMic() {
    var h = '<section class="card"><h2>Mikrofon</h2><div class="muted small">Fifine USB mikrofonini ulang: Poliglot uni o\'zi topib tanlaydi. Ovoz yozish shu tanlangan mikrofondan bo\'ladi.</div>';
    var labeled = mic.devices.filter(function (d) { return d.label; });
    if (!hasMD) h += '<div class="note">Bu brauzer mikrofonni qo\'llamaydi. Poliglot\'ni Edge yoki Chrome\'da oching.</div>';
    else if (!labeled.length) h += '<div class="btns"><button class="btn acc" data-act="micFind">Mikrofonni topish</button></div><div class="muted small">Brauzer ruxsat so\'raydi: "Ruxsat berish" (Allow) ni bosing.</div>';
    else {
      h += '<label class="f" for="micSel">Qaysi mikrofon<select id="micSel">' + labeled.map(function (d) {
        return '<option value="' + esc(d.deviceId) + '"' + (d.deviceId === S.mic ? " selected" : "") + ">" + esc(d.label.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, "")) + "</option>";
      }).join("") + "</select></label>";
      var fif = labeled.some(isFifine), sel = labeled.filter(function (d) { return d.deviceId === S.mic; })[0];
      if (sel && isFifine(sel)) h += '<div><span class="pill ok">Fifine tanlangan</span></div>';
      else if (!fif) h += '<div class="note">Fifine topilmadi. USB kabelini ulang, keyin ro\'yxat o\'zi yangilanadi.</div>';
      h += '<div class="meter"><i id="testMeter"></i></div><div class="btns"><button class="btn ' + (mic.testing ? "" : "acc") + '" data-act="micTest">' + (mic.testing ? "To'xtatish" : "Ovozni sinash") + "</button></div>" +
        '<div class="muted small">Gapirganda chiziq yarmigacha chiqsin. Qizarsa — Fifine\'dagi GAIN (ovoz kuchi) murvatini kamaytiring, juda past bo\'lsa — oshiring. Mikrofonga 10-15 sm masofada gapiring.</div>';
    }
    h += '<div class="note"><b>Talaffuzni tekshirish</b> (mikrofon tugmasi) brauzerning asosiy mikrofonini ishlatadi. Fifine\'ni asosiy qiling: Windows <b>Sozlamalar → Tizim → Ovoz → Kirish (Input)</b> → Fifine. Internet kerak.</div></section>';
    return h;
  }

  function vSet() {
    var h = A ? "" : vMic();
    h += '<section class="card"><h2>Kunlik eslatma</h2><div class="muted small">' + (A ? "Har kuni shu vaqtda telefon sizga bugungi vazifani eslatadi." : "Kompyuterda eslatma faqat Poliglot oynasi ochiq turganda keladi.") + '</div>' +
      '<label class="f" for="remt">Vaqt<input id="remt" type="time" value="' + esc(S.rem) + '"></label>' +
      '<div class="btns"><button class="btn acc" data-act="remOn">' + (S.remOn ? "Vaqtni yangilash" : "Eslatmani yoqish") + '</button>' + (S.remOn ? '<button class="btn ghost" data-act="remOff">O\'chirish</button>' : "") + "</div>" +
      '<div class="small ' + (S.remOn ? "" : "muted") + '">' + (S.remOn ? "Eslatma yoqilgan: har kuni " + esc(S.rem) : "Eslatma o'chiq") + "</div></section>";
    h += '<section class="card"><h2>Arab ovozi</h2><div class="muted small">Arabcha so\'zlarni eshitish uchun ' + (A ? "telefonda" : "kompyuterda") + ' arab ovozi o\'rnatilgan bo\'lishi kerak.</div><div class="btns"><button class="btn ghost" data-speak="السَّلَامُ عَلَيْكُمْ" data-lang="ar">Tekshirish</button><button class="btn ghost" data-act="arHelp">Qanday o\'rnatiladi?</button></div></section>';
    h += '<section class="card"><h2>Speakingni oshirish qoidalari</h2><ol class="rules">' +
      "<li><b>Har kuni ovoz chiqarib gapiring.</b> Ichingizda emas, baland ovozda.</li>" +
      "<li><b>O'zingizni yozib, tinglang.</b> Xatolar eshitilganda tuzaladi.</li>" +
      "<li><b>Shadowing.</b> Diktor bilan bir vaqtda, ohangiga taqlid qilib takrorlang.</li>" +
      "<li><b>Tayyor iboralar.</b> So'zni emas, butun iborani yodlang.</li>" +
      "<li><b>Jonli suhbat.</b> Haftada kamida 3 marta odam yoki Claude bilan gaplashing.</li>" +
      "<li><b>Muntazamlik.</b> Har kuni 30 daqiqa haftada bir 3 soatdan foydaliroq.</li></ol></section>";
    h += '<section class="card"><h2>Ma\'lumotlar</h2><div class="muted small">Dastur ' + fmtDate(S.start) + " kuni boshlangan. Hamma ma'lumot shu " + (A ? "telefonda" : "kompyuterda") + " saqlanadi. Telefon va kompyuter progressi alohida: birini ikkinchisiga ko'chirish mumkin.</div>" +
      '<div class="btns"><button class="btn ghost" data-act="sync">Progressni ko\'chirish</button><button class="btn ghost" data-act="reset">Progressni boshidan boshlash</button></div></section>';
    return h;
  }

  // ---------- pastki oyna (sheet) ----------
  function openSheet(kind) { ui.sheet = kind; renderSheet(); }
  function closeSheet() { if (ui.sh) { shClear(); ui.sh = null; } if (srObj) { try { srObj.abort(); } catch (e) {} srObj = null; } ui.sheet = null; ui.check = null; $("#layer").innerHTML = ""; }
  function renderSheet() {
    var L = $("#layer"), h = "";
    if (!ui.sheet) { L.innerHTML = ""; return; }
    if (ui.sheet === "check" && ui.check) {
      var c = ui.check, ar = c.lang === "ar";
      h = "<h2>Talaffuzni tekshirish</h2><div class=\"muted small\">Ibora:</div><div class=\"" + (ar ? "arw" : "p") + '" style="font-weight:700;font-size:' + (ar ? 30 : 18) + 'px">' + esc(c.text) + "</div>";
      if (c.heard == null) h += c.listening ? '<div class="listen"><i></i>' + (A ? "Gapiring... (Google oynasi ochiladi)" : "Gapiring... mikrofon tinglayapti") + "</div>"
        : '<div class="muted">Ovoz eshitilmadi. «Qayta aytish» ni bosib, aniq va balandroq ayting.</div>';
      else {
        var sc = scoreOf(c.text, c.heard, c.lang);
        h += '<div class="score" style="color:' + (sc.pct >= 80 ? "var(--ok)" : sc.pct >= 50 ? "var(--accent)" : "#C0392B") + '">' + sc.pct + "%</div>" +
          '<div class="muted small">Telefon eshitdi: <b>' + esc(c.heard || "—") + "</b></div>" +
          '<div class="small">So\'zlar: ' + sc.words.map(function (w) { return '<span class="' + (w.ok ? "hit" : "miss") + '">' + esc(w.w) + "</span>"; }).join(" ") + "</div>" +
          '<div class="muted small">' + (sc.pct >= 80 ? "Zo'r! Endi tezroq va tabiiyroq ayting." : "Qizil so'zlarni tinglab, sekin takrorlang, keyin yana tekshiring.") + "</div>";
      }
      h += '<div class="btns"><button class="btn ghost" data-speak="' + esc(c.text) + '" data-lang="' + c.lang + '">Tinglash</button><button class="btn acc" data-act="relisten">Qayta aytish</button><button class="btn ghost" data-act="close">Yopish</button></div>';
    } else if (ui.sheet === "shadow" && ui.sh) {
      var sh = ui.sh, it = sh.list[sh.i];
      h = '<div class="row"><h2 class="grow">Shadowing</h2><span class="muted small">' + (sh.i + 1) + " / " + sh.list.length + "</span></div>" +
        '<div class="muted small">Har gap 3 marta: avval tinglang, keyin pauzada ovoz chiqarib, xuddi shu ohangda takrorlang.</div>' +
        '<div class="shbox"><div class="ex big">' + hlEx(it.e, it.p) + '</div><div class="muted small">' + esc(it.eu) + "</div></div>" +
        '<div class="shstate ' + sh.phase + '">' + (sh.phase === "listen" ? "Tinglang..." : sh.phase === "you" ? "Endi siz ayting!" : "Pauza") + ' <span class="muted small">' + Math.min(sh.rep + 1, 3) + "/3</span></div>" +
        '<div class="meter"><i id="shBar"></i></div>' +
        '<div class="btns"><button class="btn ghost" data-act="shPrev"' + (sh.i === 0 ? " disabled" : "") + '>Oldingi</button><button class="btn acc grow" data-act="shPause">' + (sh.run ? "Pauza" : "Davom etish") + '</button><button class="btn ghost" data-act="shNext">Keyingi</button></div>' +
        '<div class="btns"><button class="btn ghost" data-check="' + esc(it.e) + '" data-lang="en">Talaffuzni tekshirish</button><button class="btn ghost" data-act="close">Yopish</button></div>';
    } else if (ui.sheet === "timer") {
      var t = ui.timer, mm = Math.floor(t.left / 60), ss = t.left % 60;
      h = '<h2>Gapirish taymeri</h2><div class="chips">' + [60, 120, 180, 300].map(function (s) { return '<button class="chip ' + (t.sec === s ? "on" : "") + '" data-tsec="' + s + '">' + s / 60 + " daq</button>"; }).join("") + "</div>" +
        '<div class="clock" id="tclock">' + pad(mm) + ":" + pad(ss) + '</div><div class="muted small" style="text-align:center">To\'xtamang. So\'z topolmasangiz, boshqacha ayting.</div>' +
        '<div class="cue"><b>' + esc(EN_DAYS[ui.day][0]) + '</b><ol class="qs">' + EN_DAYS[ui.day][1].map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol>" +
        '<div class="cuephr">' + phrasesFor(ui.day).map(function (p) { return "<span>" + esc(p.p) + "</span>"; }).join("") + "</div></div>" +
        '<div class="btns"><button class="btn acc grow" data-act="tgo">' + (t.run ? "To'xtatish" : "Boshlash") + '</button><button class="btn ghost" data-act="close">Yopish</button></div>';
    } else if (ui.sheet === "arvoice" && !A) {
      h = "<h2>Kompyuterda arab ovozi</h2><ol class=\"rules\"><li><b>Eng osoni:</b> Poliglot'ni <b>Microsoft Edge</b>'da oching — unda arab ovozlari (Hamed, Zariyah) tayyor turadi.</li><li>Chrome'da: Windows <b>Sozlamalar → Vaqt va til → Nutq → Ovozlarni boshqarish → Ovoz qo'shish</b> → <b>العربية</b> ni o'rnating, keyin brauzerni qayta oching.</li></ol><div class=\"btns\"><button class=\"btn\" data-act=\"close\">Tushunarli</button></div>";
    } else if (ui.sheet === "sync") {
      h = "<h2>Progressni ko'chirish</h2><div class=\"muted small\">1) Eski qurilmada <b>Nusxa olish</b> ni bosing va kodni Telegram \"Saqlangan xabarlar\" ga yuboring. 2) Yangi qurilmada kodni pastdagi maydonga joylab, <b>Yuklash</b> ni bosing. Yangi qurilmadagi progress almashtiriladi.</div>" +
        "<div class=\"btns\"><button class=\"btn acc\" data-act=\"syncCopy\">Nusxa olish</button></div>" +
        "<label class=\"f\" for=\"syncIn\">Kodni shu yerga joylang<textarea id=\"syncIn\" placeholder=\"POLIGLOT:...\"></textarea></label>" +
        "<div class=\"btns\"><button class=\"btn\" data-act=\"syncLoad\">Yuklash</button><button class=\"btn ghost\" data-act=\"close\">Yopish</button></div>";
    } else if (ui.sheet === "arvoice") {
      h = "<h2>Arab ovozini o'rnatish</h2><ol class=\"rules\"><li>Telefon <b>Sozlamalar</b> → <b>Tizim</b> (yoki Umumiy boshqaruv) → <b>Til va kiritish</b>.</li><li><b>Matnni nutqqa aylantirish</b> → <b>Google nutq xizmatlari</b> → sozlamalar (⚙).</li><li><b>Ovoz ma'lumotlarini o'rnatish</b> → <b>العربية (Arab)</b> → yuklab oling.</li><li>Poliglot'ga qaytib, so'zni qayta bosing.</li></ol><div class=\"muted small\">Talaffuzni tekshirish uchun ham Google ilovasi arab tilini tanishi kerak (Google → Sozlamalar → Ovoz → Oflayn nutqni tanish → Arab).</div><div class=\"btns\"><button class=\"btn\" data-act=\"close\">Tushunarli</button></div>";
    } else if (ui.sheet === "reset") {
      h = "<h2>Progressni o'chirasizmi?</h2><div class=\"muted\">Belgilar, hisobotlar va seriya o'chadi. Yozuvlar qoladi.</div><div class=\"btns\"><button class=\"btn\" style=\"background:#C0392B\" data-act=\"resetYes\">Ha, o'chirish</button><button class=\"btn ghost\" data-act=\"close\">Bekor qilish</button></div>";
    } else if (ui.sheet.indexOf("del:") === 0) {
      h = "<h2>Yozuvni o'chirasizmi?</h2><div class=\"btns\"><button class=\"btn\" style=\"background:#C0392B\" data-act=\"delYes\">O'chirish</button><button class=\"btn ghost\" data-act=\"close\">Bekor qilish</button></div>";
    }
    L.innerHTML = '<div class="sheet-bg" data-act="bg"><div class="sheet" role="dialog">' + h + "</div></div>";
  }

  // ---------- shadowing: tinglash → takrorlash, har gap 3 marta ----------
  function shDur(t) { var w = t.split(/\s+/).length; return Math.round((w * 0.42 + 0.8) / 0.9 * 1000); }
  function startShadow() {
    var list = phrasesFor(ui.day);
    ui.sh = { list: list, i: 0, rep: 0, phase: "pause", run: true, h: null, t0: 0, len: 0 };
    openSheet("shadow"); shGo();
  }
  function shClear() { if (ui.sh && ui.sh.h) { clearTimeout(ui.sh.h); ui.sh.h = null; } if (ui.sh && ui.sh.bar) { cancelAnimationFrame(ui.sh.bar); ui.sh.bar = null; } }
  function shBar(len) {
    var sh = ui.sh; sh.t0 = Date.now(); sh.len = len;
    (function f() { var el = document.getElementById("shBar"); if (el) el.style.width = Math.min(100, (Date.now() - sh.t0) * 100 / sh.len) + "%"; if (ui.sh === sh && sh.run) sh.bar = requestAnimationFrame(f); })();
  }
  function shGo() {
    var sh = ui.sh; if (!sh || !sh.run || ui.sheet !== "shadow") return;
    shClear();
    var it = sh.list[sh.i], d = shDur(it.e);
    sh.phase = "listen"; renderSheet(); speak(it.e, "en"); shBar(d);
    sh.h = setTimeout(function () {
      sh.phase = "you"; renderSheet(); shBar(Math.round(d * 1.3));
      sh.h = setTimeout(function () {
        sh.rep++;
        if (sh.rep >= 3) { sh.rep = 0; if (sh.i < sh.list.length - 1) sh.i++; else { sh.run = false; sh.phase = "pause"; sh.i = 0; markActive(); save(); renderSheet(); toast("Barakalla! Shadowing tugadi. Endi savollarga javob bering."); return; } }
        shGo();
      }, Math.round(d * 1.3));
    }, d + 300);
  }
  function shToggle() { var sh = ui.sh; if (!sh) return; sh.run = !sh.run; if (sh.run) shGo(); else { shClear(); sh.phase = "pause"; if ("speechSynthesis" in window) speechSynthesis.cancel(); renderSheet(); } }
  function shStep(k) { var sh = ui.sh; if (!sh) return; sh.i = Math.max(0, Math.min(sh.list.length - 1, sh.i + k)); sh.rep = 0; sh.run = true; shGo(); }

  // ---------- taymer ----------
  var actx = null;
  function beep() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.35, 0.7].forEach(function (t) { var o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = 880; g.gain.value = 0.2; o.connect(g); g.connect(actx.destination); o.start(actx.currentTime + t); o.stop(actx.currentTime + t + 0.2); });
    } catch (e) {}
  }
  function timerToggle() {
    var t = ui.timer;
    if (t.run) { clearInterval(t.h); t.run = false; renderSheet(); return; }
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    if (t.left <= 0) t.left = t.sec;
    t.run = true; renderSheet();
    t.h = setInterval(function () {
      t.left--;
      var el = document.getElementById("tclock"); if (el) el.textContent = pad(Math.floor(t.left / 60)) + ":" + pad(t.left % 60);
      if (t.left <= 0) { clearInterval(t.h); t.run = false; beep(); t.left = t.sec; if (ui.sheet === "timer") renderSheet(); toast("Vaqt tugadi! Yaxshi gapirdingiz."); }
    }, 1000);
  }

  // ---------- yozish ----------
  function updRecClock() {
    var el = document.getElementById("recClock"); if (!el) return;
    var s = ui.recOn ? Math.floor((Date.now() - ui.recT0) / 1000) : 0;
    el.textContent = pad(Math.floor(s / 60)) + ":" + pad(s % 60);
  }
  function recToggle() {
    if (!A) { if (ui.recOn) webRecStop(); else webRecStart(); return; }
    if (ui.recOn) {
      var name = ""; try { name = A.stopRecording(); } catch (e) {}
      ui.recOn = false; clearInterval(ui.recTick);
      markActive(); save();
      toast(name ? "Saqlandi. Endi tinglang!" : "Yozuv saqlanmadi.");
      render(); return;
    }
    var ok = false; try { ok = A.startRecording(ui.day + "-kun"); } catch (e) {}
    if (!ok) { toast("Mikrofonga ruxsat bering va qayta bosing."); return; }
    ui.recOn = true; ui.recT0 = Date.now(); ui.recTick = setInterval(updRecClock, 500); render();
  }

  // ---------- hisobot ----------
  function readReport() {
    var d = ui.day, r = S.reports[d] || {};
    var mi = $("#rmin"), no = $("#rnote");
    if (mi) r.min = mi.value === "" ? null : Math.max(0, Math.min(300, parseInt(mi.value, 10) || 0));
    if (no) r.note = no.value.trim();
    r.at = today(); S.reports[d] = r; return r;
  }
  function reportText() {
    var d = ui.day, r = S.reports[d] || {}, en = enTasks(d), ar = arTasks(d);
    var ec = (S.en[d] || []).filter(Boolean).length, ac = (S.ar[d] || []).filter(Boolean).length;
    return "Poliglot hisobot — " + d + "-kun (" + fmtDate(today()) + ")\n" +
      "Ingliz (" + EN_DAYS[d][0] + "): " + ec + "/" + en.length + " vazifa\n" +
      "Arab (" + AR_DAYS[d].t + "): " + ac + "/" + ar.length + " vazifa\n" +
      "Vaqt: " + (r.min != null ? r.min : "?") + " daqiqa · Ravonlik: " + (r.rate || "?") + "/5\n" +
      "Unutilgan so'zlar: " + (Object.keys(S.forgot).filter(function (k) { return S.forgot[k] === d; }).join(", ") || "—") + "\n" +
      "Seriya: " + streak() + " kun · Bajarilgan kunlar: " + doneDays() + "/30\n" +
      "Izoh: " + (r.note || "—");
  }

  // ---------- toast ----------
  var tH = null;
  function toast(msg) {
    var el = document.querySelector(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; clearTimeout(tH); tH = setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
  }

  // ---------- hodisalar ----------
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button,[data-act]"); if (!b) return;
    var ds = b.dataset;
    if (ds.act === "bg" && e.target !== b) return; // sheet ichini bosish yopmaydi
    if (ds.tab) { if (mic.testing && ds.tab !== "set") { mic.testing = false; stopMeter(); if (!ui.recOn) stopStream(); } ui.tab = ds.tab; if (ds.tab === "today") ui.day = ui.day || curDay(); render(); window.scrollTo(0, 0); return; }
    if (ds.speak) { speak(ds.speak, ds.lang); return; }
    if (ds.mean) { toast(ds.mean); return; }
    if (ds.forgot) {
      S.forgotUz = S.forgotUz || {};
      if (S.forgot[ds.forgot] != null) { delete S.forgot[ds.forgot]; } else { S.forgot[ds.forgot] = ui.day; S.forgotUz[ds.forgot] = ds.fuz; }
      save(); render(); var so = document.getElementById("story"); if (so) so.scrollIntoView(); return;
    }
    if (ds.remember) { delete S.forgot[ds.remember]; markActive(); save(); render(); var sr = document.getElementById("story"); if (sr) sr.scrollIntoView(); toast("Barakalla!"); return; }
    if (ds.check) { startCheck(ds.check, ds.lang); return; }
    if (ds.day) { var nd = +ds.day; if (nd >= 1 && nd <= 30) { ui.day = nd; render(); window.scrollTo(0, 0); } return; }
    if (ds.open) { ui.day = +ds.open; ui.tab = "today"; render(); window.scrollTo(0, 0); return; }
    if (ds.toggle) {
      var p = ds.toggle.split("|"), tr = p[0], d = +p[1], i = +p[2], wasDone = dayDone(d);
      S[tr][d] = S[tr][d] || []; S[tr][d][i] = !S[tr][d][i];
      if (S[tr][d][i]) markActive();
      if (!wasDone && dayDone(d)) { S.doneAt[d] = today(); toast(d + "-kun bajarildi! Endi hisobotni yuboring."); }
      save(); render(); return;
    }
    if (ds.go) {
      if (ds.go === "phr") startShadow();
      else if (ds.go === "timer") openSheet("timer");
      else if (ds.go === "rec") { ui.tab = "rec"; render(); window.scrollTo(0, 0); }
      else if (ds.go === "story") { var st = document.getElementById("story"); if (st) st.scrollIntoView({ behavior: "smooth" }); }
      else if (ds.go === "report") { var r = document.getElementById("report"); if (r) r.scrollIntoView({ behavior: "smooth" }); }
      else if (ds.go === "arcards") { ui.tab = "cards"; ui.phrLang = "ar"; ui.cat = "all"; ui.card = 0; ui.flip = false; render(); window.scrollTo(0, 0); }
      return;
    }
    if (ds.rate) { var rr = readReport(); rr.rate = +ds.rate; save(); render(); var rep = document.getElementById("report"); if (rep) rep.scrollIntoView(); return; }
    if (ds.plang) { ui.phrLang = ds.plang; ui.cat = "all"; ui.card = 0; ui.flip = false; render(); return; }
    if (ds.cat) { ui.cat = ds.cat; ui.card = 0; ui.flip = false; render(); return; }
    if (ds.tsec) { ui.timer.sec = ui.timer.left = +ds.tsec; if (ui.timer.run) { clearInterval(ui.timer.h); ui.timer.run = false; } renderSheet(); return; }
    if (ds.play) {
      if (!A) { if (ui.playing === ds.play) webStopPlay(); else webPlay(ds.play); return; }
      if (ui.playing === ds.play) A.stopPlay(); else A.play(ds.play); return;
    }
    if (ds.dl) { webDownload(ds.dl); return; }
    if (ds.del) { openSheet("del:" + ds.del); return; }
    switch (ds.act) {
      case "bg": case "close": closeSheet(); break;
      case "relisten": listen(); break;
      case "tgo": timerToggle(); break;
      case "flip": ui.flip = !ui.flip; render(); break;
      case "cardDir": S.cardDir = S.cardDir === "en" ? "uz" : "en"; save(); ui.flip = false; render(); break;
      case "shadow": startShadow(); break;
      case "shPause": shToggle(); break;
      case "shNext": shStep(1); break;
      case "shPrev": shStep(-1); break;
      case "know": case "again": {
        var list = cardList(), c = list[ui.card]; if (!c) break;
        var k = S.known[ui.phrLang], at = k.indexOf(c.id);
        if (ds.act === "know" && at < 0) k.push(c.id);
        if (ds.act === "again" && at >= 0) k.splice(at, 1);
        markActive(); save();
        var nl = cardList(); ui.card = ui.cat === "rep" && ds.act === "know" ? (ui.card >= nl.length ? 0 : ui.card) : (ui.card + 1) % Math.max(1, nl.length);
        ui.flip = false; render(); break;
      }
      case "rec": recToggle(); break;
      case "micFind": getMicStream().then(function () { if (!mic.testing && !ui.recOn) stopStream(); render(); }, micError); break;
      case "micTest": micTest(); break;
      case "sync": openSheet("sync"); break;
      case "syncCopy": copyText("POLIGLOT:" + btoa(unescape(encodeURIComponent(JSON.stringify(S)))), "Kod nusxalandi. Uni ikkinchi qurilmaga yuboring."); break;
      case "syncLoad": {
        var raw = (($("#syncIn") || {}).value || "").trim().replace(/^POLIGLOT:/, ""), ns = null;
        try { ns = JSON.parse(decodeURIComponent(escape(atob(raw)))); } catch (er) {}
        if (!ns || ns.v !== 1 || !ns.en || !ns.ar) { toast("Kod noto'g'ri. To'liq nusxalanganini tekshiring."); break; }
        var keepMic = { mic: S.mic, micLabel: S.micLabel, micManual: S.micManual };
        S = ns; S.mic = keepMic.mic; S.micLabel = keepMic.micLabel; S.micManual = keepMic.micManual;
        save(); ui.day = curDay(); closeSheet(); render(); toast("Progress yuklandi."); break;
      }
      case "saveReport": readReport(); markActive(); save(); toast("Hisobot saqlandi."); break;
      case "sendReport": {
        readReport(); markActive(); save(); var txt = reportText();
        if (A) { try { A.share(txt); } catch (er) { A.copy(txt); toast("Nusxa olindi. Claude chatiga joylang."); } }
        else copyText(txt, "Nusxa olindi. Claude chatiga joylang (Ctrl+V).");
        break;
      }
      case "remOn": {
        var v = ($("#remt") || {}).value || "20:00", hm = v.split(":");
        S.rem = v; S.remOn = true; save();
        if (A) { try { A.setReminder(+hm[0], +hm[1]); } catch (er) {} }
        else if ("Notification" in window && Notification.permission !== "granted") Notification.requestPermission().then(function (p) { if (p !== "granted") toast("Bildirishnomaga ruxsat berilmadi: eslatma kelmaydi."); });
        toast("Eslatma: har kuni " + v); render(); break;
      }
      case "remOff": S.remOn = false; save(); if (A) { try { A.cancelReminder(); } catch (er) {} } render(); break;
      case "arHelp": openSheet("arvoice"); break;
      case "reset": openSheet("reset"); break;
      case "resetYes": S.en = {}; S.ar = {}; S.active = []; S.reports = {}; S.known = { en: [], ar: [] }; S.doneAt = {}; S.forgot = {}; S.forgotUz = {}; S.start = today(); save(); ui.day = 1; closeSheet(); render(); break;
      case "delYes": {
        var nm = ui.sheet.slice(4);
        if (!A) { if (ui.playing === nm) webStopPlay(); closeSheet(); idb("readwrite", function (st) { return st.delete(nm); }).then(loadRecs, loadRecs); break; }
        try { A.deleteRecording(nm); } catch (er) {} closeSheet(); render(); break;
      }
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "rmin" || e.target.id === "rnote") { readReport(); save(); }
    if (e.target.id === "micSel") {
      var o = e.target.options[e.target.selectedIndex];
      S.mic = e.target.value; S.micLabel = o ? o.text : ""; S.micManual = true; save();
      if (mic.testing) { stopMeter(); stopStream(); getMicStream().then(function (st) { render(); startMeter(st, "testMeter"); }, micError); } else render();
    }
  });
  // klaviatura (kompyuter): Esc — oynani yopish, Space — yozish / kartani ag'darish
  document.addEventListener("keydown", function (e) {
    if (A) return;
    var tg = e.target && e.target.tagName;
    if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT") return;
    if (e.key === "Escape" && ui.sheet) { closeSheet(); return; }
    if (e.key === " " && !ui.sheet) {
      if (ui.tab === "rec") { e.preventDefault(); recToggle(); }
      else if (ui.tab === "cards") { e.preventDefault(); ui.flip = !ui.flip; render(); }
    }
  });

  if (!A) {
    document.documentElement.classList.add("web");
    loadRecs(); refreshMics();
    if (hasMD && navigator.mediaDevices.addEventListener) navigator.mediaDevices.addEventListener("devicechange", refreshMics);
    if ("speechSynthesis" in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; }
    setInterval(webReminderTick, 30000); webReminderTick();
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(function () {});
  }
  render();
  pushStatus();
})();
