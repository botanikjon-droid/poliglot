// Poliglot — "Kun darsi": Polyglot Teacher formati
// 1) Isinish (kechagi so'zlar)  2) 5 ta yangi so'z (IPA + o'zbekcha o'qilishi)  3) Bitta grammatika qoidasi
// 4) Gapirish savoli + avtomatik tekshiruv  5) Esga olish testi (javob yashirin)  6) Uy vazifasi  → 100 ballik baho
// v: [inglizcha, IPA, o'zbekcha o'qilishi, ma'nosi, misol gap]
// g: { t: sarlavha, r: qoida (o'zbekcha), ex: misollar, bad: noto'g'ri, good: to'g'ri, why: izoh }

var LESSONS = [
  null,
  { // 1
    v: [["examine", "ɪɡˈzæmɪn", "igzemin", "tekshirmoq", "I examine patients every day."],
        ["appointment", "əˈpɔɪntmənt", "epoyntment", "qabulga yozilish", "Do you have an appointment?"],
        ["results", "rɪˈzʌlts", "rizalts", "natijalar", "Your results are normal."],
        ["lie down", "laɪ daʊn", "lay daun", "yotmoq", "Please lie down on your back."],
        ["take a deep breath", "teɪk ə diːp breθ", "teyk e diip bres (th)", "chuqur nafas olmoq", "Take a deep breath and hold it."]],
    g: { t: "Present Simple: I work / he works", r: "Har kuni, doim qiladigan ishlar uchun. He / she / it bilan fe'lga -s qo'shiladi.", ex: ["I work in a clinic.", "She works in a hospital.", "My son likes football."], bad: "He work in a clinic.", good: "He works in a clinic.", why: "he/she/it bilan fe'l oxiriga -s qo'shiladi." },
    q: "What do you do, and where do you work?",
    hw: ["O'zingiz haqingizda 5 ta gap yozing (I work..., I live..., I like...).", "Oila a'zongiz haqida 3 ta gap yozing: he/she + fe'l-s.", "5 ta yangi so'zni 3 martadan ovoz chiqarib ayting."]
  },
  { // 2
    v: [["wake up", "weɪk ʌp", "veyk ap", "uyg'onmoq", "I wake up at six o'clock."],
        ["usually", "ˈjuːʒuəli", "yujuali", "odatda", "I usually have tea for breakfast."],
        ["busy", "ˈbɪzi", "bizi", "band", "Mornings are always busy at the clinic."],
        ["get home", "ɡet hoʊm", "get houm", "uyga yetib kelmoq", "I get home at seven in the evening."],
        ["relax", "rɪˈlæks", "rileks", "dam olmoq", "I relax with my sons after work."]],
    g: { t: "Tez-tezlik so'zlari: always, usually, sometimes, never", r: "Bu so'zlar oddiy fe'ldan OLDIN, lekin am/is/are dan KEYIN turadi.", ex: ["I always wake up early.", "I usually drink tea.", "I am never late."], bad: "I wake up always early.", good: "I always wake up early.", why: "always / usually / never — asosiy fe'ldan oldin keladi." },
    q: "Describe a typical working day.",
    hw: ["Kun tartibingizni 6 ta gapda yozing: always, usually, sometimes, never ishlating.", "'busy' va 'relax' bilan bittadan gap tuzing.", "Javobingizni 1 daqiqa yozib oling va tinglang."]
  },
  { // 3
    v: [["get on well with", "ɡet ɒn wel wɪð", "get on vel vis (th)", "yaxshi chiqishmoq", "I get on well with my brother."],
        ["look after", "lʊk ˈɑːftə", "luk aafte", "qaramoq, g'amxo'rlik qilmoq", "My wife looks after our sons."],
        ["grow up", "ɡroʊ ʌp", "grou ap", "ulg'aymoq", "My sons are growing up fast."],
        ["spend time", "spend taɪm", "spend taym", "vaqt o'tkazmoq", "We spend time together at the weekend."],
        ["proud of", "praʊd əv", "praud ov", "faxrlanmoq", "I am proud of my sons."]],
    g: { t: "Savol: Do you...? / Does he...?", r: "Present Simple savolida do / does ishlatiladi. Does dan keyin fe'lga -s QO'SHILMAYDI.", ex: ["Do you have brothers?", "Does your son like school?", "Where does your father live?"], bad: "Does he likes school?", good: "Does he like school?", why: "does o'zi -s ni oladi, fe'l oddiy shaklda qoladi." },
    q: "Who are you closest to in your family?",
    hw: ["Oilangiz haqida 5 ta savol yozing (Do...? / Does...?).", "O'zingiz shu savollarga javob bering.", "'proud of' bilan 2 ta gap tuzing."]
  },
  { // 4
    v: [["quiet", "ˈkwaɪət", "kvayet", "tinch, sokin", "Yaypan is a quiet town."],
        ["crowded", "ˈkraʊdɪd", "kraudid", "odam gavjum", "The bazaar is crowded on Sundays."],
        ["famous for", "ˈfeɪməs fɔː", "feymes foo", "...bilan mashhur", "Our region is famous for its fruit."],
        ["near", "nɪə", "nie", "yaqinida", "My clinic is near the polyclinic."],
        ["improve", "ɪmˈpruːv", "impruuv", "yaxshilamoq", "We need to improve the roads."]],
    g: { t: "There is / There are", r: "Biror joyda nima borligini aytish uchun. Birlikda — there is, ko'plikda — there are.", ex: ["There is a big bazaar in my town.", "There are many fruit gardens.", "Is there a hospital near here?"], bad: "In my town have a big bazaar.", good: "There is a big bazaar in my town.", why: "'...da bor' ma'nosida have emas, there is / there are ishlatiladi." },
    q: "Describe your town to a tourist.",
    hw: ["Shahringiz haqida there is / there are bilan 5 ta gap yozing.", "Turistga 3 ta joyni tavsiya qiling.", "'famous for' bilan 1 ta gap tuzing."]
  },
  { // 5
    v: [["delicious", "dɪˈlɪʃəs", "dilishes", "mazali", "My mother's plov is delicious."],
        ["recipe", "ˈresəpi", "resepi", "retsept", "Can you share the recipe?"],
        ["fry", "fraɪ", "fray", "qovurmoq", "First, fry the meat and onions."],
        ["boil", "bɔɪl", "boyl", "qaynatmoq", "Boil the water, then add the rice."],
        ["prefer", "prɪˈfɜː", "prifyor", "afzal ko'rmoq", "I prefer home food to fast food."]],
    g: { t: "Buyruq gap (retsept, ko'rsatma)", r: "Ko'rsatma berishda gap fe'l bilan boshlanadi. Ega (you) aytilmaydi.", ex: ["Cut the carrots.", "Add the rice.", "Don't open the lid."], bad: "You must to add the rice.", good: "Add the rice.", why: "Ko'rsatmada oddiy fe'l bilan boshlanadi; must dan keyin 'to' qo'yilmaydi." },
    q: "What is your favourite dish? How is it made?",
    hw: ["Sevimli taomingiz retseptini 6 ta buyruq gapda yozing.", "'prefer' bilan 2 ta gap tuzing.", "Retseptni ovoz chiqarib, xuddi videoda ko'rsatayotgandek ayting."]
  },
  { // 6
    v: [["free time", "friː taɪm", "frii taym", "bo'sh vaqt", "I don't have much free time."],
        ["hobby", "ˈhɒbi", "hobi", "qiziqish, hobbi", "My hobby is programming."],
        ["go for a walk", "ɡoʊ fər ə wɔːk", "gou for e vook", "sayr qilmoq", "We go for a walk in the evening."],
        ["be into", "bi ˈɪntuː", "bi intu", "...ga qiziqmoq", "I'm into learning languages."],
        ["once a week", "wʌns ə wiːk", "vans e viik", "haftada bir marta", "I play football once a week."]],
    g: { t: "like / love / enjoy + -ing", r: "Yoqtirgan ishni aytganda like, love, enjoy, hate dan keyin fe'lga -ing qo'shiladi.", ex: ["I like reading.", "I enjoy cooking for my family.", "My sons love playing football."], bad: "I enjoy to read.", good: "I enjoy reading.", why: "enjoy dan keyin faqat -ing keladi." },
    q: "What do you do at the weekend?",
    hw: ["Yoqtirgan va yoqtirmagan 5 ta ishni -ing bilan yozing.", "'once a week', 'twice a month' bilan 2 ta gap tuzing.", "Do'stingizga 'What are you into?' deb so'rab ko'ring."]
  },
  { // 7
    v: [["actually", "ˈæktʃuəli", "ekchuali", "aslida", "Actually, I live near the clinic."],
        ["by the way", "baɪ ðə weɪ", "bay ze vey (th)", "aytgancha", "By the way, do you like tea?"],
        ["for example", "fər ɪɡˈzɑːmpl", "for igzaampl", "masalan", "I like sport, for example, football."],
        ["also", "ˈɔːlsoʊ", "oolsou", "shuningdek, ham", "I also teach my sons."],
        ["that's why", "ðæts waɪ", "zets vay (th)", "shuning uchun", "I love my work. That's why I'm happy."]],
    g: { t: "Takrorlash: Present Simple to'liq", r: "Bu hafta: I work / he works, do / does savollari, always / usually, there is / are, like + -ing.", ex: ["I usually work until six.", "Does your wife work?", "There are three people in my team."], bad: "My wife don't work on Sunday.", good: "My wife doesn't work on Sunday.", why: "he/she/it inkorida doesn't ishlatiladi." },
    q: "Speak for 3 minutes about yourself, your work and your town.",
    hw: ["1-6 kunlarning 30 ta so'zini kartochkada takrorlang.", "3 daqiqalik nutqni yozib oling.", "Eng ko'p xato qilgan qoidangizni qayta o'qing."]
  },
  { // 8
    v: [["unforgettable", "ˌʌnfəˈɡetəbl", "anforgetebl", "unutilmas", "It was an unforgettable day."],
        ["happen", "ˈhæpən", "hepen", "sodir bo'lmoq", "What happened next?"],
        ["suddenly", "ˈsʌdənli", "sadenli", "birdan", "Suddenly, the phone rang."],
        ["celebrate", "ˈselɪbreɪt", "selibreyt", "nishonlamoq", "We celebrated my son's birthday."],
        ["feel", "fiːl", "fiil", "his qilmoq", "I felt very happy."]],
    g: { t: "Past Simple (to'g'ri fe'llar): -ed", r: "O'tgan, tugagan voqealar uchun. To'g'ri fe'llarga -ed qo'shiladi.", ex: ["I visited my parents.", "We celebrated at home.", "It happened in 2015."], bad: "Yesterday I visit my parents.", good: "Yesterday I visited my parents.", why: "yesterday, last year, ago — o'tgan zamon: fe'lga -ed." },
    q: "Describe a day you will never forget.",
    hw: ["Unutilmas kuningizni 6 ta gapda yozing (-ed fe'llar).", "10 ta to'g'ri fe'lni o'tgan zamonga qo'ying.", "Hikoyani 2 daqiqa aytib, yozib oling."]
  },
  { // 9
    v: [["childhood", "ˈtʃaɪldhʊd", "chayldhud", "bolalik", "I had a happy childhood."],
        ["village", "ˈvɪlɪdʒ", "vilij", "qishloq", "I grew up in a small village."],
        ["neighbour", "ˈneɪbə", "neybe", "qo'shni", "Our neighbours were very kind."],
        ["remember", "rɪˈmembə", "rimembe", "eslamoq", "I remember my first teacher."],
        ["miss", "mɪs", "mis", "sog'inmoq", "I miss those days."]],
    g: { t: "Past Simple (noto'g'ri fe'llar)", r: "Ko'p fe'llar o'tgan zamonda shaklini o'zgartiradi: go→went, have→had, grow→grew, be→was/were.", ex: ["I grew up in a village.", "We went to school on foot.", "I had a bicycle."], bad: "I goed to school.", good: "I went to school.", why: "go noto'g'ri fe'l: o'tgan shakli went." },
    q: "What is your best childhood memory?",
    hw: ["20 ta noto'g'ri fe'lni yod oling (go-went, see-saw...).", "Bolaligingiz haqida 6 ta gap yozing.", "O'g'illaringizga bolaligingizdan bitta voqeani inglizcha aytib bering."]
  },
  { // 10
    v: [["journey", "ˈdʒɜːni", "jyorni", "safar, yo'l", "The journey took five hours."],
        ["book", "bʊk", "buk", "bron qilmoq", "I booked a hotel online."],
        ["sightseeing", "ˈsaɪtsiːɪŋ", "saytsiing", "diqqatga sazovor joylarni ko'rish", "We went sightseeing in Samarkand."],
        ["surprised", "səˈpraɪzd", "sepraizd", "hayron qolgan", "I was surprised by the prices."],
        ["view", "vjuː", "vyuu", "manzara", "The view from the hotel was amazing."]],
    g: { t: "Was / were", r: "O'tgan zamonda 'edi': I / he / she / it — was, you / we / they — were.", ex: ["The hotel was clean.", "The people were friendly.", "Was it expensive?"], bad: "The people was friendly.", good: "The people were friendly.", why: "people — ko'plik, shuning uchun were." },
    q: "Where did you go and how did you travel?",
    hw: ["Safaringiz haqida was / were bilan 5 ta gap yozing.", "Mehmonxona bron qilish haqida 3 ta gap tuzing.", "Safar hikoyasini yozib oling."]
  },
  { // 11
    v: [["solve", "sɒlv", "solv", "hal qilmoq", "We solved the problem quickly."],
        ["break down", "breɪk daʊn", "breyk daun", "buzilib qolmoq", "The machine broke down."],
        ["fix", "fɪks", "fiks", "tuzatmoq", "A technician fixed it."],
        ["decide", "dɪˈsaɪd", "disayd", "qaror qilmoq", "I decided to call the company."],
        ["learn a lesson", "lɜːn ə ˈlesn", "lyorn e lesn", "saboq olmoq", "I learned an important lesson."]],
    g: { t: "Past Continuous: was working", r: "O'tmishda davom etayotgan ish. Uni boshqa qisqa voqea bo'lsa: while + was -ing, when + Past Simple.", ex: ["I was examining a patient when the lights went out.", "While I was driving, it started to rain."], bad: "I examined a patient when the lights went out.", good: "I was examining a patient when the lights went out.", why: "Uzoq davom etgan ish — was + -ing; qisqa voqea — Past Simple." },
    q: "Describe a difficult situation at work. What did you do?",
    hw: ["'when' va 'while' bilan 4 ta gap yozing.", "Ishdagi bitta muammo haqida: muammo → qaror → natija.", "Hikoyani 2 daqiqa aytib bering."]
  },
  { // 12
    v: [["plot", "plɒt", "plot", "syujet", "The plot is very interesting."],
        ["main character", "meɪn ˈkærəktə", "meyn kerekte", "bosh qahramon", "The main character is a young doctor."],
        ["be about", "bi əˈbaʊt", "bi ebaut", "...haqida bo'lmoq", "The film is about a poor family."],
        ["recommend", "ˌrekəˈmend", "rekemend", "tavsiya qilmoq", "I recommend this book."],
        ["ending", "ˈendɪŋ", "ending", "yakun, oxiri", "The ending was sad."]],
    g: { t: "Past Simple savoli va inkori: did / didn't", r: "Savol va inkorda did ishlatiladi; did dan keyin fe'l oddiy shaklda bo'ladi.", ex: ["Did you like the film?", "I didn't understand the ending.", "What did he do?"], bad: "Did you liked it?", good: "Did you like it?", why: "did o'zi o'tgan zamonni ko'rsatadi; fe'l -ed olmaydi." },
    q: "Retell the story of a film or book you liked.",
    hw: ["Film haqida 5 ta savol yozing (Did...?).", "Film syujetini 6 gapda yozing.", "Do'stingizga filmni tavsiya qiling: 'I recommend it because...'"]
  },
  { // 13
    v: [["influence", "ˈɪnfluəns", "influens", "ta'sir qilmoq", "My teacher influenced me a lot."],
        ["advice", "ədˈvaɪs", "edvays", "maslahat", "He gave me good advice."],
        ["support", "səˈpɔːt", "sepoot", "qo'llab-quvvatlamoq", "My father always supported me."],
        ["honest", "ˈɒnɪst", "onist", "halol, rostgo'y", "He was an honest man."],
        ["look up to", "lʊk ʌp tuː", "luk ap tu", "o'rnak qilib olmoq", "I look up to my grandfather."]],
    g: { t: "Used to: ilgari odat bo'lgan", r: "Ilgari bo'lib, hozir bo'lmagan odatlar uchun: used to + fe'l.", ex: ["My grandfather used to tell us stories.", "I used to live in a village.", "Did you use to play football?"], bad: "I am used to live in a village.", good: "I used to live in a village.", why: "Ilgarigi odat — used to + fe'l (am qo'shilmaydi)." },
    q: "Who is a person who influenced you? How did they change your life?",
    hw: ["'used to' bilan bolaligingiz haqida 4 ta gap yozing.", "Sizga ta'sir qilgan inson haqida 6 ta gap yozing.", "Nutqni yozib oling."]
  },
  { // 14
    v: [["first of all", "fɜːst əv ɔːl", "fyorst ov ool", "avvalo", "First of all, I want to say thank you."],
        ["then", "ðen", "zen (th)", "keyin", "Then we went home."],
        ["after a while", "ˈɑːftər ə waɪl", "aafter e vayl", "biroz vaqtdan keyin", "After a while, the rain stopped."],
        ["finally", "ˈfaɪnəli", "faynali", "nihoyat", "Finally, we arrived."],
        ["anyway", "ˈeniweɪ", "enivey", "xullas", "Anyway, it was a great day."]],
    g: { t: "Takrorlash: o'tgan zamon", r: "Bu hafta: -ed, noto'g'ri fe'llar, was / were, was -ing, did / didn't, used to.", ex: ["When I was a child, I used to play outside.", "While we were walking, it started to rain."], bad: "I didn't went there.", good: "I didn't go there.", why: "didn't dan keyin fe'l oddiy shaklda." },
    q: "Tell your best story of the week again, in 3 minutes.",
    hw: ["8-13 kunlarning so'zlarini takrorlang.", "Hikoyani first of all → then → finally bilan qayta ayting.", "8-kun yozuvingiz bilan solishtiring."]
  },
  { // 15
    v: [["advantage", "ədˈvɑːntɪdʒ", "edvaantij", "afzallik", "One advantage of the city is good hospitals."],
        ["disadvantage", "ˌdɪsədˈvɑːntɪdʒ", "disedvaantij", "kamchilik", "The main disadvantage is the noise."],
        ["fresh air", "freʃ eə", "fresh eer", "toza havo", "The countryside has fresh air."],
        ["expensive", "ɪkˈspensɪv", "ikspensiv", "qimmat", "Life in the city is expensive."],
        ["opportunity", "ˌɒpəˈtjuːnəti", "opetyuuneti", "imkoniyat", "There are more job opportunities in the city."]],
    g: { t: "Qiyoslash: bigger / more expensive than", r: "Qisqa sifat + -er + than; uzun sifat: more + sifat + than. good → better, bad → worse.", ex: ["The city is bigger than my town.", "Life is more expensive in Tashkent.", "The air is better in the countryside."], bad: "The city is more bigger.", good: "The city is bigger.", why: "-er va more birga ishlatilmaydi." },
    q: "Where is it better to live: in the city or in the countryside? Why?",
    hw: ["Shahar va qishloqni 5 ta qiyosiy gapda solishtiring.", "2 ta afzallik va 2 ta kamchilik yozing.", "Fikringizni 2 daqiqa aytib bering."]
  },
  { // 16
    v: [["healthy", "ˈhelθi", "helsi (th)", "sog'lom", "A healthy diet is important."],
        ["avoid", "əˈvɔɪd", "evoyd", "saqlanmoq, qochmoq", "Avoid too much sugar."],
        ["exercise", "ˈeksəsaɪz", "eksesayz", "jismoniy mashq", "Do exercise three times a week."],
        ["habit", "ˈhæbɪt", "hebit", "odat", "Smoking is a bad habit."],
        ["check-up", "ˈtʃek ʌp", "chek ap", "tibbiy ko'rik", "Have a check-up once a year."]],
    g: { t: "Maslahat: should / shouldn't", r: "Maslahat berishda: should + fe'l. Should dan keyin 'to' qo'yilmaydi.", ex: ["You should drink more water.", "You shouldn't eat late at night.", "Should I see a doctor?"], bad: "You should to drink more water.", good: "You should drink more water.", why: "should dan keyin to ishlatilmaydi." },
    q: "What advice would you give your patients about a healthy lifestyle?",
    hw: ["Bemorlarga should / shouldn't bilan 6 ta maslahat yozing.", "O'zingizning 2 ta yaxshi va 1 ta yomon odatingizni yozing.", "Maslahatlarni bemorga gapirayotgandek ayting."]
  },
  { // 17
    v: [["screen time", "skriːn taɪm", "skriin taym", "ekran oldida o'tkaziladigan vaqt", "Children need less screen time."],
        ["addicted to", "əˈdɪktɪd tuː", "ediktid tu", "...ga qaram", "Some children are addicted to games."],
        ["allow", "əˈlaʊ", "elau", "ruxsat bermoq", "I allow my sons one hour a day."],
        ["harmful", "ˈhɑːmfl", "haamfl", "zararli", "Too much screen time is harmful."],
        ["useful", "ˈjuːsfl", "yuusfl", "foydali", "Some apps are very useful for learning."]],
    g: { t: "Sabab va natija: because / so / but", r: "because — sabab, so — natija, but — qarshilik. Gaplarni bog'lab, uzunroq gapirishga yordam beradi.", ex: ["Phones are useful because children can learn.", "Games are addictive, so we limit them.", "Phones are useful, but they can be harmful."], bad: "Because phones are harmful.", good: "I think phones are harmful because children don't sleep well.", why: "because bilan boshlangan gapning asosiy qismi ham bo'lishi kerak." },
    q: "Should children have smartphones? At what age?",
    hw: ["because, so, but bilan 2 tadan gap yozing.", "Fikringiz + 2 sabab + 1 misol tuzing.", "Teskari fikrni 1 daqiqa himoya qiling."]
  },
  { // 18
    v: [["post", "poʊst", "poust", "joylamoq (ijtimoiy tarmoqda)", "I post videos on Telegram."],
        ["follower", "ˈfɒloʊə", "folouer", "obunachi", "Our channel has many followers."],
        ["fake news", "feɪk njuːz", "feyk nyuuz", "yolg'on xabar", "Fake news spreads fast."],
        ["waste of time", "weɪst əv taɪm", "veyst ov taym", "vaqtni bekor ketkazish", "Scrolling for hours is a waste of time."],
        ["stay in touch", "steɪ ɪn tʌtʃ", "stey in tach", "aloqada bo'lmoq", "It helps me stay in touch with friends."]],
    g: { t: "Fikr bildirish: I think / In my opinion", r: "Fikrni boshlash: I think..., In my opinion..., I believe... 'I am agree' DEMAYMIZ — 'I agree'.", ex: ["In my opinion, social media is useful.", "I agree with you.", "I don't think it's a waste of time."], bad: "I am agree with you.", good: "I agree with you.", why: "agree — fe'l, am kerak emas." },
    q: "Is social media good or bad for us?",
    hw: ["'In my opinion', 'I agree', 'I disagree' bilan 3 ta gap yozing.", "Klinika Telegram kanali uchun inglizcha qisqa post yozing.", "Fikringizni 2 daqiqa yozib oling."]
  },
  { // 19
    v: [["afford", "əˈfɔːd", "efood", "pulga qurbi yetmoq", "Not everyone can afford an MRI."],
        ["government", "ˈɡʌvənmənt", "gavenment", "hukumat", "The government pays for some services."],
        ["tax", "tæks", "teks", "soliq", "Free medicine comes from taxes."],
        ["quality", "ˈkwɒləti", "kvoleti", "sifat", "Quality is more important than price."],
        ["waiting list", "ˈweɪtɪŋ lɪst", "veyting list", "navbat ro'yxati", "Free clinics often have long waiting lists."]],
    g: { t: "1-tur shart gap: If + present, will", r: "Real kelajak natijasi: If + Present Simple, ... will + fe'l. If qismida will ishlatilmaydi.", ex: ["If medicine is free, more people will come.", "If we buy a new machine, we will offer new services."], bad: "If medicine will be free, people will come.", good: "If medicine is free, people will come.", why: "if dan keyin Present Simple, will emas." },
    q: "Should all medical services be free? Who should pay for them?",
    hw: ["If ... will bilan 4 ta gap yozing.", "Bepul tibbiyotning 2 afzalligi va 2 kamchiligini yozing.", "Fikringizni 2 daqiqa aytib bering."]
  },
  { // 20
    v: [["fluent", "ˈfluːənt", "fluuent", "ravon", "I want to be fluent in English."],
        ["practise", "ˈpræktɪs", "prektis", "mashq qilmoq", "I practise speaking every day."],
        ["make mistakes", "meɪk mɪˈsteɪks", "meyk misteyks", "xato qilmoq", "Don't be afraid to make mistakes."],
        ["improve", "ɪmˈpruːv", "impruuv", "yaxshilamoq", "My English is improving."],
        ["give up", "ɡɪv ʌp", "giv ap", "taslim bo'lmoq", "Never give up!"]],
    g: { t: "Present Perfect (tajriba): have done", r: "Hayotdagi tajriba, vaqti aytilmaganda: have / has + 3-shakl (done, seen, been).", ex: ["I have studied English for years.", "Have you ever been to London?", "I have never seen snow in May."], bad: "I have studied English last year.", good: "I studied English last year.", why: "Aniq vaqt (last year) bo'lsa — Past Simple; vaqtsiz tajriba — Present Perfect." },
    q: "How do people learn languages best? What works for you?",
    hw: ["'Have you ever...?' bilan 5 ta savol yozing va javob bering.", "Til o'rganishdagi 3 ta maslahatingizni yozing.", "Javobni yozib oling."]
  },
  { // 21
    v: [["on the one hand", "ɒn ðə wʌn hænd", "on ze van hend (th)", "bir tomondan", "On the one hand, the city is convenient."],
        ["on the other hand", "ɒn ði ˈʌðə hænd", "on zi aze hend (th)", "boshqa tomondan", "On the other hand, it's noisy."],
        ["however", "haʊˈevə", "hauevye", "biroq", "However, prices are high."],
        ["I see your point", "aɪ siː jɔː pɔɪnt", "ay sii yoo poynt", "fikringizni tushunaman", "I see your point, but I disagree."],
        ["to sum up", "tə sʌm ʌp", "te sam ap", "xulosa qilib", "To sum up, both have advantages."]],
    g: { t: "Takrorlash: fikr bildirish", r: "Bu hafta: qiyoslash, should, because / so / but, I agree, if ... will, have done.", ex: ["I think the city is better because there are more opportunities.", "If you practise every day, you will improve."], bad: "If you will practise, you will improve.", good: "If you practise, you will improve.", why: "if qismida will emas." },
    q: "Choose one topic of the week and defend your opinion for 3 minutes.",
    hw: ["15-20 kunlarning so'zlarini takrorlang.", "Fikr → sabab → misol → xulosa (to sum up) tuzilmasida 3 daqiqa gapiring.", "Teskari fikrni 1 daqiqa himoya qiling."]
  },
  { // 22
    v: [["symptom", "ˈsɪmptəm", "simptem", "belgi, simptom", "What are your symptoms?"],
        ["pain", "peɪn", "peyn", "og'riq", "Where is the pain?"],
        ["press", "pres", "pres", "bosmoq", "Does it hurt when I press here?"],
        ["gel", "dʒel", "jel", "gel", "The gel is a little cold."],
        ["normal", "ˈnɔːml", "noorml", "me'yorida", "Everything looks normal."]],
    g: { t: "Present Perfect: How long have you had...?", r: "O'tmishda boshlanib, hozir ham davom etayotgan holat: have had + for (davomiylik) / since (boshlanish).", ex: ["How long have you had this pain?", "I have had it for two weeks.", "I have had it since Monday."], bad: "How long do you have this pain?", good: "How long have you had this pain?", why: "Hozirgacha davom etayotgan holat — Present Perfect." },
    q: "You are the doctor. Explain how the ultrasound exam works.",
    hw: ["Bemor bilan 8 gapli dialog yozing.", "for / since bilan 4 ta gap tuzing.", "Dialogni ikkala rolda ovoz chiqarib o'ynang."]
  },
  { // 23
    v: [["available", "əˈveɪləbl", "eveylebl", "bo'sh (vaqt)", "Is Tuesday available?"],
        ["confirm", "kənˈfɜːm", "kenfyorm", "tasdiqlamoq", "Let me confirm your appointment."],
        ["reschedule", "ˌriːˈʃedjuːl", "riishedyuul", "vaqtini ko'chirmoq", "Can I reschedule for Friday?"],
        ["hold on", "hoʊld ɒn", "hould on", "kutib turmoq (telefonda)", "Hold on a moment, please."],
        ["spell", "spel", "spel", "harflab aytmoq", "Could you spell your name?"]],
    g: { t: "Muloyim so'rov: Could you...? / Can I...?", r: "Muloyim so'rash: Could you + fe'l? Ruxsat so'rash: Can I / May I + fe'l?", ex: ["Could you spell your name, please?", "Can I have your phone number?", "Could you call back later?"], bad: "Could you to spell your name?", good: "Could you spell your name?", why: "could dan keyin 'to' qo'yilmaydi." },
    q: "A patient calls to make an appointment. What do you say?",
    hw: ["Could you...? bilan 5 ta so'rov yozing.", "Telefon dialogini yozing: qabulga yozish va vaqtni ko'chirish.", "Ismingizni inglizcha harflab ayting (S-H-O-H...)."]
  },
  { // 24
    v: [["check in", "tʃek ɪn", "chek in", "ro'yxatdan o'tmoq (mehmonxona)", "I'd like to check in, please."],
        ["reservation", "ˌrezəˈveɪʃn", "rezeveyshn", "bron", "I have a reservation."],
        ["complain", "kəmˈpleɪn", "kempleyn", "shikoyat qilmoq", "I want to complain about the noise."],
        ["directions", "dəˈrekʃnz", "direkshnz", "yo'l ko'rsatma", "Can you give me directions?"],
        ["straight on", "streɪt ɒn", "streyt on", "to'g'riga", "Go straight on, then turn left."]],
    g: { t: "I'd like... / Would you like...?", r: "Muloyim istak: I'd like + ot / to + fe'l. Taklif: Would you like...? ('I want' qo'polroq eshitiladi).", ex: ["I'd like a room for two nights.", "I'd like to check in.", "Would you like some tea?"], bad: "I want room.", good: "I'd like a room, please.", why: "Mehmonxonada I'd like muloyimroq; birlikdagi otdan oldin a." },
    q: "Check in at a hotel. There is a problem with your room.",
    hw: ["I'd like bilan 5 ta gap yozing.", "Mehmonxonada shikoyat dialogini yozing.", "Uyingizdan klinikagacha yo'lni inglizcha tushuntiring."]
  },
  { // 25
    v: [["experience", "ɪkˈspɪəriəns", "ikspiriens", "tajriba", "I have ten years of experience."],
        ["strength", "streŋθ", "strengs (th)", "kuchli tomon", "My main strength is patience."],
        ["weakness", "ˈwiːknəs", "viiknes", "zaif tomon", "My weakness is public speaking."],
        ["responsible for", "rɪˈspɒnsəbl fɔː", "risponsebl foo", "...ga mas'ul", "I am responsible for the lab."],
        ["skill", "skɪl", "skil", "ko'nikma", "I have good computer skills."]],
    g: { t: "for / since va Present Perfect (ish tajribasi)", r: "Qancha vaqtdan beri: I have worked here for 8 years / since 2018.", ex: ["I have worked as a doctor for 15 years.", "I have run my clinic since 2023.", "How long have you worked there?"], bad: "I work here since 2023.", good: "I have worked here since 2023.", why: "since bilan hozirgacha davom etayotgan ish — have worked." },
    q: "Tell me about your experience. What are your strengths and weaknesses?",
    hw: ["Ish tajribangiz haqida for / since bilan 4 ta gap yozing.", "2 ta kuchli va 1 ta zaif tomoningizni yozing.", "Intervyu javoblarini yozib oling."]
  },
  { // 26
    v: [["colleague", "ˈkɒliːɡ", "koliig", "hamkasb", "Nice to meet a colleague from abroad."],
        ["conference", "ˈkɒnfərəns", "konferens", "konferensiya", "Is this your first conference?"],
        ["What do you do?", "wɒt də jʊ duː", "vot du yu duu", "Kim bo'lib ishlaysiz?", "So, what do you do?"],
        ["keep in touch", "kiːp ɪn tʌtʃ", "kiip in tach", "aloqada bo'lmoq", "Let's keep in touch."],
        ["It was nice talking to you", "ɪt wəz naɪs ˈtɔːkɪŋ tə juː", "it voz nays tooking tu yu", "suhbatlashganimdan xursandman", "It was nice talking to you. Here's my card."]],
    g: { t: "Tag questions: ..., isn't it?", r: "Suhbatni davom ettirish uchun gap oxirida qisqa savol: musbat gap → inkor savol.", ex: ["It's a great conference, isn't it?", "You're from Germany, aren't you?", "The weather is nice, isn't it?"], bad: "It's cold, yes?", good: "It's cold, isn't it?", why: "Ingliz tilida 'yes?' o'rniga tag question ishlatiladi." },
    q: "You meet a foreign colleague at a conference. Start the conversation.",
    hw: ["5 ta tag question yozing.", "Small talk dialogini yozing: salom → kasb → shahar → xayrlashuv.", "Claude ovozli rejimida small talk qiling."]
  },
  { // 27
    v: [["present", "prɪˈzent", "prizent", "taqdim qilmoq", "Today I want to present my clinic."],
        ["equipment", "ɪˈkwɪpmənt", "ikvipment", "jihoz, uskuna", "We have modern equipment."],
        ["goal", "ɡoʊl", "goul", "maqsad", "Our goal is early diagnosis."],
        ["plan", "plæn", "plen", "reja; rejalashtirmoq", "We plan to open a new service."],
        ["thank you for listening", "θæŋk juː fə ˈlɪsnɪŋ", "senk yu for lisning (th)", "tinglaganingiz uchun rahmat", "Thank you for listening. Any questions?"]],
    g: { t: "Kelajak: going to / will", r: "Oldindan rejalashtirilgan ish — be going to; hozir qabul qilingan qaror yoki va'da — will.", ex: ["We are going to buy a new ultrasound machine.", "I'll answer your questions now."], bad: "We will to buy a new machine.", good: "We are going to buy a new machine.", why: "will dan keyin to yo'q; reja uchun going to tabiiyroq." },
    q: "Present your clinic or your project in 3 minutes.",
    hw: ["Klinikangiz rejalari haqida going to bilan 4 ta gap yozing.", "Taqdimot rejasini tuzing: kirish → muammo → yechim → reja.", "3 daqiqalik taqdimotni yozib oling."]
  },
  { // 28
    v: [["Let me think", "let miː θɪŋk", "let mii sink (th)", "o'ylab olay", "Let me think... yes, that's right."],
        ["What I mean is", "wɒt aɪ miːn ɪz", "vot ay miin iz", "aytmoqchi bo'lganim", "What I mean is, we need more time."],
        ["Could you repeat that?", "kʊd juː rɪˈpiːt ðæt", "kud yu ripiit zet", "qaytara olasizmi?", "Sorry, could you repeat that?"],
        ["I'm not sure", "aɪm nɒt ʃʊə", "aym not shue", "aniq bilmayman", "I'm not sure, but I think so."],
        ["That makes sense", "ðæt meɪks sens", "zet meyks sens", "mantiqan to'g'ri", "Oh, that makes sense now."]],
    g: { t: "Takrorlash: real suhbat", r: "Bu hafta: have had for / since, Could you...?, I'd like, tag questions, going to / will.", ex: ["Could you tell me how long you have had this pain?", "We're going to open at nine, aren't we?"], bad: "I want that you call me.", good: "I'd like you to call me.", why: "'want that' o'zbekcha tuzilish; inglizcha: I'd like / want you to..." },
    q: "Repeat your favourite role-play without stopping.",
    hw: ["22-27 kunlarning so'zlarini takrorlang.", "Eng yoqqan rol o'yinini pauzasiz ayting.", "3 daqiqalik taqdimotni qayta yozib oling."]
  },
  { // 29
    v: [["confident", "ˈkɒnfɪdənt", "konfident", "o'ziga ishongan", "I feel more confident now."],
        ["progress", "ˈproʊɡres", "progres", "o'sish, rivojlanish", "I can see my progress."],
        ["challenge", "ˈtʃælɪndʒ", "chelinj", "qiyinchilik, sinov", "Speaking was a big challenge."],
        ["achieve", "əˈtʃiːv", "echiiv", "erishmoq", "I achieved my goal."],
        ["keep going", "kiːp ˈɡoʊɪŋ", "kiip gouing", "davom etmoq", "I'm going to keep going."]],
    g: { t: "Aralash takrorlash: zamonlar", r: "Hozirgi odat — Present Simple; o'tgan voqea — Past Simple; tajriba — Present Perfect; reja — going to.", ex: ["I work in Yaypan.", "I started this course 29 days ago.", "I have learned a lot.", "I'm going to continue."], bad: "I have started this course 29 days ago.", good: "I started this course 29 days ago.", why: "'ago' — aniq vaqt, demak Past Simple." },
    q: "Who are you, what do you do, and what have you learned this month?",
    hw: ["Har zamon uchun 2 tadan gap yozing.", "10 savolga javoblarni yozib oling.", "Claude bilan 3 daqiqa jonli suhbat qiling."]
  },
  { // 30
    v: [["look back", "lʊk bæk", "luk bek", "ortga nazar tashlamoq", "When I look back, I see big changes."],
        ["compared to", "kəmˈpeəd tuː", "kempeerd tu", "...ga nisbatan", "Compared to Day 1, I speak faster."],
        ["fluently", "ˈfluːəntli", "fluuentli", "ravon", "I want to speak fluently."],
        ["next step", "nekst step", "nekst step", "keyingi qadam", "My next step is B2."],
        ["proud", "praʊd", "praud", "faxrlangan", "I'm proud of myself."]],
    g: { t: "Yakun: maqsad haqida gapirish", r: "Maqsad: I want to / I'd like to / I'm going to + fe'l. Natija: I have + 3-shakl.", ex: ["I have finished the 30-day plan.", "I'm going to reach B2 next year.", "I'd like to read medical articles in English."], bad: "I want reach B2.", good: "I want to reach B2.", why: "want dan keyin to + fe'l." },
    q: "Speak for 5 minutes: who you are, what you do, and your plans.",
    hw: ["1-kun yozuvini tinglang va farqni yozing.", "Keyingi 30 kun uchun 3 ta maqsad yozing.", "Yakuniy nutqni Claude'ga yuborib, baho oling."]
  }
];

