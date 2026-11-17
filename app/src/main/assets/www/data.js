// Poliglot — 30 kunlik dastur ma'lumotlari
// Ingliz tili: B1 → ravon gapirish (kuniga ~20 daqiqa)
// Arab tili: 0 daraja → alifbo, o'qish, birinchi iboralar (kuniga ~10 daqiqa)

var WEEKS = [
  { n: 1, en: "Ravonlik asosi", ar: "Alifbo (1)", goal: "Tanish mavzularda 1 daqiqa to'xtamasdan gapirish" },
  { n: 2, en: "Hikoya qilish", ar: "Alifbo (2) va harakatlar", goal: "O'tgan zamonda 2 daqiqalik hikoya aytib berish" },
  { n: 3, en: "Fikr bildirish", ar: "Birinchi so'zlar", goal: "Fikrni sabab va misol bilan himoya qilish" },
  { n: 4, en: "Real suhbat", ar: "Oddiy gaplar", goal: "Real vaziyatlarda erkin suhbat qurish" },
  { n: 5, en: "Yakun", ar: "Yakun", goal: "1-kun bilan solishtirib, o'sishni ko'rish" }
];

// ---------- INGLIZ TILI ----------
var EN_CATS = { flu: "Ravonlik", sto: "Hikoya", opi: "Fikr", con: "Suhbat", cli: "Klinikada", pho: "Telefonda" };

