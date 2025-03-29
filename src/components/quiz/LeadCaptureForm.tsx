import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { CheckCircle, Send } from "lucide-react";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().min(1, { message: "Company name is required." }),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadCaptureFormProps {
  onSubmit?: (data: FormValues) => void;
  onSkip?: () => void;
  finalScore?: number;
  totalQuestions?: number;
}

const LeadCaptureForm = ({
  onSubmit,
  onSkip,
  finalScore = 25,
  totalQuestions = 30,
}: LeadCaptureFormProps) => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      jobTitle: "",
      phone: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    setSubmitted(true);
    if (onSubmit) onSubmit(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Great Job!</h2>
        <p className="text-xl text-gray-600">
          You scored {finalScore} out of {totalQuestions} questions correctly.
        </p>
        <p className="text-gray-500 mt-2">
          Leave your details to receive exclusive mineral industry insights and
          enter our prize draw.
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your information has been submitted successfully. We'll be in touch
            soon!
          </p>
          <div className="mt-8">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg min-w-[200px]"
              onClick={() => window.location.reload()}
            >
              Play Again
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Full Name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email Address*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        type="email"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Company*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your job title"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Optional
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        type="tel"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Optional
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              {onSkip && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto order-2 sm:order-1 h-12 text-base"
                  onClick={onSkip}
                >
                  Skip
                </Button>
              )}

              <Button
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 h-12 text-base flex items-center gap-2"
              >
                <span>Submit</span>
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              By submitting this form, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{" "}
              and consent to receive mineral industry updates via email.
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default LeadCaptureForm;
