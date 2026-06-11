import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/linguaworld?schema=public";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const LEVELS = [
  { id: "A0", name: "Starter", city: "London", order: 0, strictness: "soft", color: "#FF6B6B" },
  { id: "A1", name: "Beginner", city: "New York", order: 1, strictness: "soft", color: "#4ECDC4" },
  { id: "A2", name: "Elementary", city: "Toronto", order: 2, strictness: "soft", color: "#45B7D1" },
  { id: "B1", name: "Intermediate", city: "Sydney", order: 3, strictness: "medium", color: "#F9CA24" },
  { id: "B2", name: "Upper Intermediate", city: "Singapore", order: 4, strictness: "medium", color: "#A29BFE" },
  { id: "C1", name: "Advanced", city: "Dublin", order: 5, strictness: "strict", color: "#FD79A8" },
  { id: "C2", name: "Proficiency", city: "World English Master", order: 6, strictness: "strict", color: "#FFD700" },
];

interface A0Topic {
  ru: string;
  en: string;
  alts: string[];
  hint: string;
}

const A0_TOPICS: A0Topic[] = [
  { ru: "Привет", en: "Hello", alts: ["Hi", "Hey"], hint: "Утреннее или дневное приветствие" },
  { ru: "До свидания", en: "Goodbye", alts: ["Bye", "See you", "See you later"], hint: "Фраза при прощании" },
  { ru: "Спасибо", en: "Thank you", alts: ["Thanks", "Thank you very much"], hint: "Выражение благодарности" },
  { ru: "Пожалуйста", en: "Please", alts: ["You are welcome"], hint: "Вежливое слово" },
  { ru: "Извините", en: "Sorry", alts: ["I am sorry", "Excuse me"], hint: "Слово извинения" },
  { ru: "Да", en: "Yes", alts: ["Yeah", "Yep", "Sure"], hint: "Утвердительный ответ" },
  { ru: "Нет", en: "No", alts: ["Nope", "Not really"], hint: "Отрицательный ответ" },
  { ru: "Приятно познакомиться", en: "Nice to meet you", alts: ["Pleased to meet you", "Good to meet you"], hint: "Фраза при знакомстве" },
  { ru: "Как дела", en: "How are you", alts: ["How are you doing", "How is it going"], hint: "Вопрос о самочувствии" },
  { ru: "Меня зовут", en: "My name is", alts: ["I am", "I'm"], hint: "Фраза для представления" },
  { ru: "Красный", en: "Red", alts: ["It is red"], hint: "Цвет крови и огня" },
  { ru: "Синий", en: "Blue", alts: ["It is blue"], hint: "Цвет ясного неба" },
  { ru: "Зеленый", en: "Green", alts: ["It is green"], hint: "Цвет травы и листьев" },
  { ru: "Желтый", en: "Yellow", alts: ["It is yellow"], hint: "Цвет солнца" },
  { ru: "Белый", en: "White", alts: ["It is white"], hint: "Цвет снега" },
  { ru: "Черный", en: "Black", alts: ["It is black"], hint: "Цвет ночи" },
  { ru: "Один", en: "One", alts: ["1", "Number one"], hint: "Первое число" },
  { ru: "Два", en: "Two", alts: ["2", "Number two"], hint: "Второе число" },
  { ru: "Три", en: "Three", alts: ["3", "Number three"], hint: "Третье число" },
  { ru: "Четыре", en: "Four", alts: ["4", "Number four"], hint: "Четвёртое число" },
  { ru: "Пять", en: "Five", alts: ["5", "Number five"], hint: "Пятое число" },
  { ru: "Шесть", en: "Six", alts: ["6", "Number six"], hint: "Шестое число" },
  { ru: "Семь", en: "Seven", alts: ["7", "Number seven"], hint: "Седьмое число" },
  { ru: "Восемь", en: "Eight", alts: ["8", "Number eight"], hint: "Восьмое число" },
  { ru: "Девять", en: "Nine", alts: ["9", "Number nine"], hint: "Девятое число" },
  { ru: "Десять", en: "Ten", alts: ["10", "Number ten"], hint: "Десятое число" },
  { ru: "Кошка", en: "Cat", alts: ["A cat", "Kitty"], hint: "Домашнее животное, которое мурлычет" },
  { ru: "Собака", en: "Dog", alts: ["A dog", "Puppy"], hint: "Лучший друг человека" },
  { ru: "Птица", en: "Bird", alts: ["A bird"], hint: "Животное с крыльями, которое летает" },
  { ru: "Рыба", en: "Fish", alts: ["A fish"], hint: "Животное, которое живёт в воде" },
  { ru: "Лошадь", en: "Horse", alts: ["A horse"], hint: "Животное, на котором ездят верхом" },
  { ru: "Медведь", en: "Bear", alts: ["A bear"], hint: "Крупное дикое животное" },
  { ru: "Слон", en: "Elephant", alts: ["An elephant"], hint: "Самое большое наземное животное" },
  { ru: "Яблоко", en: "Apple", alts: ["An apple"], hint: "Красный или зелёный фрукт" },
  { ru: "Банан", en: "Banana", alts: ["A banana"], hint: "Жёлтый продолговатый фрукт" },
  { ru: "Вода", en: "Water", alts: ["Some water"], hint: "Жидкость, которую мы пьём" },
  { ru: "Молоко", en: "Milk", alts: ["Some milk"], hint: "Белый напиток" },
  { ru: "Хлеб", en: "Bread", alts: ["Some bread"], hint: "Продукт из муки" },
  { ru: "Мясо", en: "Meat", alts: ["Some meat"], hint: "Пищевой продукт животного происхождения" },
  { ru: "Мама", en: "Mother", alts: ["Mom", "Mum", "Mommy"], hint: "Женщина-родитель" },
  { ru: "Папа", en: "Father", alts: ["Dad", "Daddy"], hint: "Мужчина-родитель" },
  { ru: "Брат", en: "Brother", alts: ["A brother"], hint: "Мальчик из той же семьи" },
  { ru: "Сестра", en: "Sister", alts: ["A sister"], hint: "Девочка из той же семьи" },
  { ru: "Семья", en: "Family", alts: ["A family", "Relatives"], hint: "Группа родственников" },
  { ru: "Голова", en: "Head", alts: ["My head"], hint: "Верхняя часть тела" },
  { ru: "Рука", en: "Hand", alts: ["Arm", "My hand"], hint: "Часть тела от плеча до кисти" },
  { ru: "Глаза", en: "Eyes", alts: ["My eyes"], hint: "Органы, которыми мы видим" },
  { ru: "Нос", en: "Nose", alts: ["My nose"], hint: "Орган, которым мы чувствуем запахи" },
  { ru: "Рот", en: "Mouth", alts: ["My mouth"], hint: "Орган, которым мы едим и говорим" },
  { ru: "Уши", en: "Ears", alts: ["My ears"], hint: "Органы, которыми мы слышим" },
  { ru: "Дом", en: "House", alts: ["Home", "A house"], hint: "Место, где живут люди" },
  { ru: "Стол", en: "Table", alts: ["A table"], hint: "Предмет мебели с плоской поверхностью" },
  { ru: "Стул", en: "Chair", alts: ["A chair"], hint: "Предмет мебели для сидения" },
  { ru: "Дверь", en: "Door", alts: ["A door"], hint: "Проём для входа и выхода" },
  { ru: "Окно", en: "Window", alts: ["A window"], hint: "Проём в стене для света" },
  { ru: "Кровать", en: "Bed", alts: ["A bed"], hint: "Мебель для сна" },
  { ru: "Солнце", en: "Sun", alts: ["The sun"], hint: "Звезда, дающая свет и тепло" },
  { ru: "Луна", en: "Moon", alts: ["The moon"], hint: "Ночное светило на небе" },
  { ru: "Дождь", en: "Rain", alts: ["Rainy", "It is raining"], hint: "Вода, падающая с неба" },
  { ru: "Снег", en: "Snow", alts: ["Snowy", "It is snowing"], hint: "Белые осадки зимой" },
  { ru: "Дерево", en: "Tree", alts: ["A tree"], hint: "Высокое растение со стволом" },
  { ru: "Цветок", en: "Flower", alts: ["A flower"], hint: "Красивая часть растения" },
  { ru: "Шляпа", en: "Hat", alts: ["A hat", "Cap"], hint: "Головной убор" },
  { ru: "Обувь", en: "Shoes", alts: ["Sneakers", "Boots"], hint: "То, что носят на ногах" },
  { ru: "Книга", en: "Book", alts: ["A book"], hint: "То, что читают" },
  { ru: "Ручка", en: "Pen", alts: ["A pen", "Pencil"], hint: "Инструмент для письма" },
  { ru: "Ключ", en: "Key", alts: ["A key"], hint: "То, чем открывают двери" },
  { ru: "Бежать", en: "Run", alts: ["To run", "Running"], hint: "Быстро передвигаться на ногах" },
  { ru: "Есть", en: "Eat", alts: ["To eat", "Eating"], hint: "Принимать пищу" },
  { ru: "Пить", en: "Drink", alts: ["To drink", "Drinking"], hint: "Употреблять жидкость" },
  { ru: "Спать", en: "Sleep", alts: ["To sleep", "Sleeping"], hint: "Находиться в состоянии отдыха" },
  { ru: "Читать", en: "Read", alts: ["To read", "Reading"], hint: "Воспринимать написанный текст" },
  { ru: "Говорить", en: "Speak", alts: ["Talk", "To speak", "To talk"], hint: "Общаться с помощью слов" },
];

