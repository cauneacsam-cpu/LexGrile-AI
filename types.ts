export enum LegalCode {
  CIVIL = 'Codul Civil',
  PROC_CIVILA = 'Codul de Procedură Civilă',
  PENAL = 'Codul Penal',
  PROC_PENALA = 'Codul de Procedură Penală'
}

export enum Difficulty {
  EASY = 'Ușor (Concepte de bază)',
  MEDIUM = 'Mediu (Spețe simple)',
  HARD = 'Dificil (Stil INM/Barou - Spețe complexe)'
}

export enum QuestionType {
  THEORY = 'Teoretic',
  CASE_STUDY = 'Speță (Caz practic)',
  MIXED = 'Mixt'
}

export enum CorrectAnswersMode {
  SINGLE = 'O singură variantă corectă',
  ONE_OR_TWO = 'Una sau două variante corecte',
  ANY = 'Oricâte pot fi corecte (1, 2 sau 3)'
}

export interface QuizConfig {
  codes: LegalCode[];
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionType;
  count: number;
  correctMode: CorrectAnswersMode;
}

export interface Question {
  id: number;
  text: string;
  options: string[]; 
  correctIndices: number[]; 
  explanation: string;
}

export interface QuizResult {
  questionId: number;
  selectedIndices: number[];
  isCorrect: boolean;
}

export type ViewState = 'SETUP' | 'LOADING' | 'QUIZ' | 'RESULTS';