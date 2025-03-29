import React, { useState, useEffect } from "react";
import QuizHeader from "./QuizHeader";
import QuestionDisplay from "./QuestionDisplay";
import AnswerOptions from "./AnswerOptions";
import ProgressBar from "./ProgressBar";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  imageUrl?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizInterfaceProps {
  currentRound?: number;
  questions?: Question[];
  initialScore?: number;
  initialTimeRemaining?: number;
  onComplete?: (score: number) => void;
  onNextRound?: (score: number) => void;
}

const QuizInterface = ({
  currentRound = 1,
  questions = [
    {
      id: "q1",
      text: "What is the most common mineral in the Earth's crust?",
      category: "Geology Basics",
      difficulty: "basic",
      options: [
        { id: "a", text: "Quartz", isCorrect: true },
        { id: "b", text: "Feldspar", isCorrect: false },
        { id: "c", text: "Mica", isCorrect: false },
        { id: "d", text: "Calcite", isCorrect: false },
      ],
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
    },
    {
      id: "q3",
      text: "What type of rock is formed from cooled magma?",
      category: "Rock Formation",
      difficulty: "basic",
      imageUrl:
        "https://images.unsplash.com/photo-1621886292650-520f76c747d6?w=800&q=80",
      options: [
        { id: "a", text: "Sedimentary", isCorrect: false },
        { id: "b", text: "Metamorphic", isCorrect: false },
        { id: "c", text: "Igneous", isCorrect: true },
        { id: "d", text: "Limestone", isCorrect: false },
      ],
    },
  ],
  initialScore = 0,
  initialTimeRemaining = 50,
  onComplete = () => {},
  onNextRound = () => {},
}: QuizInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(initialScore);
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const roundIndicator = `${currentRound}/3`;
  const questionCounter = `${currentQuestionIndex + 1}/${totalQuestions}`;

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;

    if (isTimerActive && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !showFeedback) {
      // Time's up, show feedback
      handleTimeUp();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, isTimerActive, showFeedback]);

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setShowFeedback(true);

    // Auto-advance after showing feedback
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleAnswerSelected = (optionId: string, isCorrect: boolean) => {
    setSelectedAnswerId(optionId);
    setIsTimerActive(false);
    setShowFeedback(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after showing feedback
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeRemaining(initialTimeRemaining);
        setSelectedAnswerId(null);
        setShowFeedback(false);
        setIsTimerActive(true);
        setIsTransitioning(false);
      }, 500);
    } else {
      // Round complete
      const roundComplete = () => {
        if (currentRound < 3 && score >= (currentRound === 1 ? 7 : 8)) {
          // Unlock next round
          onNextRound(score);
        } else {
          // Quiz complete
          onComplete(score);
        }
      };

      setTimeout(roundComplete, 1000);
    }
  };

  // Background styles based on round/difficulty
  const getBgStyle = () => {
    switch (currentRound) {
      case 1:
        return "bg-gradient-to-br from-blue-50 to-blue-100";
      case 2:
        return "bg-gradient-to-br from-amber-50 to-amber-100";
      case 3:
        return "bg-gradient-to-br from-purple-50 to-purple-100";
      default:
        return "bg-gradient-to-br from-blue-50 to-blue-100";
    }
  };

  return (
    <div
      className={`min-h-screen ${getBgStyle()} p-4 md:p-8 flex flex-col gap-6 bg-slate-100`}
    >
      <QuizHeader
        timeRemaining={timeRemaining}
        roundIndicator={roundIndicator}
        currentScore={score}
        questionCounter={questionCounter}
        maxTime={initialTimeRemaining}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col gap-6"
        >
          <QuestionDisplay
            question={currentQuestion.text}
            category={currentQuestion.category}
            difficulty={currentQuestion.difficulty}
            imageUrl={currentQuestion.imageUrl}
          />

          <AnswerOptions
            options={currentQuestion.options}
            onAnswerSelected={handleAnswerSelected}
            disabled={!isTimerActive || showFeedback}
            showFeedback={showFeedback}
            selectedAnswerId={selectedAnswerId}
          />
        </motion.div>
      </AnimatePresence>

      <ProgressBar
        value={currentQuestionIndex}
        max={totalQuestions - 1}
        indicatorColor={
          currentRound === 1
            ? "bg-blue-500"
            : currentRound === 2
              ? "bg-amber-500"
              : "bg-purple-600"
        }
      />
    </div>
  );
};

export default QuizInterface;
