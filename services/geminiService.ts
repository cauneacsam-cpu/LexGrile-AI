import { GoogleGenAI, Type } from "@google/genai";
import { QuizConfig, Question, QuestionType, CorrectAnswersMode } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuiz = async (config: QuizConfig): Promise<Question[]> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const correctLogicPrompt = config.correctMode === CorrectAnswersMode.SINGLE 
    ? "Fiecare întrebare trebuie să aibă EXACT O SINGURĂ variantă corectă din cele 3."
    : config.correctMode === CorrectAnswersMode.ONE_OR_TWO
    ? "Fiecare întrebare trebuie să aibă FIE UNA, FIE DOUĂ variante corecte din cele 3 (NICIODATĂ toate 3 și NICIODATĂ niciuna)."
    : "Fiecare întrebare poate avea UNA, DOUĂ sau TOATE CELE TREI variante corecte.";

  const prompt = `
    Acționează ca un profesor de drept din România pentru examenele de Barou/INM.
    Generează ${config.count} grile din: ${config.codes.join(', ')}.
    Tematică: "${config.topic}". Dificultate: ${config.difficulty}. Tip: ${config.questionType}.

    REGULI DE AUR:
    1. EXACT 3 VARIANTE: Fiecare grilă trebuie să aibă exact 3 opțiuni (A, B, C).
    2. LOGICĂ RĂSPUNSURI: ${correctLogicPrompt}
    3. STIL: Folosește limbajul din noile Coduri. Dacă ai ales "Speță", creează un scenariu juridic riguros.
    4. EXPLICAȚIE: Obligatoriu citează articolul din lege și explică raționamentul pentru fiecare variantă.

    Returnează JSON valid.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exact 3 variante de răspuns."
              },
              correctIndices: { 
                type: Type.ARRAY, 
                items: { type: Type.INTEGER },
                description: "Indicii variantelor corecte (0, 1 sau 2)."
              },
              explanation: { type: Type.STRING },
            },
            required: ["text", "options", "correctIndices", "explanation"],
          },
        },
      },
    });

    const rawData = JSON.parse(response.text || '[]');
    return rawData.map((q: any, index: number) => ({
      id: index + 1,
      text: q.text,
      options: q.options.slice(0, 3), // Forțăm 3 variante
      correctIndices: q.correctIndices,
      explanation: q.explanation
    }));
  } catch (error) {
    throw new Error("Eroare la generare. Încearcă un număr mai mic de grile.");
  }
};