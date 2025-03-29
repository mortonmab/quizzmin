import React, { useState, useEffect } from "react";
import WelcomeScreen from "./quiz/WelcomeScreen";
import VideoPlayer from "./quiz/VideoPlayer";
import QuizInterface from "./quiz/QuizInterface";
import ResultsScreen from "./quiz/ResultsScreen";

// Define quiz questions for each level
const basicQuestions = [
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
  {
    id: "q4",
    text: "Which of these is NOT a precious gemstone?",
    category: "Gemology",
    difficulty: "basic",
    options: [
      { id: "a", text: "Ruby", isCorrect: false },
      { id: "b", text: "Sapphire", isCorrect: false },
      { id: "c", text: "Pyrite", isCorrect: true },
      { id: "d", text: "Emerald", isCorrect: false },
    ],
  },
  {
    id: "q5",
    text: "What is the primary component of limestone?",
    category: "Mineral Composition",
    difficulty: "basic",
    options: [
      { id: "a", text: "Calcium Carbonate", isCorrect: true },
      { id: "b", text: "Silicon Dioxide", isCorrect: false },
      { id: "c", text: "Iron Oxide", isCorrect: false },
      { id: "d", text: "Aluminum Silicate", isCorrect: false },
    ],
  },
  {
    id: "q6",
    text: "Which mineral is the main source of aluminum?",
    category: "Industrial Minerals",
    difficulty: "basic",
    options: [
      { id: "a", text: "Galena", isCorrect: false },
      { id: "b", text: "Bauxite", isCorrect: true },
      { id: "c", text: "Magnetite", isCorrect: false },
      { id: "d", text: "Gypsum", isCorrect: false },
    ],
  },
  {
    id: "q7",
    text: "What is the Mohs scale used to measure?",
    category: "Mineral Properties",
    difficulty: "basic",
    options: [
      { id: "a", text: "Mineral color", isCorrect: false },
      { id: "b", text: "Mineral hardness", isCorrect: true },
      { id: "c", text: "Mineral density", isCorrect: false },
      { id: "d", text: "Mineral transparency", isCorrect: false },
    ],
  },
  {
    id: "q8",
    text: "Which of these is a metamorphic rock?",
    category: "Rock Types",
    difficulty: "basic",
    options: [
      { id: "a", text: "Granite", isCorrect: false },
      { id: "b", text: "Sandstone", isCorrect: false },
      { id: "c", text: "Marble", isCorrect: true },
      { id: "d", text: "Basalt", isCorrect: false },
    ],
  },
  {
    id: "q9",
    text: "What is the chemical formula for gold?",
    category: "Mineral Chemistry",
    difficulty: "basic",
    options: [
      { id: "a", text: "Au", isCorrect: true },
      { id: "b", text: "Ag", isCorrect: false },
      { id: "c", text: "Fe", isCorrect: false },
      { id: "d", text: "Cu", isCorrect: false },
    ],
  },
  {
    id: "q10",
    text: "Which mineral is known as 'fool's gold'?",
    category: "Mineral Identification",
    difficulty: "basic",
    options: [
      { id: "a", text: "Galena", isCorrect: false },
      { id: "b", text: "Chalcopyrite", isCorrect: false },
      { id: "c", text: "Pyrite", isCorrect: true },
      { id: "d", text: "Magnetite", isCorrect: false },
    ],
  },
];

