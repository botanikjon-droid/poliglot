// Poliglot — kunlik hikoyalar (ibratli, hadis asosida)
// Har kunning yangi so'zlari keyingi kunlarda (+1, +3, +6, +13, +29) hikoyada yana uchraydi.
// Hadislar faqat ishonchli manbalardan, manbasi bilan. Manbasi aniq bo'lmasa — oddiy ibratli hikoya.

var REVIEW_OFFSETS = [1, 3, 6, 13, 29];

// w: [inglizcha so'z/ibora, o'zbekcha]
var STORIES = [
  null,
  { // 1. About me
    title: "Ali",
    w: [["my name is", "mening ismim"], ["years old", "yoshda"], ["I live in", "men ...da yashayman"], ["I work", "men ishlayman"], ["I have", "menda bor"], ["I like", "menga yoqadi"]],
    text: "My name is Ali. I am forty years old. I live in a small town. I work in a hospital. I like my work. I have two sons. My sons like football. I like football too. In the evening I work in my garden. I live near my work. My name is Ali, and I like my life.",
    hadith: null,
    q: ["Where does Ali live?", "What does Ali like?", "How many sons does Ali have?"],
    retell: "My name is ___. I am ___ years old. I live in ___. I work in ___. I have ___. I like ___."
  },
  { // 2. My daily routine
    title: "Bread from my own hands",
    w: [["morning", "ertalab"], ["wake up", "uyg'onmoq"], ["early", "erta"], ["hard", "og'ir, qiyin"], ["earn", "topmoq (pul)"], ["with my own hands", "o'z qo'lim bilan"]],
    text: "My name is Bobur. I live in a village. Every morning I wake up early. I work in my field. The work is hard, but I like it. I have a small shop too. I earn money with my own hands. In the evening I come home and rest. One day my grandfather told me: \"The Prophet ﷺ said: No one eats better food than the food he earns with his own hands.\" Now I eat my bread with a happy heart.",
    hadith: { en: "No one has ever eaten better food than what he eats from the work of his own hands.", uz: "Hech kim o'z qo'li mehnati bilan topganidan yaxshiroq taom yemagan.", src: "Buxoriy rivoyati (Sahih al-Buxoriy, 2072)" },
    q: ["When does Bobur wake up?", "Is his work easy?", "What did his grandfather tell him?"],
    retell: "Every morning I wake up at ___. I work ___. My work is ___, but I like it."
  },
  { // 3. My family
    title: "The best to his family",
    w: [["family", "oila"], ["wife", "turmush o'rtoq (xotin)"], ["father", "ota"], ["mother", "ona"], ["sons", "o'g'illar"], ["together", "birga"]],
    text: "My name is Karim. I live in a big house with my family. I have a wife and three sons. My father and mother live with us too. Every morning I wake up early and go to work. My work is hard, but I earn money for my family. In the evening I come home. I like to sit together with my family. One day my son asked: \"Father, why are you always kind to us?\" I said: \"The Prophet ﷺ said: The best of you are those who are best to their families.\" Now my sons help their mother every day. We are happy together.",
    hadith: { en: "The best of you are those who are best to their families, and I am the best of you to my family.", uz: "Sizlarning eng yaxshingiz oilasiga eng yaxshi bo'lganingizdir. Men oilamga eng yaxshi bo'lganingizman.", src: "Termiziy rivoyati (Jome' at-Termiziy, 3895)" },
    q: ["Who lives in Karim's house?", "What does Karim like to do in the evening?", "What do his sons do now?"],
    retell: "I have a family. My family is ___. In the evening we ___ together."
  },
  { // 4. My hometown
    title: "A smile is charity",
    w: [["town", "shaharcha"], ["neighbor", "qo'shni"], ["smile", "tabassum, jilmaymoq"], ["kind", "mehribon"], ["help", "yordam bermoq"], ["charity", "sadaqa, xayriya"]],
    text: "I live in a small town. I like my town because people are kind. I have a good neighbor. He is an old man. Every morning I smile and say: \"Good morning!\" One day he said: \"Your smile makes my day happy.\" I remembered the words of the Prophet ﷺ: \"Your smile in the face of your brother is charity.\" A smile is easy and free. Now my family and I smile at everyone. My wife and my mother help our neighbor too. My sons and his grandsons play together. Being kind is a good charity.",
    hadith: { en: "Your smiling in the face of your brother is charity.", uz: "Birodaringning yuziga tabassum qilishing sadaqadir.", src: "Termiziy rivoyati (Jome' at-Termiziy, 1956)" },
    q: ["Why does he like his town?", "What did the neighbor say?", "What does his family do now?"],
    retell: "I live in ___. My town is ___. My neighbor is ___. I help ___."
  },
  { // 5. Food and cooking
    title: "Eat with your right hand",
    w: [["cook", "oshpaz; pishirmoq"], ["dish", "taom"], ["delicious", "mazali"], ["right hand", "o'ng qo'l"], ["share", "baham ko'rmoq"], ["hungry", "och"]],
    text: "My mother is a great cook. Her best dish is plov. Every Friday she gets up early and cooks a big pot. The work is hard, but she likes it. The plov is very delicious. We always share it with our neighbor. One day my little son was very hungry. He ate fast, with his left hand, from every side of the plate. My father smiled and said: \"The Prophet ﷺ said: Say Bismillah, eat with your right hand, and eat from what is in front of you.\" Now my son eats slowly. Sharing food is a kind charity too.",
    hadith: { en: "Say Bismillah, eat with your right hand, and eat from what is in front of you.", uz: "Bismilloh deb ayt, o'ng qo'ling bilan ye va o'z oldingdan ye.", src: "Buxoriy (5376) va Muslim (2022) rivoyati" },
    q: ["What is the mother's best dish?", "Who do they share the plov with?", "What did the father say?"],
    retell: "My favourite dish is ___. My ___ cooks it. It is very delicious because ___."
  },
  { // 6. Free time
    title: "The path of knowledge",
    w: [["free time", "bo'sh vaqt"], ["weekend", "dam olish kunlari"], ["read", "o'qimoq"], ["learn", "o'rganmoq"], ["knowledge", "ilm, bilim"], ["path", "yo'l"]],
    text: "At the weekend I have some free time. I like to read books. My father always says: \"Learn something new every day.\" On Saturday morning I go to the park with my sons. We play football together. In the evening my wife cooks a delicious dinner, and we share it with the family. After dinner I read a book and learn new words. One day my son asked: \"Father, why do you read so much?\" I said: \"The Prophet ﷺ said: Whoever takes a path to seek knowledge, Allah makes easy for him a path to Paradise.\" Now my sons read with me in their free time.",
    hadith: { en: "Whoever takes a path to seek knowledge, Allah makes easy for him a path to Paradise.", uz: "Kim ilm talabida yo'lga chiqsa, Alloh unga jannat yo'lini oson qiladi.", src: "Muslim rivoyati (Sahih Muslim, 2699)" },
    q: ["What does he do at the weekend?", "Why does he read so much?", "What do his sons do now?"],
    retell: "In my free time I ___. At the weekend I ___. I want to learn ___."
  },
  { // 7. 1-hafta nazorati
    title: "Actions are by intentions",
    w: [["intention", "niyat"], ["begin", "boshlamoq"], ["good deed", "savobli ish"], ["important", "muhim"], ["heart", "qalb"], ["patient", "bemor"]],
    text: "My name is Umar. I am thirty-five years old. I live in a small town. I work as a doctor. Before I begin my work, I think about my intention. My teacher told me: \"The Prophet ﷺ said: Actions are only by intentions.\" If my intention is good, my work is a good deed. Every patient is important to me. I smile at them and help them. At the weekend, in my free time, I read and learn. I like my life, and I try to keep a clean heart.",
    hadith: { en: "Actions are only by intentions.", uz: "Amallar faqat niyatlarga bog'liqdir.", src: "Buxoriy (1) va Muslim (1907) rivoyati" },
    q: ["What does Umar do before he begins his work?", "What happens when his intention is good?", "What does Umar do in his free time?"],
    retell: "My name is ___. I work as ___. Before I begin my work, I ___. The most important thing for me is ___."
  }
];

// Shu kunda takrorlanadigan oldingi kunlar so'zlari
function storyReviewWords(d) {
  var out = [];
  REVIEW_OFFSETS.forEach(function (o) {
    var s = STORIES[d - o];
    if (s) s.w.forEach(function (x) { out.push({ en: x[0], uz: x[1], from: d - o }); });
  });
  return out;
}

// Ingliz vazifalari: asosiy vazifalar + hikoya (hikoyasi bor kunlarda, oxiriga qo'shiladi — oldingi belgilar siljimaydi)
function enTasks(d) {
  var t = enBaseTasks(d);
  if (STORIES[d]) t = t.concat([{ t: "Kun hikoyasi", m: 5, d: "Hikoyani tinglang, 2 marta ovoz chiqarib o'qing, savollarga javob bering va o'zingiz haqida qayta aytib bering. Unutgan so'zlaringizni belgilang.", a: "story" }]);
  return t;
}
