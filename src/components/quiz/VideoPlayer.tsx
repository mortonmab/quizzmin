import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Play, SkipForward, Pause } from "lucide-react";

interface VideoPlayerProps {
  videoSrc?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  autoPlay?: boolean;
  companyLogo?: string;
}

const VideoPlayer = ({
  videoSrc = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  onComplete = () => console.log("Video completed"),
  onSkip = () => console.log("Video skipped"),
  autoPlay = true,
  companyLogo = "https://api.dicebear.com/7.x/avataaars/svg?seed=mineral-quiz-company",
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isEnded, setIsEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setIsEnded(true);
    onSkip();
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsEnded(true);
    onComplete();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-gray-900">
      {/* Company logo */}
      <div className="absolute top-6 left-6 z-10">
        <img src={companyLogo} alt="Company Logo" className="h-16 w-auto" />
      </div>

      {/* Video container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoSrc}
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          playsInline
        />

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Video controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPause}
            className="text-white bg-black/50 hover:bg-black/70 rounded-full h-12 w-12"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full"
          >
            <SkipForward size={20} className="mr-2" />
            Skip Video
          </Button>
        </div>
      </div>

      {/* Continue button (appears after video ends) */}
      {isEnded && (
        <div className="mt-8 animate-fade-in">
          <Button
            onClick={handleContinue}
            size="lg"
            className="text-lg px-8 py-6 h-auto rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Continue to Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