const intermediateQuestions = [
  {
    id: "i1",
    text: "What is the process of extracting valuable minerals from ore called?",
    category: "Mining Processes",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Beneficiation", isCorrect: true },
      { id: "b", text: "Extraction", isCorrect: false },
      { id: "c", text: "Refinement", isCorrect: false },
      { id: "d", text: "Smelting", isCorrect: false },
    ],
  },
  {
    id: "i2",
    text: "Which mineral group do rubies and sapphires belong to?",
    category: "Gemology",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Beryl", isCorrect: false },
      { id: "b", text: "Corundum", isCorrect: true },
      { id: "c", text: "Garnet", isCorrect: false },
      { id: "d", text: "Tourmaline", isCorrect: false },
    ],
  },
  {
    id: "i3",
    text: "What type of mining involves removing large areas of land surface?",
    category: "Mining Techniques",
    difficulty: "intermediate",
    imageUrl:
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?w=800&q=80",
    options: [
      { id: "a", text: "Underground mining", isCorrect: false },
      { id: "b", text: "Surface mining", isCorrect: true },
      { id: "c", text: "In-situ mining", isCorrect: false },
      { id: "d", text: "Placer mining", isCorrect: false },
    ],
  },
  {
    id: "i4",
    text: "Which mineral is the primary ore of copper?",
    category: "Economic Geology",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Galena", isCorrect: false },
      { id: "b", text: "Sphalerite", isCorrect: false },
      { id: "c", text: "Chalcopyrite", isCorrect: true },
      { id: "d", text: "Cassiterite", isCorrect: false },
    ],
  },
  {
    id: "i5",
    text: "What is the process of heating an ore beyond its melting point called?",
    category: "Metallurgy",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Roasting", isCorrect: false },
      { id: "b", text: "Smelting", isCorrect: true },
      { id: "c", text: "Calcining", isCorrect: false },
      { id: "d", text: "Leaching", isCorrect: false },
    ],
  },
  {
    id: "i6",
    text: "Which rock type is formed by the accumulation of sediments?",
    category: "Rock Formation",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Igneous", isCorrect: false },
      { id: "b", text: "Metamorphic", isCorrect: false },
      { id: "c", text: "Sedimentary", isCorrect: true },
      { id: "d", text: "Plutonic", isCorrect: false },
    ],
  },
  {
    id: "i7",
    text: "What is the study of the Earth's physical structure and substance called?",
    category: "Earth Sciences",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Geology", isCorrect: true },
      { id: "b", text: "Geography", isCorrect: false },
      { id: "c", text: "Oceanography", isCorrect: false },
      { id: "d", text: "Meteorology", isCorrect: false },
    ],
  },
  {
    id: "i8",
    text: "Which mineral is used as a source of lithium for batteries?",
    category: "Industrial Minerals",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Bauxite", isCorrect: false },
      { id: "b", text: "Spodumene", isCorrect: true },
      { id: "c", text: "Magnetite", isCorrect: false },
      { id: "d", text: "Fluorite", isCorrect: false },
    ],
  },
  {
    id: "i9",
    text: "What causes minerals to fluoresce under ultraviolet light?",
    category: "Mineral Properties",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Trace elements", isCorrect: true },
      { id: "b", text: "Crystal structure", isCorrect: false },
      { id: "c", text: "Radioactivity", isCorrect: false },
      { id: "d", text: "Magnetic properties", isCorrect: false },
    ],
  },
  {
    id: "i10",
    text: "Which of these is NOT a method of mineral exploration?",
    category: "Exploration Techniques",
    difficulty: "intermediate",
    options: [
      { id: "a", text: "Geophysical surveys", isCorrect: false },
      { id: "b", text: "Geochemical sampling", isCorrect: false },
      { id: "c", text: "Remote sensing", isCorrect: false },
      { id: "d", text: "Crystallography", isCorrect: true },
    ],
  },
];

