import React from "react";

interface QuestionDisplayProps {
  question: string;
  category?: string;
  difficulty?: "basic" | "intermediate" | "advanced";
  imageUrl?: string;
}

const QuestionDisplay = ({
  question = "What is the most common mineral in the Earth's crust?",
  category = "Geology Basics",
  difficulty = "basic",
  imageUrl,
}: QuestionDisplayProps) => {
  // Map difficulty to background color
  const difficultyColors = {
    basic: "bg-blue-100",
    intermediate: "bg-amber-100",
    advanced: "bg-purple-100",
  };

  const difficultyBadgeColors = {
    basic: "bg-blue-500 text-white",
    intermediate: "bg-amber-500 text-white",
    advanced: "bg-purple-600 text-white",
  };

  return (
    <div
      className={`w-full p-6 rounded-xl shadow-md ${difficultyColors[difficulty]} bg-opacity-80`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">{category}</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyBadgeColors[difficulty]}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        <div className="question-container min-h-[120px] flex items-center justify-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800">
            {question}
          </h2>
        </div>

        {imageUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={imageUrl}
              alt="Question visual aid"
              className="rounded-lg max-h-[200px] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
