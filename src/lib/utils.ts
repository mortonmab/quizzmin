import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question, Difficulty, QuestionFilters } from "@/types/question";
import { getQuestions } from "./database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to select random questions based on criteria
export function selectRandomQuestions({
  count = 10,
  difficulty,
  category,
  excludeIds = [],
}: {
  count: number;
  difficulty?: Difficulty;
  category?: string;
  excludeIds?: string[];
}): Question[] {
  const filters: QuestionFilters = {};

  if (difficulty) filters.difficulty = difficulty;
  if (category) filters.category = category;

  // Get all questions matching the filters
  const availableQuestions = getQuestions(filters).filter(
    (q) => !excludeIds.includes(q.id),
  );

  // If we don't have enough questions, return all available
  if (availableQuestions.length <= count) {
    return availableQuestions;
  }

  // Randomly select questions
  const selectedQuestions: Question[] = [];
  const tempQuestions = [...availableQuestions];

  for (let i = 0; i < count && tempQuestions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * tempQuestions.length);
    selectedQuestions.push(tempQuestions[randomIndex]);
    tempQuestions.splice(randomIndex, 1);
  }

  return selectedQuestions;
}

// Function to evaluate an answer
export function evaluateAnswer(
  questionId: string,
  answerId: string,
): {
  correct: boolean;
  correctAnswerId?: string;
  points: number;
} {
  const question = getQuestions().find((q) => q.id === questionId);

  if (!question) {
    return { correct: false, points: 0 };
  }

  const selectedOption = question.options.find((opt) => opt.id === answerId);
  const correctOption = question.options.find((opt) => opt.isCorrect);

  if (!selectedOption || !correctOption) {
    return { correct: false, correctAnswerId: correctOption?.id, points: 0 };
  }

  return {
    correct: selectedOption.isCorrect,
    correctAnswerId: correctOption.id,
    points: selectedOption.isCorrect ? question.points || 10 : 0,
  };
}

// Function to parse CSV data for question import
export function parseQuestionsCsv(csvText: string): Partial<Question>[] {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  const headers = lines[0].split(",").map((h) => h.trim());

  const questions: Partial<Question>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length < headers.length) continue;

    const questionData: Record<string, any> = {};
    headers.forEach((header, index) => {
      questionData[header] = values[index];
    });

    // Parse options from CSV format
    // Assuming format: option1:true,option2:false,option3:false,option4:false
    const optionsStr = questionData.options || "";
    const options = optionsStr.split(";").map((opt, idx) => {
      const [text, isCorrectStr] = opt.split(":");
      return {
        id: String.fromCharCode(97 + idx), // a, b, c, d...
        text: text.trim(),
        isCorrect: isCorrectStr.trim() === "true",
      };
    });

    questions.push({
      text: questionData.text,
      category: questionData.category,
      difficulty: questionData.difficulty as Difficulty,
      options,
      points: parseInt(questionData.points) || 10,
      imageUrl: questionData.imageUrl,
    });
  }

  return questions;
}

// Function to validate video file
export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const validTypes = ["video/mp4", "video/avi", "video/quicktime"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file format. Supported formats: MP4, AVI, MOV",
    };
  }

  // Check file size (100MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds the maximum limit of 100MB",
    };
  }

  return { valid: true };
}

// Function to extract video ID from YouTube/Vimeo URLs
export function extractVideoId(url: string): {
  platform: "youtube" | "vimeo" | null;
  id: string | null;
} {
  // YouTube regex patterns
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[1]) {
    return { platform: "youtube", id: youtubeMatch[1] };
  }

  // Vimeo regex patterns
  const vimeoRegex =
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)(?:$|\/|\?))/i;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    return { platform: "vimeo", id: vimeoMatch[1] };
  }

  return { platform: null, id: null };
}
