import React from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Facebook, Linkedin, Twitter, Copy, Check } from "lucide-react";

interface SocialSharingProps {
  score?: number;
  totalQuestions?: number;
  achievementLevel?: string;
  shareUrl?: string;
  shareText?: string;
}

const SocialSharing = ({
  score = 25,
  totalQuestions = 30,
  achievementLevel = "Mineral Expert",
  shareUrl = window.location.href,
  shareText = "I just scored as a Mineral Expert in the industry quiz! Think you can beat my score?",
}: SocialSharingProps) => {
  const [copied, setCopied] = React.useState(false);

  const formattedShareText = `${shareText} ${score}/${totalQuestions} - ${achievementLevel}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${shareUrl}?score=${score}&level=${encodeURIComponent(achievementLevel)}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(formattedShareText)}`,
      "_blank",
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(formattedShareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(formattedShareText)}`,
      "_blank",
    );
  };

  return (
    <div className="w-full bg-slate-100 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-semibold text-slate-800">
          Share Your Achievement
        </h3>

        <p className="text-slate-600 text-center mb-2">
          Show off your mineral industry knowledge!
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={shareToFacebook}
                  variant="outline"
                  className="bg-white hover:bg-blue-50 border-slate-200 h-12 w-12 rounded-full p-0"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span className="sr-only">Share to Facebook</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share to Facebook</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={shareToTwitter}
                  variant="outline"
                  className="bg-white hover:bg-blue-50 border-slate-200 h-12 w-12 rounded-full p-0"
                >
                  <Twitter className="h-5 w-5 text-sky-500" />
                  <span className="sr-only">Share to Twitter</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share to Twitter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={shareToLinkedIn}
                  variant="outline"
                  className="bg-white hover:bg-blue-50 border-slate-200 h-12 w-12 rounded-full p-0"
                >
                  <Linkedin className="h-5 w-5 text-blue-800" />
                  <span className="sr-only">Share to LinkedIn</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share to LinkedIn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className={cn(
                    "bg-white hover:bg-blue-50 border-slate-200 h-12 w-12 rounded-full p-0",
                    copied && "bg-green-50 border-green-200",
                  )}
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-slate-600" />
                  )}
                  <span className="sr-only">Copy link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy link"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="text-sm text-slate-500 text-center mt-2">
          <p>
            Your score: {score}/{totalQuestions} - {achievementLevel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialSharing;