// [toifa, ibora, tarjima, misol gap, misol tarjimasi]
var EN_PHR = [
  ["flu", "Well, let me think for a second...", "Xo'sh, bir soniya o'ylab olay...", "Well, let me think for a second... I think my favourite part of the day is the morning.", "Xo'sh, bir soniya o'ylab olay... Menimcha, kunning eng yoqimli payti — ertalab."],
  ["flu", "The thing is...", "Gap shundaki...", "The thing is, I don't have much free time during the week.", "Gap shundaki, hafta davomida bo'sh vaqtim kam."],
  ["flu", "What I mean is...", "Aytmoqchi bo'lganim...", "What I mean is, ultrasound helps us find problems early.", "Aytmoqchi bo'lganim, UZI muammolarni erta topishga yordam beradi."],
  ["flu", "How can I put it...", "Qanday desam...", "How can I put it... my job is hard, but I really love it.", "Qanday desam... ishim og'ir, lekin uni juda yaxshi ko'raman."],
  ["flu", "Actually, ...", "Aslida, ...", "Actually, I started learning English a long time ago.", "Aslida, ingliz tilini ancha oldin o'rgana boshlaganman."],
  ["flu", "To be honest, ...", "Rostini aytsam, ...", "To be honest, speaking is still the hardest part for me.", "Rostini aytsam, gapirish men uchun hali ham eng qiyin qismi."],
  ["flu", "As far as I know, ...", "Bilishimcha, ...", "As far as I know, the new machine can also do elastography.", "Bilishimcha, yangi apparat elastografiya ham qila oladi."],
  ["flu", "I'm used to getting up early.", "Erta turishga o'rganib qolganman.", "I'm used to getting up early, so six o'clock is easy for me.", "Erta turishga o'rganib qolganman, shuning uchun soat oltida turish men uchun oson."],
  ["sto", "It all started when...", "Hammasi ... paytda boshlandi.", "It all started when I bought my first ultrasound machine.", "Hammasi birinchi UZI apparatimni sotib olganimda boshlandi."],
  ["sto", "At first, I thought...", "Avvaliga ... deb o'yladim.", "At first, I thought it was a simple cyst.", "Avvaliga buni oddiy kista deb o'yladim."],
  ["sto", "Then all of a sudden...", "Keyin birdan...", "Then all of a sudden, the lights went out in the clinic.", "Keyin birdan klinikada chiroq o'chib qoldi."],
  ["sto", "While I was driving home, ...", "Uyga mashinada ketayotganimda, ...", "While I was driving home, my phone rang.", "Uyga mashinada ketayotganimda, telefonim jiringladi."],
  ["sto", "After that, ...", "Shundan keyin, ...", "After that, we went to a small café near the river.", "Shundan keyin, daryo yonidagi kichik kafega bordik."],
  ["sto", "In the end, ...", "Oxir-oqibat, ...", "In the end, everything was fine and the patient went home.", "Oxir-oqibat, hammasi joyida bo'ldi va bemor uyiga ketdi."],
  ["sto", "I'll never forget the day...", "O'sha kunni hech qachon unutmayman...", "I'll never forget the day my first son was born.", "Birinchi o'g'lim tug'ilgan kunni hech qachon unutmayman."],
  ["sto", "It turned out that...", "Ma'lum bo'lishicha, ...", "It turned out that the problem was in the cable, not in the machine.", "Ma'lum bo'lishicha, muammo apparatda emas, kabelda ekan."],
  ["opi", "In my opinion, ...", "Mening fikrimcha, ...", "In my opinion, every family should have a check-up once a year.", "Mening fikrimcha, har bir oila yiliga bir marta tekshiruvdan o'tishi kerak."],
  ["opi", "I strongly believe that...", "Men qat'iy ishonamanki, ...", "I strongly believe that children need more time outside.", "Men qat'iy ishonamanki, bolalarga ochiq havoda ko'proq vaqt kerak."],
  ["opi", "I see your point, but...", "Fikringizni tushunaman, lekin...", "I see your point, but smartphones also help children learn.", "Fikringizni tushunaman, lekin smartfonlar bolalarga o'rganishda ham yordam beradi."],
  ["opi", "That's a good point.", "Bu yaxshi fikr.", "That's a good point. I hadn't thought about the cost.", "Bu yaxshi fikr. Narxi haqida o'ylamagan ekanman."],
  ["opi", "I'm not so sure about that.", "Bunga unchalik ishonchim yo'q.", "I'm not so sure about that. Free services are often slow.", "Bunga unchalik ishonchim yo'q. Bepul xizmatlar ko'pincha sekin bo'ladi."],
  ["opi", "On the one hand..., on the other hand...", "Bir tomondan..., boshqa tomondan...", "On the one hand, the city has better hospitals; on the other hand, life there is expensive.", "Bir tomondan, shaharda shifoxonalar yaxshiroq; boshqa tomondan, u yerda hayot qimmat."],
  ["opi", "It depends on the situation.", "Bu vaziyatga bog'liq.", "It depends on the situation: sometimes one phone call is enough.", "Bu vaziyatga bog'liq: ba'zan bitta qo'ng'iroq yetarli."],
  ["opi", "The main reason is that...", "Asosiy sabab shundaki...", "The main reason is that people don't have time to cook.", "Asosiy sabab shundaki, odamlarda ovqat pishirishga vaqt yo'q."],
  ["con", "Could you say that again, please?", "Iltimos, yana bir bor aytib bera olasizmi?", "Sorry, could you say that again, please? The line is bad.", "Kechirasiz, yana bir bor aytib bera olasizmi? Aloqa yomon."],
  ["con", "What do you mean by that?", "Bu bilan nima demoqchisiz?", "What do you mean by that? Can you give me an example?", "Bu bilan nima demoqchisiz? Misol keltira olasizmi?"],
  ["con", "Sorry to interrupt, but...", "Gapingizni bo'lganim uchun uzr, lekin...", "Sorry to interrupt, but the next patient is waiting.", "Gapingizni bo'lganim uchun uzr, lekin keyingi bemor kutyapti."],
  ["con", "By the way, ...", "Aytgancha, ...", "By the way, have you tried the plov here?", "Aytgancha, bu yerning oshini tatib ko'rdingizmi?"],
  ["con", "Anyway, ...", "Xullas, ...", "Anyway, let's get back to the main question.", "Xullas, asosiy savolga qaytaylik."],
  ["con", "That sounds great!", "Bu juda zo'r-ku!", "That sounds great! Let's meet on Saturday.", "Bu juda zo'r-ku! Shanba kuni uchrashaylik."],
  ["con", "Tell me more about it.", "Bu haqda batafsilroq gapirib bering.", "Really? Tell me more about it.", "Rostdanmi? Bu haqda batafsilroq gapirib bering."],
  ["con", "It was nice talking to you.", "Siz bilan gaplashganimdan xursandman.", "It was nice talking to you. Here's my card.", "Siz bilan gaplashganimdan xursandman. Mana mening vizitkam."],
  ["cli", "Please lie down on your back.", "Iltimos, chalqancha yoting.", "Please lie down on your back and lift your shirt a little.", "Iltimos, chalqancha yoting va ko'ylagingizni biroz ko'taring."],
  ["cli", "Take a deep breath and hold it.", "Chuqur nafas oling va ushlab turing.", "Take a deep breath and hold it... good.", "Chuqur nafas oling va ushlab turing... yaxshi."],
  ["cli", "You can breathe normally now.", "Endi bemalol nafas olishingiz mumkin.", "Thank you. You can breathe normally now.", "Rahmat. Endi bemalol nafas olishingiz mumkin."],
  ["cli", "Does it hurt when I press here?", "Shu yerni bossam og'riyaptimi?", "Does it hurt when I press here, or here?", "Shu yerni bossam og'riyaptimi, yoki bu yerni?"],
  ["cli", "How long have you had this pain?", "Bu og'riq qachondan beri bor?", "How long have you had this pain? A week or longer?", "Bu og'riq qachondan beri bor? Bir haftami yoki ko'proqmi?"],
  ["cli", "Everything looks normal.", "Hammasi me'yorida ko'rinyapti.", "Good news: everything looks normal.", "Yaxshi xabar: hammasi me'yorida ko'rinyapti."],
  ["cli", "I'd recommend seeing a specialist.", "Mutaxassisga ko'rinishingizni tavsiya qilaman.", "I'd recommend seeing a specialist this week.", "Shu hafta mutaxassisga ko'rinishingizni tavsiya qilaman."],
  ["cli", "Your results will be ready in an hour.", "Natijalaringiz bir soatda tayyor bo'ladi.", "Your results will be ready in an hour. You can wait here.", "Natijalaringiz bir soatda tayyor bo'ladi. Shu yerda kutib turishingiz mumkin."],
  ["pho", "Hello, this is Shohruh speaking.", "Allo, men Shohruhman.", "Hello, this is Shohruh speaking, from the ECO LAB clinic.", "Allo, men Shohruh, ECO LAB klinikasidan."],
  ["pho", "I'd like to make an appointment.", "Qabulga yozilmoqchi edim.", "Good morning. I'd like to make an appointment for Tuesday.", "Xayrli tong. Seshanba kuniga qabulga yozilmoqchi edim."],
  ["pho", "Could you hold on a moment?", "Bir daqiqa kutib tura olasizmi?", "Could you hold on a moment? I'll check the schedule.", "Bir daqiqa kutib tura olasizmi? Jadvalni tekshirib ko'raman."],
  ["pho", "Let me just check.", "Hozir tekshirib ko'ray.", "Let me just check... yes, three o'clock is free.", "Hozir tekshirib ko'ray... ha, soat uch bo'sh."],
  ["pho", "Could we move it to Friday?", "Uni jumaga ko'chira olamizmi?", "I'm busy on Thursday. Could we move it to Friday?", "Payshanba kuni bandman. Uni jumaga ko'chira olamizmi?"],
  ["pho", "I'll call you back later.", "Keyinroq qayta qo'ng'iroq qilaman.", "I'm with a patient now. I'll call you back later.", "Hozir bemor qabul qilyapman. Keyinroq qayta qo'ng'iroq qilaman."]
];