const LEVEL_ORDER: Record<string, number> = Object.fromEntries(LEVELS.map((l) => [l.id, l.order]));

const PLACEHOLDER_WORDS = [
  "often", "always", "sometimes", "never", "usually", "already", "just", "ever", "yet", "still",
  "beautiful", "important", "possible", "necessary", "different", "popular", "expensive", "modern",
  "government", "education", "business", "economy", "technology", "environment", "development",
  "understand", "remember", "believe", "consider", "continue", "suggest", "explain", "improve",
  "possible", "probably", "absolutely", "definitely", "obviously", "naturally", "essentially",
  "delicious", "terrible", "wonderful", "horrible", "fantastic", "magnificent", "spectacular",
  "architecture", "literature", "philosophy", "psychology", "technology", "engineering",
  "investigation", "communication", "organization", "representation", "identification",
  "accommodation", "recommendation", "qualification", "interpretation", "demonstration",
];

function getLevelTopics(levelId: string): A0Topic[] {
  const order = LEVEL_ORDER[levelId] ?? 0;

  if (levelId === "A0") return A0_TOPICS;

  const modified: A0Topic[] = [];

  for (let i = 0; i < 100; i++) {
    const base = A0_TOPICS[i % A0_TOPICS.length];

    if (order <= 1) {
      modified.push({
        ru: `${base.ru} (формально)`,
        en: base.en,
        alts: [...base.alts],
        hint: `Подумай о вежливом способе сказать это: ${base.hint}`,
      });
    } else if (order <= 2) {
      const tenseVariation = i % 2 === 0 ? `вчера ${base.ru.toLowerCase()}` : `сейчас ${base.ru.toLowerCase()}`;
      modified.push({
        ru: tenseVariation,
        en: base.en,
        alts: [...base.alts],
        hint: `Опиши действие во времени: ${base.hint}`,
      });
    } else if (order <= 3) {
      modified.push({
        ru: `Что означает "${base.en}" в контексте повседневной жизни?`,
        en: base.en,
        alts: [...base.alts, `the ${base.en.toLowerCase()}`],
        hint: `Дай определение этому понятию: ${base.hint}`,
      });
    } else if (order <= 4) {
      const pw = PLACEHOLDER_WORDS[i % PLACEHOLDER_WORDS.length];
      modified.push({
        ru: `Объясни значение слова "${base.en}" в профессиональном контексте`,
        en: base.en,
        alts: [...base.alts, pw],
        hint: `Используй слово "${pw}" в объяснении. ${base.hint}`,
      });
    } else if (order <= 5) {
      modified.push({
        ru: `Проанализируй концепцию "${base.en}" с точки зрения носителя языка`,
        en: base.en,
        alts: [...base.alts, `the concept of ${base.en.toLowerCase()}`],
        hint: `Рассмотри культурные и языковые аспекты: ${base.hint}`,
      });
    } else {
      modified.push({
        ru: `Критически оцени использование "${base.en}" в академическом дискурсе`,
        en: base.en,
        alts: [...base.alts, `${base.en.toLowerCase()} phenomenon`],
        hint: `Используй сложную лексику для описания: ${base.hint}`,
      });
    }
  }

  return modified;
}

