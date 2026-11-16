# Poliglot

Ingliz tili (B1, speaking) va arab tili (0 dan) uchun 30 kunlik Android ilova.

- Kunlik dastur: ~20 daqiqa ingliz + ~10 daqiqa arab, har 7-kun haftalik nazorat
- Iboralarni tinglash (telefon TTS) va talaffuzni tekshirish (Google ovozni tanish)
- O'zingizni yozib olish, 1-kun va oxirgi kun yozuvini solishtirish
- Kartochkalar: ingliz iboralar, arab harflari, arab iboralar
- Kunlik seriya, daqiqalar, talaffuz balli grafigi
- Kunlik eslatma (bildirishnoma) va hisobotni Claude'ga yuborish

## APK
Har `main` ga push qilinganda GitHub Actions APK yig'adi:
**Releases → latest → poliglot.apk**

Ilova kodi: `app/src/main/assets/www/` (interfeys va 30 kunlik dastur: `data.js`), `MainActivity.java` (ovoz, mikrofon, nutqni tanish), `Reminder.java` (kunlik eslatma).
