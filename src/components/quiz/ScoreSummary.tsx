import React from "react";
import { cn } from "@/lib/utils";
import { Trophy, Award, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreSummaryProps {
  score?: number;
  totalQuestions?: number;
  level?: number;
  maxLevel?: number;
}

const ScoreSummary = ({
  score = 24,
  totalQuestions = 30,
  level = 3,
  maxLevel = 3,
}: ScoreSummaryProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getAchievementLevel = () => {
    if (percentage >= 90)
      return { title: "Mineral Guru", color: "bg-amber-500", icon: Trophy };
    if (percentage >= 75)
      return { title: "Mining Expert", color: "bg-slate-400", icon: Award };
    if (percentage >= 60)
      return {
        title: "Industry Specialist",
        color: "bg-amber-700",
        icon: Award,
      };
    if (percentage >= 40)
      return {
        title: "Mineral Enthusiast",
        color: "bg-emerald-600",
        icon: Star,
      };
    return { title: "Novice Explorer", color: "bg-blue-500", icon: Star };
  };

  const achievement = getAchievementLevel();
  const AchievementIcon = achievement.icon;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Quiz Complete!
        </h2>
        <p className="text-gray-600">
          You've completed all {level} levels of the mineral industry challenge
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <motion.div
                    className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-100"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                      delay: 0.5,
                    }}
                  >
                    <span className="text-5xl font-bold text-primary">
                      {percentage}%
                    </span>
                  </motion.div>
                  <div className="absolute -top-2 -right-2">
                    <Badge className="px-3 py-1 text-sm font-medium">
                      {score}/{totalQuestions}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Completed {level}/{maxLevel} Levels
                  </p>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: maxLevel }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-3 mx-1 rounded-full",
                          i < level ? "bg-primary" : "bg-gray-200",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">
                Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <motion.div
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center text-white mb-4",
                    achievement.color,
                  )}
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.6,
                  }}
                >
                  <AchievementIcon size={40} />
                </motion.div>

                <h3 className="text-2xl font-bold text-center mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {percentage >= 90
                    ? "Outstanding knowledge of the mineral industry!"
                    : percentage >= 75
                      ? "Excellent understanding of mineral concepts!"
                      : percentage >= 60
                        ? "Great job with your mineral knowledge!"
                        : percentage >= 40
                          ? "Good effort on the mineral quiz!"
                          : "Thanks for participating in our mineral quiz!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ScoreSummary;