function generateLevelQuestions(levelId: string): Array<{
  levelId: string;
  type: string;
  question: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  hint: string;
  explanation: string;
  audioPrompt: string;
  gifPrompt: string;
  imagePrompt: string;
  order: number;
}> {
  const topics = getLevelTopics(levelId);
  const order = LEVEL_ORDER[levelId] ?? 0;
  const questions: Array<{
    levelId: string;
    type: string;
    question: string;
    correctAnswer: string;
    acceptableAnswers: string[];
    hint: string;
    explanation: string;
    audioPrompt: string;
    gifPrompt: string;
    imagePrompt: string;
    order: number;
  }> = [];

  let topicIndex = 0;
  const nextTopic = (): A0Topic => topics[topicIndex++ % topics.length];

  const levelContext = (() => {
    if (levelId === "A0") return "базового";
    if (order <= 1) return "начального";
    if (order <= 2) return "элементарного";
    if (order <= 3) return "среднего";
    if (order <= 4) return "выше среднего";
    if (order <= 5) return "продвинутого";
    return "профессионального";
  })();

  const levelAdj = (() => {
    if (levelId === "A0") return "простого";
    if (order <= 1) return "базового";
    if (order <= 2) return "начального";
    if (order <= 3) return "среднего";
    if (order <= 4) return "повышенного";
    if (order <= 5) return "высокого";
    return "профессионального";
  })();

  const levelTime = order <= 2 ? "сейчас" : order <= 4 ? "в данной ситуации" : "в контексте";

  for (let i = 0; i < 10; i++) {
    const t = nextTopic();
    questions.push({
      levelId,
      type: "text",
      question: `Как сказать "${t.ru}" по-английски?`,
      correctAnswer: t.en,
      acceptableAnswers: t.alts,
      hint: `Вспомни ${levelContext} слова: ${t.hint}`,
      explanation: `Правильный ответ: "${t.en}". Это слово ${levelAdj} уровня. Запомни его для повседневного общения.`,
      audioPrompt: t.en,
      gifPrompt: `Анимация написания слова "${t.en}"`,
      imagePrompt: `Иллюстрация к слову "${t.en}" для уровня ${levelId}`,
      order: i,
    });
  }

  for (let i = 0; i < 25; i++) {
    const t = nextTopic();
    questions.push({
      levelId,
      type: "voice",
      question: `Произнеси вслух слово "${t.en}"`,
      correctAnswer: t.en,
      acceptableAnswers: t.alts,
      hint: `Произнеси чётко: ${t.en}. Обрати внимание на ударение.`,
      explanation: `Ты произнёс(ла) слово "${t.en}". Практикуйся каждый день для улучшения произношения!`,
      audioPrompt: t.en,
      gifPrompt: `Анимация произношения слова "${t.en}"`,
      imagePrompt: `Схема произношения: "${t.en}"`,
      order: 10 + i,
    });
  }

  for (let i = 0; i < 10; i++) {
    const t = nextTopic();
    questions.push({
      levelId,
      type: "translation_ru_en",
      question: `Переведи на английский язык: "${t.ru}"`,
      correctAnswer: t.en,
      acceptableAnswers: t.alts,
      hint: `Ищем английский эквивалент: ${t.hint}`,
      explanation: `Русское слово "${t.ru}" переводится на английский как "${t.en}".`,
      audioPrompt: t.en,
      gifPrompt: `Анимация перевода: "${t.ru}" → "${t.en}"`,
      imagePrompt: `Визуализация перевода: "${t.ru}" = "${t.en}"`,
      order: 35 + i,
    });
  }

  for (let i = 0; i < 10; i++) {
    const t = nextTopic();
    questions.push({
      levelId,
      type: "translation_en_ru",
      question: `Переведи на русский язык: "${t.en}"`,
      correctAnswer: t.ru,
      acceptableAnswers: [t.ru],
      hint: `Вспомни русское слово, соответствующее "${t.en}"`,
      explanation: `Английское слово "${t.en}" означает "${t.ru}" по-русски.`,
      audioPrompt: t.en,
      gifPrompt: `Анимация перевода: "${t.en}" → русский`,
      imagePrompt: `Перевод слова "${t.en}" на русский язык`,
      order: 45 + i,
    });
  }

  for (let i = 0; i < 20; i++) {
    const t = nextTopic();
    const listeningHint = i % 3 === 0 ? "Обрати внимание на первый звук" : i % 3 === 1 ? "Вслушайся в окончание слова" : "Попробуй разбить слово на слоги";
    questions.push({
      levelId,
      type: "listening",
      question: `Прослушай аудиозапись и напиши, что ты услышал(а)`,
      correctAnswer: t.en,
      acceptableAnswers: t.alts,
      hint: `${listeningHint}. Слово: ${t.hint}`,
      explanation: `В аудиозаписи прозвучало слово "${t.en}". Тренируй слуховое восприятие регулярно.`,
      audioPrompt: t.en,
      gifPrompt: `Визуализация звуковых волн слова "${t.en}"`,
      imagePrompt: `Спектрограмма слова "${t.en}"`,
      order: 55 + i,
    });
  }

  for (let i = 0; i < 15; i++) {
    const t = nextTopic();
    const imgDesc = i % 2 === 0 ? `На картинке изображён(а) "${t.en}". Опиши, что ты видишь.` : `Посмотри на изображение и опиши его одним словом. Что это?`;
    questions.push({
      levelId,
      type: "image_description",
      question: imgDesc,
      correctAnswer: t.en,
      acceptableAnswers: t.alts,
      hint: `Присмотрись к деталям изображения: ${t.hint}`,
      explanation: `На изображении показан(а) "${t.en}". Это слово ${levelAdj} уровня.`,
      audioPrompt: t.en,
      gifPrompt: `Анимированное изображение: "${t.en}"`,
      imagePrompt: `Статичное изображение: "${t.en}" для уровня ${levelId}`,
      order: 75 + i,
    });
  }

  for (let i = 0; i < 10; i++) {
    const t = nextTopic();
    const taskText = i % 2 === 0
      ? `Напиши слово, соответствующее изображению на картинке`
      : `Какое слово загадано на этой картинке? Напиши его по-английски.`;
    questions.push({
      levelId,
      type: "image_task",
      question: taskText,
      correctAnswer: t.en,
      acceptableAnswers: t.alts,
      hint: `Сопоставь изображение со словом: ${t.hint}`,
      explanation: `Задание выполнено правильно. На картинке был(а) "${t.en}".`,
      audioPrompt: t.en,
      gifPrompt: `Интерактивная анимация: угадай слово "${t.en}"`,
      imagePrompt: `Изображение-задание: "${t.en}"`,
      order: 90 + i,
    });
  }

  return questions;
}

