const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface CheckResult {
  correct: boolean;
  accuracy: number;
  mistakes: string[];
  correctAnswer: string;
  explanation: string;
}

function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function checkAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  acceptableAnswers: string[],
  strictness: "soft" | "medium" | "strict"
): Promise<CheckResult> {
  const allAcceptable = [correctAnswer, ...acceptableAnswers];

  // Quick local check for simple cases
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedAcceptable = allAcceptable.map(normalizeAnswer);

  // For soft mode, be very lenient
  if (strictness === "soft") {
    const match = normalizedAcceptable.some((acc) => {
      const userWords = normalizedUser.split(" ");
      const accWords = acc.split(" ");
      const matchingWords = userWords.filter((w) => accWords.includes(w));
      return matchingWords.length >= Math.min(accWords.length, userWords.length) * 0.5;
    });
    if (match) {
      return {
        correct: true,
        accuracy: 100,
        mistakes: [],
        correctAnswer,
        explanation: "Верно! Отличная работа.",
      };
    }
  }

  // Medium mode - check if answer contains key words
  if (strictness === "medium") {
    const match = normalizedAcceptable.some((acc) => {
      const userWords = normalizedUser.split(" ");
      const accWords = acc.split(" ");
      const matchingWords = userWords.filter((w) => accWords.includes(w));
      return matchingWords.length >= accWords.length * 0.7;
    });
    if (match) {
      return {
        correct: true,
        accuracy: 100,
        mistakes: [],
        correctAnswer,
        explanation: "Правильно!",
      };
    }
  }

  // Strict mode - exact match
  if (strictness === "strict") {
    if (normalizedAcceptable.includes(normalizedUser)) {
      return {
        correct: true,
        accuracy: 100,
        mistakes: [],
        correctAnswer,
        explanation: "Perfect! Точный ответ.",
      };
    }
  }

  // AI check
  try {
    return await checkWithDeepSeek(question, userAnswer, correctAnswer, acceptableAnswers, strictness);
  } catch {
    try {
      return await checkWithGPT(question, userAnswer, correctAnswer, acceptableAnswers, strictness);
    } catch {
      // Fallback: local fuzzy matching
      return fallbackCheck(userAnswer, correctAnswer, acceptableAnswers, strictness);
    }
  }
}

async function checkWithDeepSeek(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  acceptableAnswers: string[],
  strictness: string
): Promise<CheckResult> {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an English language teacher checking a student's answer.
Strictness level: ${strictness} (soft=very lenient, medium=moderate, strict=exact).
The student is learning English. Be encouraging but accurate.

Return JSON:
{
  "correct": boolean,
  "accuracy": number (0-100),
  "mistakes": ["list of errors found"],
  "explanation": "brief explanation in Russian"
}`,
        },
        {
          role: "user",
          content: `Question: "${question}"
Correct answer: "${correctAnswer}"
Acceptable answers: ${acceptableAnswers.join(", ")}
Student's answer: "${userAnswer}"

Evaluate this answer. Return JSON.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function checkWithGPT(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  acceptableAnswers: string[],
  strictness: string
): Promise<CheckResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Evaluate English answer. Strictness: ${strictness}. Return JSON: {correct, accuracy, mistakes[], explanation}`,
        },
        {
          role: "user",
          content: `Q: "${question}" Correct: "${correctAnswer}" Acceptable: ${acceptableAnswers.join(", ")} Answer: "${userAnswer}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

function fallbackCheck(
  userAnswer: string,
  correctAnswer: string,
  acceptableAnswers: string[],
  strictness: string
): CheckResult {
  const allAcceptable = [correctAnswer, ...acceptableAnswers];
  const normalizedUser = normalizeAnswer(userAnswer);
  
  const exactMatch = allAcceptable.some(
    (a) => normalizeAnswer(a) === normalizedUser
  );
  
  if (exactMatch) {
    return {
      correct: true,
      accuracy: 100,
      mistakes: [],
      correctAnswer,
      explanation: "Верно!",
    };
  }

  // Calculate word overlap
  const userWords = new Set(normalizedUser.split(" "));
  let bestOverlap = 0;
  let bestMatch = "";

  for (const acceptable of allAcceptable) {
    const accWords = new Set(normalizeAnswer(acceptable).split(" "));
    const overlap = [...userWords].filter((w) => accWords.has(w)).length;
    const ratio = overlap / Math.max(accWords.size, userWords.size);
    if (ratio > bestOverlap) {
      bestOverlap = ratio;
      bestMatch = acceptable;
    }
  }

  const accuracy = Math.round(bestOverlap * 100);
  const threshold = strictness === "soft" ? 30 : strictness === "medium" ? 60 : 85;

  return {
    correct: accuracy >= threshold,
    accuracy,
    mistakes: accuracy < threshold ? ["Ответ неполный"] : [],
    correctAnswer,
    explanation: accuracy >= threshold
      ? "Принимается! Старайтесь давать полные ответы."
      : `Правильный ответ: ${correctAnswer}. Обратите внимание на формулировку.`,
  };
}
