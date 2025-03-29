import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface AnswerOptionsProps {
  options?: AnswerOption[];
  onAnswerSelected?: (optionId: string, isCorrect: boolean) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  selectedAnswerId?: string | null;
}

const AnswerOptions = ({
  options = [
    { id: "a", text: "Quartz", isCorrect: true },
    { id: "b", text: "Feldspar", isCorrect: false },
    { id: "c", text: "Mica", isCorrect: false },
    { id: "d", text: "Calcite", isCorrect: false },
  ],
  onAnswerSelected = () => {},
  disabled = false,
  showFeedback = false,
  selectedAnswerId = null,
}: AnswerOptionsProps) => {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    selectedAnswerId,
  );

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (disabled || localSelectedId) return;

    setLocalSelectedId(optionId);
    onAnswerSelected(optionId, isCorrect);
  };

  const getButtonVariant = (option: AnswerOption) => {
    if (!showFeedback || (!localSelectedId && !selectedAnswerId)) {
      return localSelectedId === option.id || selectedAnswerId === option.id
        ? "secondary"
        : "outline";
    }

    if (option.isCorrect) {
      return "default";
    }

    if (
      (localSelectedId === option.id || selectedAnswerId === option.id) &&
      !option.isCorrect
    ) {
      return "destructive";
    }

    return "outline";
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const isSelected =
            localSelectedId === option.id || selectedAnswerId === option.id;
          const buttonVariant = getButtonVariant(option);

          return (
            <Button
              key={option.id}
              variant={buttonVariant}
              size="lg"
              className={cn(
                "h-24 text-xl font-medium relative transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
                isSelected && "ring-2 ring-primary",
                disabled && "opacity-80",
              )}
              onClick={() => handleOptionClick(option.id, option.isCorrect)}
              disabled={disabled}
            >
              <span className="absolute left-4">
                {option.id.toUpperCase()}.
              </span>
              <span className="mx-auto">{option.text}</span>

              {showFeedback && isSelected && (
                <span className="absolute right-4">
                  {option.isCorrect ? (
                    <Check className="h-6 w-6 text-green-500" />
                  ) : (
                    <X className="h-6 w-6 text-red-500" />
                  )}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerOptions;
