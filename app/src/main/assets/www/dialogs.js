// Poliglot — kunlik dialoglar (ikki rol). Har dialog o'sha kun hikoyasining so'zlari bilan tuzilgan.
// Mashq 4 bosqich: 1) lektor butun dialogni o'qiydi; 2) rollarga bo'linib aytiladi (bir rol sizniki);
// 3) inglizcha gap aytiladi — o'zbekcha ma'nosi so'raladi; 4) o'zbekchasi ko'rsatiladi — inglizcha aytish so'raladi.
// r: [rol nomi, o'zbekcha izoh]; l: [rol raqami (0 yoki 1), inglizcha, o'zbekcha]

var DIALOGS = [
  null,
  { // 1. About me
    title: "Nice to meet you",
    r: [["Ali", "yangi xodim"], ["Sara", "hamshira"]],
    l: [
      [1, "Hello! I'm Sara. What's your name?", "Salom! Men Saraman. Ismingiz nima?"],
      [0, "Hi, Sara. My name is Ali. Nice to meet you.", "Salom, Sara. Mening ismim Ali. Tanishganimdan xursandman."],
      [1, "Nice to meet you too. Where do you live?", "Men ham xursandman. Qayerda yashaysiz?"],
      [0, "I live in a small town near the hospital.", "Men kasalxona yaqinidagi kichik shaharchada yashayman."],
      [1, "Do you work here?", "Shu yerda ishlaysizmi?"],
      [0, "Yes, I work in the ultrasound room. I like my work.", "Ha, men UZI xonasida ishlayman. Ishim menga yoqadi."],
      [1, "How old are you, if I may ask?", "So'rasam maylimi, yoshingiz nechada?"],
      [0, "I am forty years old, and I have two sons.", "Men qirq yoshdaman va ikki o'g'lim bor."]
    ]
  },
  { // 2. Daily routine
    title: "An early morning",
    r: [["Bobur", "dehqon"], ["Aziz", "do'sti"]],
    l: [
      [1, "Good morning, Bobur! You are up early.", "Xayrli tong, Bobur! Erta turibsiz."],
      [0, "Good morning! I always wake up early.", "Xayrli tong! Men doim erta uyg'onaman."],
      [1, "Is your work in the field hard?", "Daladagi ishingiz og'irmi?"],
      [0, "Yes, it is hard, but I like it.", "Ha, og'ir, lekin menga yoqadi."],
      [1, "Do you earn enough money?", "Yetarlicha pul topasizmi?"],
      [0, "I earn money with my own hands, and that makes me happy.", "Men o'z qo'lim bilan pul topaman va bu meni xursand qiladi."],
      [1, "What time do you start in the morning?", "Ertalab soat nechada boshlaysiz?"],
      [0, "At six o'clock. The morning is the best time to work.", "Soat oltida. Ertalab ishlash uchun eng yaxshi vaqt."]
    ]
  },
  { // 3. Family
    title: "Tell me about your family",
    r: [["Karim", "ota"], ["Laylo", "hamkasbi"]],
    l: [
      [1, "Karim, do you have a big family?", "Karim, oilangiz kattami?"],
      [0, "Yes, I live with my wife, our three sons and my parents.", "Ha, men xotinim, uch o'g'limiz va ota-onam bilan yashayman."],
      [1, "Your father and mother live with you?", "Otangiz va onangiz siz bilan yashaydimi?"],
      [0, "Yes, they do. We eat dinner together every evening.", "Ha. Har kuni kechqurun birga kechki ovqat qilamiz."],
      [1, "That's lovely. Do your sons help at home?", "Bu ajoyib. O'g'illaringiz uyda yordam beradimi?"],
      [0, "They help their mother every day.", "Ular har kuni onalariga yordam berishadi."],
      [1, "You must be a happy father.", "Siz baxtli ota bo'lsangiz kerak."],
      [0, "I am. My family is the most important thing in my life.", "Ha. Oilam hayotimdagi eng muhim narsa."]
    ]
  },
  { // 4. Hometown
    title: "A good neighbor",
    r: [["Akmal", "mahalla odami"], ["Otabek", "yangi qo'shni"]],
    l: [
      [1, "Hello, I'm your new neighbor, Otabek.", "Salom, men yangi qo'shningiz Otabekman."],
      [0, "Welcome! I'm Akmal. Do you like our town?", "Xush kelibsiz! Men Akmalman. Shaharchamiz yoqdimi?"],
      [1, "Yes, it is small and quiet. The people are kind.", "Ha, kichik va tinch. Odamlari mehribon."],
      [0, "If you need anything, I can help you.", "Biror narsa kerak bo'lsa, sizga yordam bera olaman."],
      [1, "Thank you. You always smile at people.", "Rahmat. Siz doim odamlarga jilmayasiz."],
      [0, "A smile is charity, and it is free.", "Tabassum sadaqa, u bepul."],
      [1, "That's beautiful. I will remember it.", "Bu chiroyli gap. Eslab qolaman."],
      [0, "Come for tea this evening with your family.", "Bugun kechqurun oilangiz bilan choyga keling."]
    ]
  },
  { // 5. Food
    title: "Dinner is ready",
    r: [["Malika", "uy bekasi"], ["Jasur", "mehmon"]],
    l: [
      [0, "Come in, Jasur. Dinner is ready. Are you hungry?", "Kiring, Jasur. Kechki ovqat tayyor. Qorningiz ochmi?"],
      [1, "Yes, very hungry! What did you cook today?", "Ha, juda och! Bugun nima pishirdingiz?"],
      [0, "I cooked plov. It is my favorite dish.", "Palov pishirdim. Bu mening eng yaxshi ko'rgan taomim."],
      [1, "Mmm, it is delicious!", "Mmm, juda mazali!"],
      [0, "Please eat with your right hand and say Bismillah.", "Iltimos, o'ng qo'lingiz bilan yeng va Bismillah deng."],
      [1, "Of course. Can I share it with my brother? He is outside.", "Albatta. Akam bilan baham ko'rsam maylimi? U tashqarida."],
      [0, "Yes, call him in. Food is better when we share it.", "Ha, uni chaqiring. Baham ko'rilsa, ovqat yanada yaxshi."],
      [1, "Thank you for the delicious food.", "Mazali ovqat uchun rahmat."]
    ]
  },
  { // 6. Free time and learning
    title: "What do you do at the weekend?",
    r: [["Yusuf", "talaba"], ["Ustoz", "o'qituvchi"]],
    l: [
      [1, "Yusuf, what do you do in your free time?", "Yusuf, bo'sh vaqtingizda nima qilasiz?"],
      [0, "At the weekend I read books and learn English.", "Dam olish kunlari kitob o'qiyman va ingliz tilini o'rganaman."],
      [1, "Why do you want to learn English?", "Nega ingliz tilini o'rganmoqchisiz?"],
      [0, "Because a lot of medical knowledge is in English.", "Chunki tibbiy bilimlarning ko'pi ingliz tilida."],
      [1, "Is it easy for you?", "Siz uchun osonmi?"],
      [0, "Not really, but I try every day.", "Unchalik emas, lekin har kuni harakat qilaman."],
      [1, "Remember, the path of knowledge is a path to Paradise.", "Yodingizda bo'lsin, ilm yo'li jannat yo'lidir."],
      [0, "Thank you, teacher. That gives me strength.", "Rahmat, ustoz. Bu menga kuch beradi."]
    ]
  },
  { // 7. Intention (review)
    title: "Before the first patient",
    r: [["Umar", "shifokor"], ["Nodira", "hamshira"]],
    l: [
      [1, "Doctor, the first patient is here. Can we begin?", "Doktor, birinchi bemor keldi. Boshlaymizmi?"],
      [0, "Yes, one minute. I always think about my intention first.", "Ha, bir daqiqa. Men doim avval niyatimni o'ylayman."],
      [1, "Why is that important?", "Bu nega muhim?"],
      [0, "Actions are by intentions. With a good heart, work becomes a good deed.", "Amallar niyatga bog'liq. Yaxshi qalb bilan ish savobli amalga aylanadi."],
      [1, "Some patients are angry and tired.", "Ba'zi bemorlar jahldor va charchagan."],
      [0, "I know. We must be calm and patient with them.", "Bilaman. Ular bilan xotirjam va sabrli bo'lishimiz kerak."],
      [1, "OK. I will bring the patient in now.", "Xo'p. Hozir bemorni olib kiraman."],
      [0, "Thank you, Nodira. Let's begin.", "Rahmat, Nodira. Boshladik."]
    ]
  }
];
