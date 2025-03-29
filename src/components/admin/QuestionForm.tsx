import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Question, Difficulty, QuestionOption } from "@/types/question";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Check, X } from "lucide-react";

const questionSchema = z.object({
  text: z.string().min(5, "Question text must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["basic", "intermediate", "advanced"]),
  points: z.coerce.number().int().min(1).max(100),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  initialData?: Question;
  onSubmit: (data: Partial<Question>) => void;
  onCancel: () => void;
  categories: string[];
}

const QuestionForm = ({
  initialData,
  onSubmit,
  onCancel,
  categories,
}: QuestionFormProps) => {
  const [options, setOptions] = useState<QuestionOption[]>(
    initialData?.options || [
      { id: "a", text: "", isCorrect: false },
      { id: "b", text: "", isCorrect: false },
      { id: "c", text: "", isCorrect: false },
      { id: "d", text: "", isCorrect: false },
    ],
  );

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: initialData?.text || "",
      category: initialData?.category || "",
      difficulty: initialData?.difficulty || "basic",
      points: initialData?.points || 10,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length >= 6) return; // Limit to 6 options

    const newId = String.fromCharCode(97 + options.length); // a, b, c, d, e, f
    setOptions([...options, { id: newId, text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options

    const newOptions = [...options];
    newOptions.splice(index, 1);

    // Reassign IDs to maintain sequence
    const updatedOptions = newOptions.map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(97 + i),
    }));

    // Ensure at least one option is correct
    if (
      !updatedOptions.some((opt) => opt.isCorrect) &&
      updatedOptions.length > 0
    ) {
      updatedOptions[0].isCorrect = true;
    }

    setOptions(updatedOptions);
  };

  const handleSubmit = (data: QuestionFormValues) => {
    // Validate that at least one option is marked as correct
    if (!options.some((opt) => opt.isCorrect)) {
      form.setError("root", {
        type: "manual",
        message: "At least one option must be marked as correct",
      });
      return;
    }

    // Validate that all options have text
    if (options.some((opt) => !opt.text.trim())) {
      form.setError("root", {
        type: "manual",
        message: "All options must have text",
      });
      return;
    }

    onSubmit({
      ...data,
      options,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Question" : "Create New Question"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the question text"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === "other" && (
                      <Input
                        placeholder="Enter new category"
                        onChange={(e) => field.onChange(e.target.value)}
                        className="mt-2"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Points awarded for a correct answer (1-100)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to an image related to the question
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base">Answer Options</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={options.length >= 6}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>

              {options.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 border p-3 rounded-md"
                >
                  <div className="flex items-center h-10 pt-1">
                    <Checkbox
                      checked={option.isCorrect}
                      onCheckedChange={() => handleCorrectOptionChange(index)}
                      id={`option-${option.id}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="bg-primary/10 text-primary font-medium h-8 w-8 rounded-full flex items-center justify-center">
                        {option.id.toUpperCase()}
                      </div>
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${option.id.toUpperCase()}`}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>

            <CardFooter className="flex justify-end space-x-4 px-0">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Check className="h-4 w-4 mr-2" />
                {initialData ? "Update" : "Create"} Question
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