const advancedQuestions = [
  {
    id: "a1",
    text: "What is the process of using microorganisms to extract metals from ores called?",
    category: "Mining Technology",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Bioleaching", isCorrect: true },
      { id: "b", text: "Bioextraction", isCorrect: false },
      { id: "c", text: "Biomining", isCorrect: false },
      { id: "d", text: "Bioprocessing", isCorrect: false },
    ],
  },
  {
    id: "a2",
    text: "Which mineral system is characterized by the formula X₃Y₂(SiO₄)₃?",
    category: "Mineralogy",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Feldspars", isCorrect: false },
      { id: "b", text: "Pyroxenes", isCorrect: false },
      { id: "c", text: "Garnets", isCorrect: true },
      { id: "d", text: "Amphiboles", isCorrect: false },
    ],
  },
  {
    id: "a3",
    text: "What is the primary environmental concern with acid mine drainage?",
    category: "Environmental Geology",
    difficulty: "advanced",
    imageUrl:
      "https://images.unsplash.com/photo-1578496479531-32e296d5c6e1?w=800&q=80",
    options: [
      { id: "a", text: "Groundwater contamination", isCorrect: true },
      { id: "b", text: "Air pollution", isCorrect: false },
      { id: "c", text: "Soil erosion", isCorrect: false },
      { id: "d", text: "Noise pollution", isCorrect: false },
    ],
  },
  {
    id: "a4",
    text: "Which geophysical method measures variations in the Earth's gravitational field?",
    category: "Exploration Geophysics",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Magnetometry", isCorrect: false },
      { id: "b", text: "Gravimetry", isCorrect: true },
      { id: "c", text: "Resistivity", isCorrect: false },
      { id: "d", text: "Seismic reflection", isCorrect: false },
    ],
  },
  {
    id: "a5",
    text: "What is the process of determining the absolute age of rocks or minerals?",
    category: "Geochronology",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Radiometric dating", isCorrect: true },
      { id: "b", text: "Stratigraphic correlation", isCorrect: false },
      { id: "c", text: "Paleomagnetic analysis", isCorrect: false },
      { id: "d", text: "Biostratigraphy", isCorrect: false },
    ],
  },
  {
    id: "a6",
    text: "Which mineral processing technique separates minerals based on their magnetic properties?",
    category: "Mineral Processing",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Flotation", isCorrect: false },
      { id: "b", text: "Magnetic separation", isCorrect: true },
      { id: "c", text: "Gravity separation", isCorrect: false },
      { id: "d", text: "Electrostatic separation", isCorrect: false },
    ],
  },
  {
    id: "a7",
    text: "What is the term for a mineral deposit that can be economically extracted?",
    category: "Economic Geology",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Mineral resource", isCorrect: false },
      { id: "b", text: "Mineral reserve", isCorrect: true },
      { id: "c", text: "Mineral occurrence", isCorrect: false },
      { id: "d", text: "Mineral prospect", isCorrect: false },
    ],
  },
  {
    id: "a8",
    text: "Which type of metamorphism occurs when rocks are subjected to high pressure but relatively low temperature?",
    category: "Metamorphic Petrology",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Contact metamorphism", isCorrect: false },
      { id: "b", text: "Regional metamorphism", isCorrect: false },
      { id: "c", text: "Burial metamorphism", isCorrect: false },
      { id: "d", text: "Blueschist metamorphism", isCorrect: true },
    ],
  },
  {
    id: "a9",
    text: "What is the primary component of rare earth magnets?",
    category: "Industrial Minerals",
    difficulty: "advanced",
    options: [
      { id: "a", text: "Neodymium", isCorrect: true },
      { id: "b", text: "Titanium", isCorrect: false },
      { id: "c", text: "Vanadium", isCorrect: false },
      { id: "d", text: "Chromium", isCorrect: false },
    ],
  },
  {
    id: "a10",
    text: "Which analytical technique is used to determine the elemental composition of minerals?",
    category: "Analytical Techniques",
    difficulty: "advanced",
    options: [
      { id: "a", text: "X-ray diffraction", isCorrect: false },
      { id: "b", text: "X-ray fluorescence", isCorrect: true },
      { id: "c", text: "Infrared spectroscopy", isCorrect: false },
      { id: "d", text: "Raman spectroscopy", isCorrect: false },
    ],
  },
];