const GRAMMAR_ARTICLES = [
  {
    levelId: "A0", title: "Английский алфавит и произношение",
    content: `<p>Английский алфавит состоит из <strong>26 букв</strong>.</p><p><strong>Гласные (Vowels):</strong> A, E, I, O, U</p><p><strong>Согласные (Consonants):</strong> B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z</p><p>Буква <strong>Y</strong> может быть как гласной, так и согласной.</p><p>Важно: английское произношение часто отличается от написания. Например, буква "A" читается по-разному в словах "cat", "name", "car".</p>`,
    tags: ["alphabet", "letters", "alfavit", "буквы", "pronunciation"],
    order: 0,
  },
  {
    levelId: "A0", title: "Личные местоимения (Personal Pronouns)",
    content: `<p>Личные местоимения заменяют имена существительные:</p><ul><li><strong>I</strong> — Я</li><li><strong>You</strong> — Ты / Вы</li><li><strong>He</strong> — Он</li><li><strong>She</strong> — Она</li><li><strong>It</strong> — Оно (для предметов и животных)</li><li><strong>We</strong> — Мы</li><li><strong>They</strong> — Они</li></ul><p>Пример: <em>I am a student. She is a teacher. They are friends.</em></p>`,
    tags: ["pronouns", "mestoimeniya", "личные", "местоимения", "I", "you", "he", "she", "it", "we", "they"],
    order: 1,
  },
  {
    levelId: "A0", title: "Глагол TO BE (быть, являться)",
    content: `<p><strong>To be</strong> — самый важный глагол в английском языке.</p><p><strong>Спряжение:</strong></p><ul><li>I <strong>am</strong> — Я есть</li><li>You <strong>are</strong> — Ты есть</li><li>He/She/It <strong>is</strong> — Он/Она/Оно есть</li><li>We <strong>are</strong> — Мы есть</li><li>They <strong>are</strong> — Они есть</li></ul><p><strong>Примеры:</strong></p><ul><li><em>I am happy.</em> — Я счастлив(а).</li><li><em>She is a doctor.</em> — Она врач.</li><li><em>They are at home.</em> — Они дома.</li></ul><p><strong>Отрицание:</strong> добавляем <strong>not</strong>: <em>I am not tired. He is not here.</em></p>`,
    tags: ["to be", "glagol", "быть", "являться", "am", "is", "are"],
    order: 2,
  },
  {
    levelId: "A1", title: "Present Simple (Настоящее простое время)",
    content: `<p><strong>Present Simple</strong> используется для:</p><ul><li>Фактов и общих истин: <em>Water boils at 100°C.</em></li><li>Привычек и рутины: <em>I wake up at 7 am.</em></li><li>Расписаний: <em>The train leaves at 6 pm.</em></li></ul><p><strong>Формула:</strong></p><ul><li>I/You/We/They + V (глагол): <em>I work every day.</em></li><li>He/She/It + V + s/es: <em>She works every day.</em></li></ul><p><strong>Отрицание:</strong> do/does + not + V: <em>I do not (don't) like coffee. She does not (doesn't) smoke.</em></p><p><strong>Вопросы:</strong> Do/Does + подлежащее + V?: <em>Do you speak English? Does he live here?</em></p>`,
    tags: ["present simple", "present", "настоящее", "время", "simple"],
    order: 3,
  },
  {
    levelId: "A1", title: "Неопределённый артикль A/AN и определённый THE",
    content: `<p><strong>A/AN</strong> — неопределённый артикль (какой-то, один из многих):</p><ul><li>Используем <strong>a</strong> перед согласными звуками: <em>a cat, a university, a European</em></li><li>Используем <strong>an</strong> перед гласными звуками: <em>an apple, an hour, an honest person</em></li></ul><p><strong>The</strong> — определённый артикль (конкретный, тот самый):</p><ul><li>Когда говорим о чём-то конкретном: <em>The book on the table is mine.</em></li><li>С уникальными объектами: <em>the sun, the moon, the Earth</em></li><li>С превосходной степенью: <em>the best, the most beautiful</em></li></ul>`,
    tags: ["articles", "artikli", "a", "an", "the", "артикли"],
    order: 4,
  },
  {
    levelId: "A1", title: "Множественное число существительных",
    content: `<p><strong>Основные правила образования множественного числа:</strong></p><ul><li>➕ Добавляем <strong>-s</strong>: cat → cats, book → books</li><li>➕ После -s, -sh, -ch, -x, -o добавляем <strong>-es</strong>: box → boxes, bus → buses, tomato → tomatoes</li><li>➕ Согласная + y → <strong>-ies</strong>: baby → babies, city → cities</li><li>➕ -f/-fe → <strong>-ves</strong>: wolf → wolves, knife → knives</li></ul><p><strong>Исключения (нужно запомнить!):</strong></p><ul><li>child → children</li><li>man → men</li><li>woman → women</li><li>tooth → teeth</li><li>foot → feet</li><li>mouse → mice</li><li>sheep → sheep</li></ul>`,
    tags: ["plural", "mnozhestvennoe", "число", "существительные", "nouns"],
    order: 5,
  },
  {
    levelId: "A2", title: "Past Simple (Прошедшее простое время)",
    content: `<p><strong>Past Simple</strong> описывает завершённые действия в прошлом.</p><p><strong>Правильные глаголы:</strong> добавляем <strong>-ed</strong> (или -d, если глагол уже заканчивается на e):</p><ul><li>work → worked</li><li>live → lived</li><li>study → studied (y → i + ed)</li><li>stop → stopped (удвоение согласной)</li></ul><p><strong>Неправильные глаголы (Irregular Verbs):</strong> нужно запоминать! Вот самые важные:</p><ul><li>go → went</li><li>see → saw</li><li>eat → ate</li><li>drink → drank</li><li>buy → bought</li><li>take → took</li><li>have → had</li></ul><p><strong>Слова-маркеры:</strong> yesterday, last week/month/year, in 2020, two days ago, when I was a child.</p>`,
    tags: ["past simple", "past", "прошедшее", "время", "regular", "irregular", "verbs"],
    order: 6,
  },
  {
    levelId: "A2", title: "Предлоги места (Prepositions of Place)",
    content: `<p><strong>Основные предлоги места:</strong></p><ul><li><strong>In</strong> — в, внутри: <em>in the room, in the city, in the box</em></li><li><strong>On</strong> — на (на поверхности): <em>on the table, on the wall, on the floor</em></li><li><strong>At</strong> — у, в (точка/место): <em>at the door, at the bus stop, at work</em></li><li><strong>Under</strong> — под: <em>under the bed, under the chair</em></li><li><strong>Next to / Beside</strong> — рядом с: <em>next to the window</em></li><li><strong>Between</strong> — между: <em>between the two buildings</em></li><li><strong>Behind</strong> — позади: <em>behind the house</em></li><li><strong>In front of</strong> — перед: <em>in front of the school</em></li></ul>`,
    tags: ["prepositions", "predlogi", "place", "mesto", "in", "on", "at", "under"],
    order: 7,
  },
  {
    levelId: "A2", title: "Прилагательные и наречия (Adjectives & Adverbs)",
    content: `<p><strong>Прилагательные (Adjectives)</strong> описывают существительные: <em>a beautiful day, a tall man, an interesting book</em></p><p><strong>Наречия (Adverbs)</strong> описывают глаголы, прилагательные или другие наречия: <em>She sings beautifully. It is very hot. He runs extremely fast.</em></p><p><strong>Образование наречий:</strong> обычно добавляем <strong>-ly</strong> к прилагательному:</p><ul><li>quick → quickly</li><li>happy → happily (y → i + ly)</li><li>careful → carefully</li></ul><p><strong>Исключения:</strong></p><ul><li>good (хороший) → well (хорошо)</li><li>fast (быстрый/быстро) — не меняется</li><li>hard (трудный/усердно) — не меняется</li><li>early (ранний/рано) — не меняется</li></ul>`,
    tags: ["adjectives", "adverbs", "prilagatelnye", "narechiya", "прилагательные", "наречия"],
    order: 8,
  },
  {
    levelId: "B1", title: "Present Perfect (Настоящее совершенное время)",
    content: `<p><strong>Present Perfect</strong> связывает прошлое с настоящим.</p><p><strong>Формула:</strong> have/has + V3 (третья форма глагола)</p><p><strong>Употребление:</strong></p><ul><li><strong>Опыт:</strong> <em>I have visited London twice.</em> (Важен опыт, не время)</li><li><strong>Результат:</strong> <em>She has finished her project.</em> (Результат важен сейчас)</li><li><strong>Изменения:</strong> <em>You have grown so much!</em></li><li><strong>Продолжающиеся ситуации:</strong> <em>I have known him for 10 years.</em></li></ul><p><strong>Слова-маркеры:</strong> just, already, yet, ever, never, recently, lately, so far, this week/month/year, since, for.</p><p><strong>Разница Past Simple vs Present Perfect:</strong></p><ul><li>Past Simple: <em>I saw that movie yesterday.</em> (конкретное время в прошлом)</li><li>Present Perfect: <em>I have seen that movie.</em> (опыт, время не важно)</li></ul>`,
    tags: ["present perfect", "perfect", "совершенное", "время", "have", "has", "V3"],
    order: 9,
  },
  {
    levelId: "B1", title: "Модальные глаголы (Modal Verbs)",
    content: `<p>Модальные глаголы выражают возможность, необходимость, разрешение и т.д. После них глагол употребляется без частицы <strong>to</strong>.</p><p><strong>Основные модальные глаголы:</strong></p><ul><li><strong>Can</strong> — мочь, уметь: <em>I can swim. Can you help me?</em></li><li><strong>Must</strong> — должен (обязанность): <em>You must wear a seatbelt.</em></li><li><strong>Should</strong> — следует (рекомендация): <em>You should see a doctor.</em></li><li><strong>May</strong> — можно (разрешение): <em>May I come in?</em></li><li><strong>Might</strong> — возможно (вероятность): <em>It might rain later.</em></li><li><strong>Have to</strong> — вынужден (внешняя обязанность): <em>I have to work tomorrow.</em></li></ul><p><strong>Отрицание:</strong> must not (mustn't) — запрещено; should not (shouldn't) — не следует; cannot (can't) — не могу/не умею.</p>`,
    tags: ["modal verbs", "modals", "modalnye glagoly", "can", "must", "should", "may", "might"],
    order: 10,
  },
  {
    levelId: "B1", title: "Условные предложения Zero и First Conditional",
    content: `<p><strong>Zero Conditional</strong> (нулевой тип) — общие истины и факты:</p><p>If + Present Simple, ... Present Simple</p><p><em>If you heat ice, it melts.</em> (Если нагреть лёд, он тает.)</p><p><em>If it rains, the grass gets wet.</em></p><p><strong>First Conditional</strong> (первый тип) — реальное условие в будущем:</p><p>If + Present Simple, ... will + V (глагол)</p><p><em>If it rains, I will take an umbrella.</em> (Если пойдёт дождь, я возьму зонт.)</p><p><em>If you study hard, you will pass the exam.</em></p><p><strong>Важно:</strong> В части с IF никогда не используем will!</p>`,
    tags: ["conditionals", "conditional", "uslovnye", "if", "zero", "first", "предложения"],
    order: 11,
  },
  {
    levelId: "B2", title: "Passive Voice (Страдательный залог)",
    content: `<p><strong>Passive Voice</strong> используется, когда действие важнее, чем тот, кто его совершает.</p><p><strong>Формула:</strong> to be + V3 (причастие прошедшего времени)</p><p><strong>По временам:</strong></p><ul><li>Present Simple: <em>The book is read.</em> (am/is/are + V3)</li><li>Past Simple: <em>The book was read.</em> (was/were + V3)</li><li>Future Simple: <em>The book will be read.</em> (will be + V3)</li><li>Present Perfect: <em>The book has been read.</em> (have/has been + V3)</li></ul><p><strong>Активный vs Пассивный:</strong></p><ul><li>Active: <em>Shakespeare wrote Hamlet.</em></li><li>Passive: <em>Hamlet was written by Shakespeare.</em></li></ul><p>Используем <strong>by</strong>, чтобы указать исполнителя действия в пассивном залоге.</p>`,
    tags: ["passive voice", "passive", "stradatelnyi zalog", "страдательный", "залог"],
    order: 12,
  },
  {
    levelId: "B2", title: "Relative Clauses (Придаточные определительные)",
    content: `<p><strong>Relative clauses</strong> дают дополнительную информацию о существительном.</p><p><strong>Относительные местоимения:</strong></p><ul><li><strong>Who</strong> — для людей: <em>The woman who lives next door is a doctor.</em></li><li><strong>Which</strong> — для вещей и животных: <em>The book which I bought is fascinating.</em></li><li><strong>That</strong> — для людей и вещей (в определяющих придаточных): <em>The car that I want is expensive.</em></li><li><strong>Where</strong> — для мест: <em>The restaurant where we met is closed.</em></li><li><strong>When</strong> — для времени: <em>The year when I graduated was 2020.</em></li><li><strong>Whose</strong> — для принадлежности: <em>The man whose car was stolen called the police.</em></li></ul>`,
    tags: ["relative clauses", "pridatochnye", "who", "which", "that", "where", "when", "whose"],
    order: 13,
  },
  {
    levelId: "B2", title: "Reported Speech (Косвенная речь)",
    content: `<p><strong>Reported Speech</strong> передаёт чужие слова без прямого цитирования.</p><p><strong>Прямая речь → Косвенная речь:</strong></p><p>Времена сдвигаются на шаг назад (backshift):</p><ul><li>Present Simple → Past Simple: <em>"I am tired" → He said that he was tired.</em></li><li>Present Continuous → Past Continuous: <em>"I am working" → She said she was working.</em></li><li>Past Simple → Past Perfect: <em>"I saw him" → She said she had seen him.</em></li><li>Present Perfect → Past Perfect: <em>"I have finished" → He said he had finished.</em></li><li>Will → Would: <em>"I will come" → He said he would come.</em></li><li>Can → Could: <em>"I can help" → She said she could help.</em></li></ul><p><strong>Вопросы в косвенной речи:</strong> используем прямой порядок слов: <em>"Where do you live?" → He asked where I lived.</em></p>`,
    tags: ["reported speech", "indirect speech", "kosvennaya rech", "косвенная", "речь"],
    order: 14,
  },
  {
    levelId: "C1", title: "Second и Third Conditionals",
    content: `<p><strong>Second Conditional</strong> (второй тип) — нереальное или маловероятное условие в настоящем/будущем:</p><p>If + Past Simple, ... would + V</p><p><em>If I had enough money, I would travel around the world.</em> (Если бы у меня было достаточно денег, я бы путешествовал по миру.)</p><p><em>If I were you, I would accept the offer.</em> (На твоём месте я бы принял предложение.)</p><p>Обрати внимание: <strong>were</strong> используется для всех лиц (I were, he were).</p><p><strong>Third Conditional</strong> (третий тип) — нереальное условие в прошлом (сожаление):</p><p>If + Past Perfect, ... would have + V3</p><p><em>If I had studied harder, I would have passed the exam.</em> (Если бы я учился усерднее, я бы сдал экзамен.)</p><p><em>If we had left earlier, we would have caught the train.</em></p>`,
    tags: ["conditionals", "second", "third", "mixed", "would", "had"],
    order: 15,
  },
  {
    levelId: "C1", title: "Subjunctive Mood (Сослагательное наклонение)",
    content: `<p><strong>Subjunctive Mood</strong> используется для выражения нереальных ситуаций, желаний, сомнений.</p><p><strong>Конструкции с WISH:</strong></p><ul><li>О настоящем: <em>I wish I were</em> (не was!) <em>rich.</em> — Жаль, что я не богат.</li><li>О прошлом: <em>I wish I had studied harder.</em> — Жаль, что я не учился лучше.</li><li>С would: <em>I wish you would stop smoking.</em> — Хотелось бы, чтобы ты бросил курить.</li></ul><p><strong>Конструкции с AS IF / AS THOUGH:</strong></p><p><em>He acts as if he owned the place.</em> — Он ведёт себя так, как будто это место его.</p><p><strong>После IT'S TIME:</strong></p><p><em>It's time we left.</em> — Нам пора уходить.</p><p><strong>После WOULD RATHER:</strong></p><p><em>I would rather you didn't go.</em> — Я бы предпочёл, чтобы ты не ходил(а).</p>`,
    tags: ["subjunctive", "soslovlagatelnoe", "wish", "as if", "would rather"],
    order: 16,
  },
  {
    levelId: "C1", title: "Inversion (Инверсия)",
    content: `<p><strong>Inversion</strong> — обратный порядок слов, используется для эмфазы (выразительности).</p><p><strong>После отрицательных наречий и выражений:</strong></p><ul><li><em>Never have I seen such a beautiful sunset.</em> (Никогда я не видел такого красивого заката.)</li><li><em>Rarely does she arrive on time.</em> (Редко она приходит вовремя.)</li><li><em>Hardly had we left when it started raining.</em> (Едва мы ушли, как пошёл дождь.)</li><li><em>Not only did he finish the project, but he also exceeded expectations.</em></li></ul><p><strong>В условных предложениях (без IF):</strong></p><ul><li><em>Had I known, I would have come.</em> (If I had known...)</li><li><em>Were I you, I would say no.</em> (If I were you...)</li><li><em>Should you need anything, call me.</em> (If you should need anything...)</li></ul>`,
    tags: ["inversion", "inversiya", "порядок", "слов", "never", "rarely", "hardly"],
    order: 17,
  },
  {
    levelId: "C2", title: "Advanced Phrasal Verbs (Фразовые глаголы продвинутого уровня)",
    content: `<p>Фразовые глаголы — глаголы с предлогами, значение которых часто отличается от исходного.</p><p><strong>Топ-10 продвинутых фразовых глаголов:</strong></p><ul><li><strong>To bring up</strong> — воспитывать / поднимать тему: <em>She brought up three children alone. He brought up an important issue.</em></li><li><strong>To put up with</strong> — мириться, терпеть: <em>I can't put up with this noise anymore.</em></li><li><strong>To look down on</strong> — смотреть свысока: <em>He looks down on people who haven't studied.</em></li><li><strong>To run out of</strong> — закончиться (о запасах): <em>We've run out of milk.</em></li><li><strong>To get away with</strong> — избежать наказания: <em>He got away with cheating on the test.</em></li><li><strong>To come up with</strong> — придумать: <em>She came up with a brilliant idea.</em></li><li><strong>To look up to</strong> — уважать, восхищаться: <em>I've always looked up to my grandfather.</em></li><li><strong>To cut down on</strong> — сократить потребление: <em>I need to cut down on sugar.</em></li><li><strong>To put off</strong> — откладывать: <em>Don't put off your homework until tomorrow.</em></li><li><strong>To turn down</strong> — отвергнуть / убавить: <em>She turned down the job offer.</em></li></ul>`,
    tags: ["phrasal verbs", "frazovye glagoly", "advanced", "фразовые", "глаголы"],
    order: 18,
  },
  {
    levelId: "C2", title: "Ellipsis and Substitution (Эллипсис и замена)",
    content: `<p><strong>Ellipsis</strong> — опускание слов, которые понятны из контекста. Делает речь более естественной.</p><p><strong>Примеры эллипсиса:</strong></p><ul><li><em>'Are you coming?' 'I might.'</em> (вместо I might be coming)</li><li><em>'She speaks French.' 'And very well too.'</em> (вместо And she speaks it very well too)</li><li><em>He arrived early and [he] left late.</em></li></ul><p><strong>Substitution</strong> — замена слов для избегания повторов:</p><ul><li><strong>Do/does/did</strong> заменяют глаголы: <em>She sings better than he does.</em></li><li><strong>So/not</strong> заменяют целые предложения: <em>'Is it true?' 'I think so.' / 'I think not.'</em></li><li><strong>One/ones</strong> заменяют существительные: <em>I need a pen. Do you have one? These shoes are nice but I prefer the black ones.</em></li></ul>`,
    tags: ["ellipsis", "substitution", "ellipsis", "zamena", "замена", "эллипсис"],
    order: 19,
  },
  {
    levelId: "C2", title: "Academic Writing и Formal Register",
    content: `<p><strong>Академическое письмо</strong> требует формального стиля, точности и логической структуры.</p><p><strong>Ключевые особенности:</strong></p><ul><li><strong>Пассивный залог</strong> чаще, чем в разговорной речи: <em>It can be argued that...</em></li><li><strong>Сложные союзы:</strong> furthermore, moreover, nevertheless, consequently, therefore, in contrast, in addition, as a result</li><li><strong>Избегай сокращений:</strong> do not вместо don't, cannot вместо can't</li><li><strong>Избегай фразовых глаголов:</strong> investigate вместо look into, tolerate вместо put up with</li></ul><p><strong>Структура эссе:</strong></p><ul><li>Introduction — введение с тезисом (thesis statement)</li><li>Body paragraphs — основные абзацы с аргументами и примерами</li><li>Conclusion — заключение с обобщением</li></ul><p><strong>Полезные фразы:</strong> This essay aims to... It is widely believed that... On the one hand... On the other hand... In conclusion, it is evident that...</p>`,
    tags: ["academic", "writing", "formal", "register", "academicheskoye", "pismo"],
    order: 20,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.activityLog.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.userError.deleteMany();
  await prisma.word.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.grammarArticle.deleteMany();
  await prisma.question.deleteMany();
  await prisma.level.deleteMany();
  await prisma.statistics.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  for (const lvl of LEVELS) {
    await prisma.level.create({
      data: {
        levelId: lvl.id,
        name: lvl.name,
        city: lvl.city,
        order: lvl.order,
        strictness: lvl.strictness,
        color: lvl.color,
      },
    });
  }
  console.log("✅ Created 7 levels");

  let totalQuestions = 0;
  for (const lvl of LEVELS) {
    const questions = generateLevelQuestions(lvl.id);
    await prisma.question.createMany({ data: questions });
    totalQuestions += questions.length;
    console.log(`  ➜ ${lvl.id}: ${questions.length} questions`);
  }
  console.log(`✅ Created ${totalQuestions} questions`);

  for (let i = 0; i < GRAMMAR_ARTICLES.length; i++) {
    const g = GRAMMAR_ARTICLES[i];
    await prisma.grammarArticle.create({
      data: {
        levelId: g.levelId,
        title: g.title,
        content: g.content,
        searchTags: g.tags,
        order: g.order,
      },
    });
  }
  console.log(`✅ Created ${GRAMMAR_ARTICLES.length} grammar articles`);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@englishplatform.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@englishplatform.com",
      emailVerified: new Date(),
      image: "/avatars/admin.png",
    },
  });

  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      name: "Admin",
      bio: "Platform administrator with full access to all features",
      timezone: "UTC",
    },
  });

  await prisma.userProgress.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      currentLevelId: "C2",
      totalCompleted: 700,
      correctAnswers: 700,
      learnedWords: 300,
    },
  });

  await prisma.settings.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      theme: "dark",
      soundEnabled: true,
      voiceEnabled: true,
      showHints: true,
    },
  });

  await prisma.statistics.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      totalSessions: 50,
      totalTime: 36000,
      totalCorrect: 700,
      totalWrong: 0,
      totalSkipped: 0,
      longestStreak: 30,
    },
  });

  await prisma.streak.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      current: 30,
      longest: 30,
      lastDate: new Date(),
    },
  });

  for (const lvl of LEVELS) {
    await prisma.achievement.create({
      data: {
        userId: adminUser.id,
        levelId: lvl.id,
        city: lvl.city,
        unlocked: true,
        unlockedAt: new Date(),
      },
    });
  }
  console.log("✅ Created admin user with full data");

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
