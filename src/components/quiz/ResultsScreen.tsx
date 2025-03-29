import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ScoreSummary from "./ScoreSummary";
import SocialSharing from "./SocialSharing";
import LeadCaptureForm from "./LeadCaptureForm";

interface ResultsScreenProps {
  score?: number;
  totalQuestions?: number;
  level?: number;
  maxLevel?: number;
  achievementLevel?: string;
  onPlayAgain?: () => void;
  onSubmitLead?: (data: any) => void;
}

const ResultsScreen = ({
  score = 24,
  totalQuestions = 30,
  level = 3,
  maxLevel = 3,
  achievementLevel = "Mineral Guru",
  onPlayAgain = () => window.location.reload(),
  onSubmitLead = (data) => console.log("Lead submitted:", data),
}: ResultsScreenProps) => {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleLeadSubmit = (data: any) => {
    onSubmitLead(data);
    setShowThankYou(true);
  };

  const handleSkip = () => {
    setShowThankYou(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-start py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="flex flex-col gap-8">
          {/* Score Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ScoreSummary
              score={score}
              totalQuestions={totalQuestions}
              level={level}
              maxLevel={maxLevel}
            />
          </motion.div>

          {/* Social Sharing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SocialSharing
              score={score}
              totalQuestions={totalQuestions}
              achievementLevel={achievementLevel}
            />
          </motion.div>

          {/* Lead Capture Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {showThankYou ? (
              <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Thank You!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  We appreciate your participation in our mineral industry quiz.
                </p>
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-gray-700 mb-4">
                    Visit our booth to learn more about our innovative solutions
                    for the mineral industry.
                  </p>
                  <Button
                    onClick={onPlayAgain}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg min-w-[200px]"
                  >
                    Play Again
                  </Button>
                </div>
              </div>
            ) : (
              <LeadCaptureForm
                onSubmit={handleLeadSubmit}
                onSkip={handleSkip}
                finalScore={score}
                totalQuestions={totalQuestions}
              />
            )}
          </motion.div>

          {/* Company Call-to-Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full max-w-4xl mx-auto mt-8 p-6 bg-blue-600 rounded-xl shadow-lg text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-3">
              Discover Our Mineral Industry Solutions
            </h3>
            <p className="mb-6">
              Learn how our innovative technologies can transform your
              operations and increase efficiency.
            </p>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-2 px-6 rounded-lg"
              onClick={() =>
                window.open("https://example.com/solutions", "_blank")
              }
            >
              Explore Solutions
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsScreen;
