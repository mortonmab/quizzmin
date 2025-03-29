import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value for the progress bar
   */
  max?: number;
  /**
   * Custom class name for styling
   */
  className?: string;
  /**
   * Indicator color class
   */
  indicatorColor?: string;
  /**
   * Background color class
   */
  backgroundColor?: string;
}

const ProgressBar = ({
  value = 50,
  max = 100,
  className,
  indicatorColor = "bg-emerald-500",
  backgroundColor = "bg-slate-200",
}: ProgressBarProps) => {
  // Calculate the percentage completion
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full bg-white p-4 rounded-lg shadow-sm", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">
          Progress: {Math.round(percentage)}%
        </span>
        <span className="text-xs text-slate-500">
          {value}/{max} completed
        </span>
      </div>
      <div
        className={cn(
          "h-4 w-full overflow-hidden rounded-full",
          backgroundColor,
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            indicatorColor,
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
