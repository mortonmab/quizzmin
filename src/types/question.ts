export type Difficulty = "basic" | "intermediate" | "advanced";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: Difficulty;
  options: QuestionOption[];
  imageUrl?: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuestionFilters {
  difficulty?: Difficulty;
  category?: string;
  searchTerm?: string;
}

export interface QuestionStats {
  totalQuestions: number;
  byDifficulty: Record<Difficulty, number>;
  byCategory: Record<string, number>;
}