// Har kun: [mavzu, savollar, ibora toifasi]
var EN_DAYS = [
  null,
  ["About me", ["Tell me about yourself in detail.", "What do you do, and why did you choose it?", "What are you good at?"], "flu"],
  ["My daily routine", ["Describe a typical working day.", "What is the busiest part of your day?", "How do you relax after work?"], "flu"],
  ["My family", ["Who are you closest to in your family?", "What do you usually do together?", "How has your family changed over the years?"], "con"],
  ["My hometown", ["Describe your town to a tourist.", "What has changed there in the last ten years?", "What would you improve?"], "flu"],
  ["Food and cooking", ["What is your favourite dish? How is it made?", "Do you prefer home food or restaurants? Why?", "What did you eat yesterday?"], "con"],
  ["Free time", ["What do you do at the weekend?", "Is there a hobby you would like to start?", "How much free time do you really have?"], "flu"],
  ["1-hafta nazorati", ["Speak for 3 minutes about yourself, your work and your town.", "Which question was the hardest this week?"], "flu"],
  ["A memorable day", ["Describe a day you will never forget.", "Who was with you?", "Why is it so memorable?"], "sto"],
  ["My childhood", ["Where did you grow up?", "What games did you play?", "What is your best childhood memory?"], "sto"],
  ["A trip I took", ["Where did you go and how did you travel?", "What surprised you there?", "Would you go again? Why?"], "sto"],
  ["A problem I solved", ["Describe a difficult situation at work.", "What did you do?", "What did you learn from it?"], "sto"],
  ["A film or a book", ["Retell the story of a film or book you liked.", "Who was your favourite character?", "Would you recommend it?"], "sto"],
  ["A person who influenced me", ["Who is this person?", "How did you meet?", "How did they change your life?"], "sto"],
  ["2-hafta nazorati", ["Tell your best story of the week again, in 3 minutes.", "Compare it with your Day 8 recording."], "sto"],
  ["City or countryside?", ["Where is it better to live? Why?", "What are the advantages of the city?", "What are the advantages of the countryside?"], "opi"],
  ["Healthy lifestyle", ["What does a healthy lifestyle mean to you?", "What do people do wrong?", "What advice would you give your patients?"], "opi"],
  ["Children and technology", ["Should children have smartphones? At what age?", "What are the risks?", "What are the benefits?"], "opi"],
  ["Social media", ["Is social media good or bad for us?", "How do you use it?", "Should it be controlled?"], "opi"],
  ["Free medicine for everyone?", ["Should all medical services be free?", "Who should pay for them?", "What is the situation in your country?"], "opi"],
  ["The best way to learn a language", ["How do people learn languages best?", "What works for you?", "Is talent important?"], "opi"],
  ["3-hafta nazorati", ["Choose one topic of the week and defend your opinion for 3 minutes.", "Then argue the opposite side for 1 minute."], "opi"],
  ["Role-play: at the clinic", ["You are the doctor. Greet the patient.", "Explain how the ultrasound exam works.", "Tell the patient the results and what to do next."], "cli"],
  ["Role-play: a phone call", ["A patient calls to make an appointment.", "They want to change the time.", "Confirm the date, time and name."], "pho"],
  ["Role-play: travelling", ["Check in at a hotel.", "There is a problem with your room.", "Ask for directions to a good restaurant."], "con"],
  ["Role-play: job interview", ["Tell me about your experience.", "What are your strengths and weaknesses?", "Why should we choose you?"], "opi"],
  ["Role-play: small talk", ["You meet a foreign colleague at a conference.", "Start the conversation and keep it going.", "End it politely and exchange contacts."], "con"],
  ["Presentation", ["Present your clinic or your project in 3 minutes.", "What problem does it solve?", "What are your plans?"], "flu"],
  ["4-hafta nazorati", ["Repeat your favourite role-play without stopping.", "Record a 3-minute presentation."], "con"],
  ["Big interview: 10 questions", ["Who are you?", "What do you do?", "Describe your family.", "Tell me about your town.", "Tell me a story from your childhood.", "Describe a trip.", "What do you think about social media?", "How do you stay healthy?", "What is your dream?", "What did these 30 days give you?"], "con"],
  ["Final talk", ["Speak for 5 minutes: who you are, what you do, what you love, your opinion on one topic, and your plans.", "Listen to your Day 1 recording. What has changed?"], "flu"]
];

