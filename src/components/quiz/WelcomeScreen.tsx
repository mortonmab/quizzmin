import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStartGame?: () => void;
  companyLogo?: string;
  companyName?: string;
  backgroundColor?: string;
}

const WelcomeScreen = ({
  onStartGame = () => {},
  companyLogo = "https://api.dicebear.com/7.x/shapes/svg?seed=mineral-quiz",
  companyName = "Mineral Industry Experts",
  backgroundColor = "#1a365d",
}: WelcomeScreenProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full p-6 bg-slate-900 text-white"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-12 py-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <img
            src={companyLogo}
            alt={`${companyName} Logo`}
            className="w-48 h-48 object-contain mb-4"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight">
            {companyName}
          </h1>
          <div className="h-1 w-32 bg-amber-500 rounded-full"></div>
        </div>

        {/* Quiz Title */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-amber-400">
            Mineral Industry Quiz Challenge
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
            Test your knowledge and expertise in the mineral industry with our
            interactive quiz!
          </p>
        </div>

        {/* Start Button */}
        <div className="mt-12 flex flex-col items-center">
          <Button
            onClick={onStartGame}
            size="lg"
            className={cn(
              "group relative overflow-hidden text-xl py-8 px-12 rounded-full transition-all duration-300 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-lg",
              isHovered ? "pl-16" : "pl-12",
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isHovered ? (
                <>
                  <span>Start Game</span>
                  <ArrowRight className="w-6 h-6 ml-2 animate-pulse" />
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-2" />
                  <span>Start Game</span>
                </>
              )}
            </span>
          </Button>
          <p className="text-slate-400 mt-4 text-sm">
            Touch to begin your mineral knowledge journey
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 text-center text-slate-400 text-sm">
          <p>© 2023 {companyName}. All rights reserved.</p>
          <p>Optimized for touch screen interaction</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
