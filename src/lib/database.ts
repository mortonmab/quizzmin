import {
  Question,
  Difficulty,
  QuestionFilters,
  QuestionStats,
} from "@/types/question";
import { Video, VideoFilters } from "@/types/video";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtB5KV4NTEeJ3zrzop-8tMSOhOXsWOG1U",
  authDomain: "mmczquiz.firebaseapp.com",
  projectId: "mmczquiz",
  storageBucket: "mmczquiz.firebasestorage.app",
  messagingSenderId: "548031113154",
  appId: "1:548031113154:web:542b9385dfac03d5b0185b",
  measurementId: "G-23X0C7X571",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
const questionsCollection = collection(db, "questions");
const videosCollection = collection(db, "videos");

// Seed data for initial setup (will only be used if collections are empty)
const seedQuestions = [
  {
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

const seedVideos = [
  {
    title: "Introduction to Minerals",
    description: "A brief introduction to the world of minerals",
    url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    type: "file",
    duration: 120, // 2 minutes
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Helper function to convert Firestore document to Question type
const convertDocToQuestion = (doc: DocumentData): Question => {
  const data = doc.data();
  return {
    id: doc.id,
    text: data.text,
    category: data.category,
    difficulty: data.difficulty as Difficulty,
    options: data.options,
    points: data.points,
    imageUrl: data.imageUrl,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
};

// Helper function to convert Firestore document to Video type
const convertDocToVideo = (doc: DocumentData): Video => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl,
    type: data.type,
    duration: data.duration,
    fileSize: data.fileSize,
    isActive: data.isActive,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
};

// Initialize collections with seed data if empty
const initializeCollections = async () => {
  try {
    // Check if questions collection is empty
    const questionsSnapshot = await getDocs(questionsCollection);
    if (questionsSnapshot.empty) {
      // Add seed questions
      for (const question of seedQuestions) {
        await addDoc(questionsCollection, question);
      }
      console.log("Initialized questions collection with seed data");
    }

    // Check if videos collection is empty
    const videosSnapshot = await getDocs(videosCollection);
    if (videosSnapshot.empty) {
      // Add seed videos
      for (const video of seedVideos) {
        await addDoc(videosCollection, video);
      }
      console.log("Initialized videos collection with seed data");
    }
  } catch (error) {
    console.error("Error initializing collections:", error);
  }
};

// Initialize collections on module load
initializeCollections();

// Question CRUD operations
export const getQuestions = async (
  filters?: QuestionFilters,
): Promise<Question[]> => {
  try {
    let q = query(questionsCollection, orderBy("createdAt", "desc"));

    // Apply filters if provided
    if (filters) {
      if (filters.difficulty) {
        q = query(q, where("difficulty", "==", filters.difficulty));
      }

      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }
    }

    const querySnapshot = await getDocs(q);
    let questions = querySnapshot.docs.map(convertDocToQuestion);

    // Apply search term filter client-side (Firestore doesn't support text search directly)
    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      questions = questions.filter(
        (q) =>
          q.text.toLowerCase().includes(searchTerm) ||
          q.category.toLowerCase().includes(searchTerm) ||
          q.options.some((opt) => opt.text.toLowerCase().includes(searchTerm)),
      );
    }

    return questions;
  } catch (error) {
    console.error("Error getting questions:", error);
    return [];
  }
};

export const getQuestionById = async (
  id: string,
): Promise<Question | undefined> => {
  try {
    const docRef = doc(questionsCollection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Question;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error getting question:", error);
    return undefined;
  }
};

export const createQuestion = async (
  question: Omit<Question, "id">,
): Promise<Question> => {
  try {
    const newQuestion = {
      ...question,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(questionsCollection, newQuestion);

    return {
      id: docRef.id,
      ...question,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Failed to create question");
  }
};

export const updateQuestion = async (
  id: string,
  updates: Partial<Question>,
): Promise<Question | undefined> => {
  try {
    const docRef = doc(questionsCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return undefined;
    }

    const updatedData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updatedData);

    // Get the updated document
    const updatedDocSnap = await getDoc(docRef);
    return {
      id: updatedDocSnap.id,
      ...updatedDocSnap.data(),
    } as Question;
  } catch (error) {
    console.error("Error updating question:", error);
    return undefined;
  }
};

export const deleteQuestion = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(questionsCollection, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};

export const getQuestionStats = async (): Promise<QuestionStats> => {
  try {
    const querySnapshot = await getDocs(questionsCollection);
    const questions = querySnapshot.docs.map(convertDocToQuestion);

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
  } catch (error) {
    console.error("Error getting question stats:", error);
    return {
      totalQuestions: 0,
      byDifficulty: { basic: 0, intermediate: 0, advanced: 0 },
      byCategory: {},
    };
  }
};

// Video CRUD operations
export const getVideos = async (filters?: VideoFilters): Promise<Video[]> => {
  try {
    let q = query(videosCollection, orderBy("createdAt", "desc"));

    // Apply filters if provided
    if (filters) {
      if (filters.type) {
        q = query(q, where("type", "==", filters.type));
      }

      if (filters.isActive !== undefined) {
        q = query(q, where("isActive", "==", filters.isActive));
      }
    }

    const querySnapshot = await getDocs(q);
    let videos = querySnapshot.docs.map(convertDocToVideo);

    // Apply search term filter client-side
    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchTerm) ||
          (v.description && v.description.toLowerCase().includes(searchTerm)),
      );
    }

    return videos;
  } catch (error) {
    console.error("Error getting videos:", error);
    return [];
  }
};

export const getVideoById = async (id: string): Promise<Video | undefined> => {
  try {
    const docRef = doc(videosCollection, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Video;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error getting video:", error);
    return undefined;
  }
};

export const createVideo = async (video: Omit<Video, "id">): Promise<Video> => {
  try {
    const newVideo = {
      ...video,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(videosCollection, newVideo);

    return {
      id: docRef.id,
      ...video,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("Failed to create video");
  }
};

export const updateVideo = async (
  id: string,
  updates: Partial<Video>,
): Promise<Video | undefined> => {
  try {
    const docRef = doc(videosCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return undefined;
    }

    const updatedData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updatedData);

    // Get the updated document
    const updatedDocSnap = await getDoc(docRef);
    return {
      id: updatedDocSnap.id,
      ...updatedDocSnap.data(),
    } as Video;
  } catch (error) {
    console.error("Error updating video:", error);
    return undefined;
  }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(videosCollection, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    return false;
  }
};
