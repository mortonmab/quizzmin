import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  adminLoginSchema,
  authenticateAdmin,
  sendPasswordResetEmail,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LoginFormValues = z.infer<typeof adminLoginSchema>;

interface AdminLoginProps {
  onLoginSuccess: (
    token: string,
    admin: { id: string; name: string; email: string },
  ) => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email() })),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      const result = authenticateAdmin(data.email, data.password);

      if (result.success && result.token) {
        onLoginSuccess(result.token, result.admin);
      } else {
        setError(result.message || "Authentication failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      const result = sendPasswordResetEmail(data.email);

      if (result.success) {
        setResetEmailSent(true);
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {showForgotPassword ? "Reset Password" : "Admin Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {showForgotPassword
              ? "Enter your email to receive a password reset link"
              : "Enter your credentials to access the admin panel"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resetEmailSent ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Email Sent</AlertTitle>
              <AlertDescription className="text-green-700">
                If your email is registered, you will receive a password reset
                link shortly.
              </AlertDescription>
            </Alert>
          ) : showForgotPassword ? (
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="admin@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="admin@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => {
              setShowForgotPassword(!showForgotPassword);
              setResetEmailSent(false);
              setError(null);
            }}
          >
            {showForgotPassword ? "Back to Login" : "Forgot Password?"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