function enTasks(d) {
  var w = weekOf(d);
  if (d === 29) return [
    { t: "10 savolga javob", m: 12, d: "Har savolga 1 daqiqadan javob bering. Taymerni 1 daqiqaga qo'ying.", a: "timer" },
    { t: "Yozib oling", m: 5, d: "Eng yaxshi 3 ta javobingizni yozib oling va tinglang.", a: "rec" },
    { t: "Jonli suhbat", m: 3, d: "Claude ovozli rejimida yoki do'st bilan 3 daqiqa gaplashing.", a: null }
  ];
  if (d === 30) return [
    { t: "5 daqiqalik nutq", m: 10, d: "Pastdagi rejaga qarab 5 daqiqa to'xtamasdan gapiring va yozib oling.", a: "rec" },
    { t: "1-kun bilan solishtiring", m: 5, d: "Yozuvlar bo'limidan 1-kun yozuvini tinglang. Nima o'zgardi?", a: "rec" },
    { t: "Hisobot va yangi maqsad", m: 5, d: "Hisobotni to'ldiring va keyingi 30 kun uchun bitta maqsad yozing.", a: "report" }
  ];
  if (d % 7 === 0) return [
    { t: "3 daqiqa to'xtamasdan", m: 8, d: "Hafta mavzulari haqida 3 daqiqa gapiring va yozib oling.", a: "rec" },
    { t: "Solishtirish", m: 5, d: "Hafta boshidagi yozuvingizni tinglang: nima yaxshilandi?", a: "rec" },
    { t: "Hafta iboralari", m: 5, d: "Kartochkalarda 'Takrorlash' belgisidagi iboralarni qayta ayting.", a: "phr" },
    { t: "Keyingi hafta maqsadi", m: 2, d: "Hisobotga bitta aniq maqsad yozing (masalan: 2 daqiqa pauzasiz).", a: "report" }
  ];
  if (w === 1) return [
    { t: "Shadowing", m: 5, d: "Kun iboralarini tinglang va diktor bilan bir vaqtda, ohangiga taqlid qilib takrorlang.", a: "phr" },
    { t: "Savollarga javob", m: 8, d: "Har savolga 1-2 daqiqa javob bering. To'xtamang: so'z topolmasangiz, boshqacha ayting.", a: "timer" },
    { t: "Yozib olib tinglash", m: 5, d: "Eng yaxshi javobingizni 1 daqiqa yozib oling va tinglang. Keyin xuddi shu javobni qayta yozing: ikkinchisi doim ravonroq chiqadi.", a: "rec" },
    { t: "Iboralarni ishlatish", m: 2, d: "Bugungi 2 ta iborani o'z gapingiz ichida ayting.", a: null }
  ];
  if (w === 2) return [
    { t: "Shadowing", m: 5, d: "Hikoya iboralarini tinglang va bir vaqtda takrorlang.", a: "phr" },
    { t: "Hikoya qiling", m: 8, d: "Boshlanish → voqea → yakun tartibida 2 daqiqa gapiring. Bugungi iboralarni ishlating.", a: "timer" },
    { t: "Yozib olib tinglash", m: 5, d: "Hikoyani yozib oling. 'e-e', 'mmm' larni sanang va qayta aytib, kamaytiring.", a: "rec" },
    { t: "Qisqartirib aytish", m: 2, d: "Xuddi shu hikoyani 1 daqiqada qisqa aytib bering.", a: "timer" }
  ];
  if (w === 3) return [
    { t: "Shadowing", m: 4, d: "Fikr iboralarini tinglang va takrorlang.", a: "phr" },
    { t: "Fikr + 2 sabab + misol", m: 8, d: "Savolga 2 daqiqa javob bering: fikringiz, ikki sabab, bitta misol.", a: "timer" },
    { t: "Qarshi tomon", m: 5, d: "Endi teskari fikrni 1 daqiqa himoya qiling.", a: "timer" },
    { t: "Yozib olib tinglash", m: 3, d: "Fikringizni yozib oling va tinglang: sabablar aniqmi?", a: "rec" }
  ];
  return [
    { t: "Rol iboralari", m: 4, d: "Bugungi iboralarni tinglang va takrorlang.", a: "phr" },
    { t: "Rol o'yini", m: 8, d: "Ikkala rolni ham ovoz chiqarib o'ynang: savolni ham, javobni ham.", a: "timer" },
    { t: "Jonli suhbat", m: 5, d: "Claude ovozli rejimida yoki do'st bilan shu vaziyatni o'ynang.", a: null },
    { t: "Yozib olib tinglash", m: 3, d: "Rol o'yinini yozib oling va tinglang.", a: "rec" }
  ];
}

