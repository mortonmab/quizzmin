import React from "react";
import { cn } from "@/lib/utils";
import { Clock, Award, Hash } from "lucide-react";

interface QuizHeaderProps {
  timeRemaining?: number;
  roundIndicator?: string;
  currentScore?: number;
  questionCounter?: string;
  maxTime?: number;
}

const QuizHeader = ({
  timeRemaining = 50,
  roundIndicator = "1/3",
  currentScore = 0,
  questionCounter = "1/10",
  maxTime = 50,
}: QuizHeaderProps) => {
  // Calculate time percentage for progress indicator
  const timePercentage = (timeRemaining / maxTime) * 100;

  return (
    <header className="w-full bg-slate-800 text-white p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Timer Section */}
        <div className="flex items-center gap-2 bg-slate-700 p-3 rounded-lg min-w-[140px]">
          <Clock className="h-6 w-6 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">Time Remaining</span>
            <div className="relative w-full h-6">
              <span className="text-xl font-bold">{timeRemaining}s</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-600 rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    timePercentage > 50
                      ? "bg-green-500"
                      : timePercentage > 20
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                  style={{ width: `${timePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Round Indicator */}
        <div className="flex items-center gap-2 bg-slate-700 p-3 rounded-lg">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium">Round</span>
            <span className="text-xl font-bold">{roundIndicator}</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-2 bg-slate-700 p-3 rounded-lg min-w-[120px]">
          <Award className="h-6 w-6 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">Score</span>
            <span className="text-xl font-bold">{currentScore}</span>
          </div>
        </div>

        {/* Question Counter */}
        <div className="flex items-center gap-2 bg-slate-700 p-3 rounded-lg">
          <Hash className="h-6 w-6 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">Question</span>
            <span className="text-xl font-bold">{questionCounter}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuizHeader;
