export type Difficulty = "easy" | "medium" | "hard";

export type CharacterId = "rat" | "fox" | "cthulhu";

export type AnswerType = "sim" | "nao" | "talvez";

export interface Character {
  id: CharacterId;
  difficulty: Difficulty;
  emoji: string;
  name: string;
  species: string;
  tagline: string;
  greeting: string;
  thinking: string[];
  answers: {
    sim: string[];
    nao: string[];
    talvez: string[];
  };
  victory: string[];
  defeat: string[];
  giveUp: string[];
  theme: CharacterTheme;
}

export interface CharacterTheme {
  bg: string;
  bgGradient: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  accentBorder: string;
  cardBg: string;
  bubble: string;
  bubbleText: string;
  input: string;
  inputBorder: string;
  primaryBtn: string;
  primaryBtnHover: string;
  secondaryBtn: string;
  secondaryBtnHover: string;
  glow: string;
  ring: string;
  text: string;
  textMuted: string;
  badge: string;
}

export interface WordEntry {
  word: string;
  attrs: Record<string, string | string[]>;
}

export interface QuestionLog {
  id: number;
  question: string;
  answer: AnswerType;
  ts: number;
}

export interface GuessResult {
  correct: boolean;
  distance: number;
}