// ---------- ARAB TILI ----------
// Harflar: [harf, nomi, o'qilishi, tovush tavsifi, misol so'z, o'qilishi, ma'nosi, ulanmaydimi]
var AR_LETTERS = [
  ["ا", "alif", "a / ā", "cho'ziq a; unli uchun tayanch", "أَب", "ab", "ota", 1],
  ["ب", "bā", "b", "o'zbekcha b", "بَاب", "bāb", "eshik", 0],
  ["ت", "tā", "t", "o'zbekcha t", "تَمْر", "tamr", "xurmo", 0],
  ["ث", "thā", "th", "tilni tishlar orasiga qo'yib s (ingl. think)", "ثَلْج", "thalj", "qor", 0],
  ["ج", "jīm", "j", "o'zbekcha j", "جَمَل", "jamal", "tuya", 0],
  ["ح", "ḥā", "ḥ", "bo'g'izdan chiqadigan kuchli, xirillamagan h", "حَلِيب", "ḥalīb", "sut", 0],
  ["خ", "khā", "kh", "o'zbekcha x", "خُبْز", "khubz", "non", 0],
  ["د", "dāl", "d", "o'zbekcha d", "دَرْس", "dars", "dars", 1],
  ["ذ", "dhāl", "dh", "tilni tishlar orasiga qo'yib z (ingl. this)", "ذَهَب", "dhahab", "oltin", 1],
  ["ر", "rā", "r", "o'zbekcha r", "رَأْس", "ra's", "bosh", 1],
  ["ز", "zāy", "z", "o'zbekcha z", "زَيْت", "zayt", "yog'", 1],
  ["س", "sīn", "s", "o'zbekcha s", "سَمَك", "samak", "baliq", 0],
  ["ش", "shīn", "sh", "o'zbekcha sh", "شَمْس", "shams", "quyosh", 0],
  ["ص", "ṣād", "ṣ", "qalin, og'iz ichidan aytiladigan s", "صَبَاح", "ṣabāḥ", "tong", 0],
  ["ض", "ḍād", "ḍ", "qalin d", "ضَيْف", "ḍayf", "mehmon", 0],
  ["ط", "ṭā", "ṭ", "qalin t", "طَبِيب", "ṭabīb", "shifokor", 0],
  ["ظ", "ẓā", "ẓ", "qalin dh (z)", "ظُهْر", "ẓuhr", "peshin", 0],
  ["ع", "'ayn", "'", "bo'g'izni siqib aytiladigan tovush", "عَيْن", "'ayn", "ko'z", 0],
  ["غ", "ghayn", "gh", "o'zbekcha g'", "غُرْفَة", "ghurfa", "xona", 0],
  ["ف", "fā", "f", "o'zbekcha f", "فِيل", "fīl", "fil", 0],
  ["ق", "qāf", "q", "o'zbekcha q", "قَلْب", "qalb", "yurak", 0],
  ["ك", "kāf", "k", "o'zbekcha k", "كِتَاب", "kitāb", "kitob", 0],
  ["ل", "lām", "l", "o'zbekcha l", "لَيْل", "layl", "tun", 0],
  ["م", "mīm", "m", "o'zbekcha m", "مَاء", "mā'", "suv", 0],
  ["ن", "nūn", "n", "o'zbekcha n", "نُور", "nūr", "nur", 0],
  ["ه", "hā", "h", "yengil h (o'zbekcha h)", "هَوَاء", "hawā'", "havo", 0],
  ["و", "wāw", "w / ū", "w yoki cho'ziq u", "وَلَد", "walad", "bola", 1],
  ["ي", "yā", "y / ī", "y yoki cho'ziq i", "يَد", "yad", "qo'l", 0]
];