// Avtomatik tekshiruv: tez-tez uchraydigan xatolar (o'zbek tilida so'zlashuvchilar uchun)
// [regex, to'g'ri variantni yasash, izoh]
var COMMON_ERRORS = [
  [/\b(he|she|it|my (?:son|wife|father|mother|brother|sister|husband|daughter|friend|teacher|boss))\s+(work|live|like|love|go|want|play|study|need|know|eat|drink|teach|help|come|make|watch|read|speak|think|look|say|see|take|cook|drive|sleep)\b(?!s)/i,
    function (m) { var v = m[2].toLowerCase(), s = /(o|ch|sh|s|x)$/.test(v) ? v + "es" : v + "s"; return m[1] + " " + s; },
    "he / she / it bilan Present Simple fe'liga -s qo'shiladi."],
  [/\b(he|she|it)\s+have\b/i, function (m) { return m[1] + " has"; }, "he / she / it bilan have → has."],
  [/\b(he|she|it)\s+don'?t\b/i, function (m) { return m[1] + " doesn't"; }, "he / she / it inkorida doesn't."],
  [/\bdoes\s+(\w+)\s+(\w+s)\b/i, function (m) { var v = m[2]; v = /(ch|sh|x|ss|o)es$/.test(v) ? v.slice(0, -2) : v.replace(/s$/, ""); return m[0].slice(0, 4) + " " + m[1] + " " + v; }, "does dan keyin fe'lga -s qo'shilmaydi."],
  [/\bi\s+(am|'m)\s+agree\b/i, function () { return "I agree"; }, "agree — fe'l; 'am' kerak emas."],
  [/\b(I am|I'm)\s+(work|live|like|love|go|want|study|teach)\b(?!ing)/i, function (m) { return "I " + m[2] + " / I'm " + m[2] + "ing"; }, "am dan keyin fe'l -ing oladi yoki am olib tashlanadi."],
  [/\bdid(n'?t)?\s+(\w+ed|went|saw|had|ate|came|took|made|got|grew|was|were)\b/i, function (m) { var irr = { went: "go", saw: "see", had: "have", ate: "eat", came: "come", took: "take", made: "make", got: "get", grew: "grow", was: "be", were: "be" }, w = m[2].toLowerCase(); return "did" + (m[1] || "") + " " + (irr[w] || w.replace(/ed$/, "")); }, "did / didn't dan keyin fe'l oddiy shaklda bo'ladi."],
  [/\bmore\s+(\w+er)\b/i, function (m) { return m[1]; }, "-er va more birga ishlatilmaydi."],
  [/\b(can|should|must|could|will|would)\s+to\s+(\w+)/i, function (m) { return m[1] + " " + m[2]; }, "can / should / must / could / will dan keyin 'to' qo'yilmaydi."],
  [/\benjoy\s+to\s+(\w+)/i, function (m) { return "enjoy " + m[1].replace(/e$/, "") + "ing"; }, "enjoy dan keyin -ing keladi."],
  [/\b(if)\s+([\w ]{1,20}?)\s+will\s+(\w+)/i, function (m) { var third = /^(he|she|it|this|the \w+)$/i.test(m[2].trim()); return m[1] + " " + m[2] + " " + m[3] + (third && !/s$/.test(m[3]) ? "s" : ""); }, "if qismida will ishlatilmaydi: If + Present Simple, ... will."],
  [/\bthe people was\b/i, function () { return "the people were"; }, "people — ko'plik, demak were."],
  [/\b(I|we|they|you)\s+was\b/i, function (m) { return m[1] + (m[1].toLowerCase() === "i" ? " was" : " were"); }, "we / you / they bilan were."],
  [/\bI want (?!to\b)(reach|learn|be|speak|go|buy|open|have)\b/i, function (m) { return "I want to " + m[1]; }, "want dan keyin to + fe'l."]
];

function lessonCheck(text) {
  var out = [], sentences = String(text).split(/(?<=[.!?])\s+|\n+/);
  sentences.forEach(function (s) {
    if (!s.trim()) return;
    if (/(^|\s)i(\s|'|$)/.test(s)) out.push({ bad: s.trim(), good: s.trim().replace(/(^|\s)i(?=\s|'|$)/g, "$1I"), why: "'I' (men) har doim katta harf bilan yoziladi.", kind: "imlo" });
    COMMON_ERRORS.forEach(function (e) {
      if (!e[1]) return;
      var m = s.match(e[0]); if (!m) return;
      out.push({ bad: s.trim(), good: s.trim().replace(m[0], e[1](m)), why: e[2], kind: "grammatika" });
    });
    // O'tgan zamon belgisi bor, lekin fe'l hozirgi zamonda
    if (/\b(yesterday|last (week|year|month|night)|ago)\b/i.test(s) && /\b(I|we|they|he|she)\s+(go|have|see|visit|work|live|eat|come|buy|meet)\b/i.test(s) && !/\b(will|going to|did|didn't)\b/i.test(s)) {
      var irr = { go: "went", have: "had", see: "saw", visit: "visited", work: "worked", live: "lived", eat: "ate", come: "came", buy: "bought", meet: "met" };
      var mm = s.match(/\b(I|we|they|he|she)\s+(go|have|see|visit|work|live|eat|come|buy|meet)\b/i);
      out.push({ bad: s.trim(), good: s.trim().replace(mm[0], mm[1] + " " + irr[mm[2].toLowerCase()]), why: "yesterday / last ... / ago — o'tgan zamon: fe'lni Past Simple'ga qo'ying.", kind: "grammatika" });
    }
  });
  return out;
}

function lessonOf(d) { return LESSONS[d] || null; }