// Define quiz states
enum QuizState {
  WELCOME = "welcome",
  VIDEO = "video",
  QUIZ_ROUND_1 = "quiz_round_1",
  QUIZ_ROUND_2 = "quiz_round_2",
  QUIZ_ROUND_3 = "quiz_round_3",
  RESULTS = "results",
}

const Home = () => {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.WELCOME);
  const [score, setScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  // Reset quiz state
  const resetQuiz = () => {
    setQuizState(QuizState.WELCOME);
    setScore(0);
    setTotalScore(0);
    setCompletedRounds(0);
  };

  // Handle welcome screen start button
  const handleStartGame = () => {
    setQuizState(QuizState.VIDEO);
  };

  // Handle video completion or skip
  const handleVideoComplete = () => {
    setQuizState(QuizState.QUIZ_ROUND_1);
  };

  // Handle round completion
  const handleRoundComplete = (roundScore: number) => {
    setScore(roundScore);
    setTotalScore((prevTotal) => prevTotal + roundScore);
    setCompletedRounds((prevRounds) => prevRounds + 1);

    // Determine next state based on score and current round
    if (quizState === QuizState.QUIZ_ROUND_1 && roundScore >= 7) {
      setQuizState(QuizState.QUIZ_ROUND_2);
    } else if (quizState === QuizState.QUIZ_ROUND_2 && roundScore >= 8) {
      setQuizState(QuizState.QUIZ_ROUND_3);
    } else {
      setQuizState(QuizState.RESULTS);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (roundScore: number) => {
    setScore(roundScore);
    setTotalScore((prevTotal) => prevTotal + roundScore);
    setCompletedRounds((prevRounds) => prevRounds + 1);
    setQuizState(QuizState.RESULTS);
  };

  // Determine achievement level based on total score and completed rounds
  const getAchievementLevel = () => {
    const totalQuestions = completedRounds * 10;
    const percentage = (totalScore / totalQuestions) * 100;

    if (percentage >= 90) return "Mineral Guru";
    if (percentage >= 75) return "Mining Expert";
    if (percentage >= 60) return "Geology Enthusiast";
    return "Mineral Novice";
  };

  // Render appropriate component based on quiz state
  const renderQuizState = () => {
    switch (quizState) {
      case QuizState.WELCOME:
        return <WelcomeScreen onStartGame={handleStartGame} />;

      case QuizState.VIDEO:
        return (
          <VideoPlayer
            onComplete={handleVideoComplete}
            onSkip={handleVideoComplete}
          />
        );

      case QuizState.QUIZ_ROUND_1:
        return (
          <QuizInterface
            currentRound={1}
            questions={basicQuestions}
            initialScore={0}
            initialTimeRemaining={50}
            onComplete={handleQuizComplete}
            onNextRound={handleRoundComplete}
          />
        );

      case QuizState.QUIZ_ROUND_2:
        return (
          <QuizInterface
            currentRound={2}
            questions={intermediateQuestions}
            initialScore={0}
            initialTimeRemaining={50}
            onComplete={handleQuizComplete}
            onNextRound={handleRoundComplete}
          />
        );

      case QuizState.QUIZ_ROUND_3:
        return (
          <QuizInterface
            currentRound={3}
            questions={advancedQuestions}
            initialScore={0}
            initialTimeRemaining={50}
            onComplete={handleQuizComplete}
            onNextRound={handleRoundComplete}
          />
        );

      case QuizState.RESULTS:
        return (
          <ResultsScreen
            score={totalScore}
            totalQuestions={completedRounds * 10}
            level={completedRounds}
            maxLevel={3}
            achievementLevel={getAchievementLevel()}
            onPlayAgain={resetQuiz}
            onSubmitLead={(data) => {
              console.log("Lead submitted:", data);
              // In a real implementation, this would send data to a backend service
            }}
          />
        );

      default:
        return <WelcomeScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">{renderQuizState()}</div>
  );
};

export default Home;