function letterItems(from, to) {
  var out = [];
  for (var i = from; i <= to; i++) {
    var L = AR_LETTERS[i];
    out.push({ ar: L[0], tr: L[1] + " — " + L[2], uz: L[3], ex: L[4], exTr: L[5], exUz: L[6], letter: i });
  }
  return out;
}

function W(ar, tr, uz) { return { ar: ar, tr: tr, uz: uz }; }

var AR_DAYS = [
  null,
  { t: "Harflar: ا ب ت ث", k: "letters", items: letterItems(0, 3) },
  { t: "Harflar: ج ح خ", k: "letters", items: letterItems(4, 6) },
  { t: "Harflar: د ذ ر ز", k: "letters", items: letterItems(7, 10) },
  { t: "Harflar: س ش ص ض", k: "letters", items: letterItems(11, 14) },
  { t: "Harflar: ط ظ ع غ", k: "letters", items: letterItems(15, 18) },
  { t: "Harflar: ف ق ك ل", k: "letters", items: letterItems(19, 22) },
  { t: "Takrorlash: 23 ta harf", k: "review", from: [1, 6] },
  { t: "Harflar: م ن ه و ي", k: "letters", items: letterItems(23, 27) },
  { t: "Qisqa unlilar (harakat)", k: "words", items: [
    W("بَ", "ba", "fatha — ustidagi chiziqcha: a"), W("بِ", "bi", "kasra — ostidagi chiziqcha: i"), W("بُ", "bu", "damma — ustidagi vergulcha: u"),
    W("كَتَبَ", "kataba", "yozdi"), W("دَرَسَ", "darasa", "o'qidi, o'rgandi") ] },
  { t: "Cho'ziq unlilar", k: "words", items: [
    W("بَا", "bā", "a + alif = cho'ziq a"), W("بِي", "bī", "i + yā = cho'ziq i"), W("بُو", "bū", "u + wāw = cho'ziq u"),
    W("نُور", "nūr", "nur"), W("كَبِير", "kabīr", "katta") ] },
  { t: "Sukun va shadda", k: "words", items: [
    W("بْ", "b", "sukun (doiracha) — unlisiz"), W("مَدْرَسَة", "madrasa", "maktab"),
    W("رَبّ", "rabb", "shadda (  ّ  belgisi) — harf ikki marta"), W("مُدَرِّس", "mudarris", "o'qituvchi") ] },
  { t: "Tanvin va ة", k: "words", items: [
    W("كِتَابٌ", "kitābun", "tanvin -un"), W("كِتَابًا", "kitāban", "tanvin -an"), W("كِتَابٍ", "kitābin", "tanvin -in"),
    W("مَدِينَة", "madīna", "shahar (ة so'z oxirida -a)"), W("سَيَّارَة", "sayyāra", "mashina") ] },
  { t: "Artikl ال (al-)", k: "words", items: [
    W("القَمَر", "al-qamar", "oy — 'qamariy' harf: l o'qiladi"), W("الشَّمْس", "ash-shams", "quyosh — 'shamsiy' harf: l o'qilmaydi"),
    W("الكِتَاب", "al-kitāb", "kitob (aniq)"), W("النُّور", "an-nūr", "nur (aniq)"), W("البَيْت", "al-bayt", "uy (aniq)") ] },
  { t: "Takrorlash: o'qish", k: "review", from: [8, 13] },
  { t: "Salomlashish", k: "words", items: [
    W("السَّلَامُ عَلَيْكُمْ", "as-salāmu 'alaykum", "Assalomu alaykum"), W("وَعَلَيْكُمُ السَّلَام", "wa 'alaykumu s-salām", "Va alaykum assalom"),
    W("صَبَاحُ الخَيْر", "ṣabāḥu l-khayr", "Xayrli tong"), W("مَسَاءُ الخَيْر", "masā'u l-khayr", "Xayrli kech"),
    W("كَيْفَ حَالُكَ؟", "kayfa ḥāluka?", "Ahvolingiz qanday?"), W("بِخَيْر، الحَمْدُ لِلّٰه", "bikhayr, al-ḥamdu lillāh", "Yaxshi, Alhamdulillah"),
    W("شُكْرًا", "shukran", "Rahmat"), W("مَعَ السَّلَامَة", "ma'a s-salāma", "Xayr, sog' bo'ling") ] },
  { t: "O'zini tanishtirish", k: "words", items: [
    W("مَا اسْمُكَ؟", "mā smuka?", "Ismingiz nima?"), W("اسْمِي شَاهْرُخ", "ismī Shāhrukh", "Mening ismim Shohruh"),
    W("أَنَا مِنْ أُوزْبَكِسْتَان", "anā min Ūzbakistān", "Men O'zbekistondanman"), W("أَنَا طَبِيب", "anā ṭabīb", "Men shifokorman"),
    W("تَشَرَّفْنَا", "tasharrafnā", "Tanishganimdan xursandman") ] },
  { t: "Oila", k: "words", items: [
    W("أَب", "ab", "ota"), W("أُمّ", "umm", "ona"), W("أَخ", "akh", "aka / uka"), W("أُخْت", "ukht", "opa / singil"),
    W("اِبْن", "ibn", "o'g'il"), W("بِنْت", "bint", "qiz"), W("عَائِلَة", "'ā'ila", "oila") ] },
  { t: "Sonlar 1-10", k: "words", items: [
    W("وَاحِد", "wāḥid", "1"), W("اِثْنَان", "ithnān", "2"), W("ثَلَاثَة", "thalātha", "3"), W("أَرْبَعَة", "arba'a", "4"), W("خَمْسَة", "khamsa", "5"),
    W("سِتَّة", "sitta", "6"), W("سَبْعَة", "sab'a", "7"), W("ثَمَانِيَة", "thamāniya", "8"), W("تِسْعَة", "tis'a", "9"), W("عَشَرَة", "'ashara", "10") ] },
  { t: "Kundalik so'zlar", k: "words", items: [
    W("بَيْت", "bayt", "uy"), W("مَاء", "mā'", "suv"), W("خُبْز", "khubz", "non"), W("كِتَاب", "kitāb", "kitob"),
    W("قَلَم", "qalam", "ruchka, qalam"), W("بَاب", "bāb", "eshik"), W("سَيَّارَة", "sayyāra", "mashina") ] },
  { t: "Savol so'zlari", k: "words", items: [
    W("مَا", "mā", "nima"), W("مَنْ", "man", "kim"), W("أَيْنَ", "ayna", "qayerda"), W("كَيْفَ", "kayfa", "qanday"),
    W("مَتَى", "matā", "qachon"), W("كَمْ", "kam", "qancha, nechta"), W("لِمَاذَا", "limādhā", "nega") ] },
  { t: "Takrorlash: so'zlar", k: "review", from: [15, 20] },
  { t: "Bu nima?", k: "words", items: [
    W("مَا هٰذَا؟", "mā hādhā?", "Bu nima?"), W("هٰذَا كِتَاب", "hādhā kitāb", "Bu kitob"),
    W("هٰذِهِ سَيَّارَة", "hādhihi sayyāra", "Bu mashina (muannas)"), W("هٰذَا بَيْتِي", "hādhā baytī", "Bu mening uyim") ] },
  { t: "Tana va klinika", k: "words", items: [
    W("رَأْس", "ra's", "bosh"), W("عَيْن", "'ayn", "ko'z"), W("قَلْب", "qalb", "yurak"), W("بَطْن", "baṭn", "qorin"),
    W("يَد", "yad", "qo'l"), W("كَبِد", "kabid", "jigar"), W("كُلْيَة", "kulya", "buyrak"), W("عِيَادَة", "'iyāda", "klinika") ] },
  { t: "Ovqat", k: "words", items: [
    W("لَحْم", "laḥm", "go'sht"), W("حَلِيب", "ḥalīb", "sut"), W("تَمْر", "tamr", "xurmo"), W("شَاي", "shāy", "choy"),
    W("أُرِيدُ شَايًا", "urīdu shāyan", "Choy xohlayman"), W("أُرِيدُ مَاءً", "urīdu mā'an", "Suv xohlayman") ] },
  { t: "Vaqt", k: "words", items: [
    W("اليَوْم", "al-yawm", "bugun"), W("غَدًا", "ghadan", "ertaga"), W("أَمْس", "ams", "kecha"),
    W("صَبَاح", "ṣabāḥ", "tong"), W("مَسَاء", "masā'", "kechqurun"), W("الآن", "al-ān", "hozir") ] },
  { t: "Fe'llar: men ...", k: "words", items: [
    W("أَكْتُبُ", "aktubu", "yozaman"), W("أَقْرَأُ", "aqra'u", "o'qiyman"), W("أَذْهَبُ", "adhhabu", "boraman"),
    W("أَعْمَلُ", "a'malu", "ishlayman"), W("أَتَكَلَّمُ", "atakallamu", "gapiraman") ] },
  { t: "Kichik dialog", k: "words", items: [
    W("السَّلَامُ عَلَيْكُمْ", "as-salāmu 'alaykum", "A: Assalomu alaykum"),
    W("وَعَلَيْكُمُ السَّلَام", "wa 'alaykumu s-salām", "B: Va alaykum assalom"),
    W("كَيْفَ حَالُكَ؟", "kayfa ḥāluka?", "A: Ahvolingiz qanday?"),
    W("بِخَيْر، الحَمْدُ لِلّٰه. وَأَنْتَ؟", "bikhayr, al-ḥamdu lillāh. wa anta?", "B: Yaxshi, Alhamdulillah. O'zingiz-chi?"),
    W("أَتَكَلَّمُ العَرَبِيَّةَ قَلِيلًا", "atakallamu l-'arabiyyata qalīlan", "A: Arabchani ozroq gapiraman") ] },
  { t: "Takrorlash: gaplar", k: "review", from: [22, 27] },
  { t: "Qisqa matn o'qish", k: "words", items: [
    W("اسْمِي شَاهْرُخ.", "ismī Shāhrukh.", "Mening ismim Shohruh."), W("أَنَا مِنْ أُوزْبَكِسْتَان.", "anā min Ūzbakistān.", "Men O'zbekistondanman."),
    W("أَنَا طَبِيب.", "anā ṭabīb.", "Men shifokorman."), W("أَعْمَلُ فِي عِيَادَة.", "a'malu fī 'iyāda.", "Klinikada ishlayman."),
    W("عِنْدِي عَائِلَة كَبِيرَة.", "'indī 'ā'ila kabīra.", "Mening katta oilam bor.") ] },
  { t: "Yakun: o'zingizni tanishtiring", k: "review", from: [15, 29] }
];

