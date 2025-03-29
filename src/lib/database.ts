import {
  Question,
  Difficulty,
  QuestionFilters,
  QuestionStats,
} from "@/types/question";
import { Video, VideoFilters } from "@/types/video";

// Mock database for questions
let questions: Question[] = [
  {
    id: "q1",
    text: "What is the most common mineral in the Earth's crust?",
    category: "Geology Basics",
    difficulty: "basic",
    options: [
      { id: "a", text: "Quartz", isCorrect: false },
      { id: "b", text: "Feldspar", isCorrect: true },
      { id: "c", text: "Mica", isCorrect: false },
      { id: "d", text: "Calcite", isCorrect: false },
    ],
    points: 10,
  },
  {
    id: "q2",
    text: "Which mineral has a hardness of 10 on the Mohs scale?",
    category: "Mineral Properties",
    difficulty: "basic",
    options: [
      { id: "a", text: "Talc", isCorrect: false },
      { id: "b", text: "Corundum", isCorrect: false },
      { id: "c", text: "Diamond", isCorrect: true },
      { id: "d", text: "Topaz", isCorrect: false },
    ],
    points: 10,
  },
];

// Mock database for videos
let videos: Video[] = [
  {
    id: "v1",
    title: "Introduction to Minerals",
    description: "A brief introduction to the world of minerals",
    url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    type: "file",
    duration: 120, // 2 minutes
    isActive: true,
  },
];

// Question CRUD operations
export const getQuestions = (filters?: QuestionFilters): Question[] => {
  let filteredQuestions = [...questions];

  if (filters) {
    if (filters.difficulty) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.difficulty === filters.difficulty,
      );
    }

    if (filters.category) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.category === filters.category,
      );
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredQuestions = filteredQuestions.filter(
        (q) =>
          q.text.toLowerCase().includes(searchTerm) ||
          q.category.toLowerCase().includes(searchTerm) ||
          q.options.some((opt) => opt.text.toLowerCase().includes(searchTerm)),
      );
    }
  }

  return filteredQuestions;
};

export const getQuestionById = (id: string): Question | undefined => {
  return questions.find((q) => q.id === id);
};

export const createQuestion = (question: Omit<Question, "id">): Question => {
  const newQuestion = {
    ...question,
    id: `q${questions.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  questions.push(newQuestion);
  return newQuestion;
};

export const updateQuestion = (
  id: string,
  updates: Partial<Question>,
): Question | undefined => {
  const index = questions.findIndex((q) => q.id === id);

  if (index === -1) return undefined;

  const updatedQuestion = {
    ...questions[index],
    ...updates,
    updatedAt: new Date(),
  };

  questions[index] = updatedQuestion;
  return updatedQuestion;
};

export const deleteQuestion = (id: string): boolean => {
  const initialLength = questions.length;
  questions = questions.filter((q) => q.id !== id);
  return questions.length < initialLength;
};

export const getQuestionStats = (): QuestionStats => {
  const stats: QuestionStats = {
    totalQuestions: questions.length,
    byDifficulty: {
      basic: 0,
      intermediate: 0,
      advanced: 0,
    },
    byCategory: {},
  };

  questions.forEach((q) => {
    // Count by difficulty
    stats.byDifficulty[q.difficulty]++;

    // Count by category
    if (!stats.byCategory[q.category]) {
      stats.byCategory[q.category] = 0;
    }
    stats.byCategory[q.category]++;
  });

  return stats;
};

// Video CRUD operations
export const getVideos = (filters?: VideoFilters): Video[] => {
  let filteredVideos = [...videos];

  if (filters) {
    if (filters.type) {
      filteredVideos = filteredVideos.filter((v) => v.type === filters.type);
    }

    if (filters.isActive !== undefined) {
      filteredVideos = filteredVideos.filter(
        (v) => v.isActive === filters.isActive,
      );
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredVideos = filteredVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchTerm) ||
          (v.description && v.description.toLowerCase().includes(searchTerm)),
      );
    }
  }

  return filteredVideos;
};

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((v) => v.id === id);
};

export const createVideo = (video: Omit<Video, "id">): Video => {
  const newVideo = {
    ...video,
    id: `v${videos.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  videos.push(newVideo);
  return newVideo;
};

export const updateVideo = (
  id: string,
  updates: Partial<Video>,
): Video | undefined => {
  const index = videos.findIndex((v) => v.id === id);

  if (index === -1) return undefined;

  const updatedVideo = {
    ...videos[index],
    ...updates,
    updatedAt: new Date(),
  };

  videos[index] = updatedVideo;
  return updatedVideo;
};

export const deleteVideo = (id: string): boolean => {
  const initialLength = videos.length;
  videos = videos.filter((v) => v.id !== id);
  return videos.length < initialLength;
};