function arItems(d) {
  var day = AR_DAYS[d];
  if (day.k !== "review") return day.items;
  var out = [];
  for (var i = day.from[0]; i <= day.from[1]; i++) {
    var x = AR_DAYS[i];
    if (x && x.k !== "review") out = out.concat(x.items);
  }
  return out;
}

function arTasks(d) {
  var day = AR_DAYS[d];
  if (day.k === "letters") return [
    { t: "Tinglang va takrorlang", m: 4, d: "Har bir harfning nomini va misol so'zni tinglab, 3 martadan ovoz chiqarib ayting.", a: null },
    { t: "Daftarga yozing", m: 4, d: "Har bir harfni o'ngdan chapga 5 martadan yozing: alohida, boshida, o'rtada, oxirida.", a: null },
    { t: "O'zingizni tekshiring", m: 2, d: "Kartochkalarda harfga qarab nomini ayting, keyin ag'darib tekshiring.", a: "arcards" }
  ];
  if (day.k === "review") return [
    { t: "Kartochkalar", m: 5, d: "O'tilgan hamma narsani kartochkalarda tekshiring. Bilmaganlarni 'Takrorlash' qiling.", a: "arcards" },
    { t: "Ovoz chiqarib o'qing", m: 3, d: "Ro'yxatni boshidan oxirigacha ovoz chiqarib o'qing.", a: null },
    { t: "Yozib oling", m: 2, d: "O'qishingizni yozib oling va tinglang.", a: "rec" }
  ];
  return [
    { t: "Tinglang va takrorlang", m: 4, d: "Har bir so'zni tinglang, 3 martadan takrorlang. Harakatlarga (unli belgilarga) qarang.", a: null },
    { t: "O'qib, yozing", m: 4, d: "So'zlarni o'qing va daftarga ko'chirib yozing, yoniga ma'nosini yozing.", a: null },
    { t: "Kartochkalar", m: 2, d: "So'zga qarab ma'nosini ayting, keyin tekshiring.", a: "arcards" }
  ];
}

function weekOf(d) { return d >= 29 ? 5 : Math.ceil(d / 7); }
