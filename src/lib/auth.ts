import { z } from "zod";

// Define validation schema for admin login
export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Define validation schema for password reset
export const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Define validation schema for password update
export const passwordUpdateSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Mock admin users for demo purposes
// In a real application, this would be stored in a database with hashed passwords
export const mockAdmins = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    // In a real app, this would be a hashed password
    password: "password123",
  },
];

// Mock function to authenticate admin
// In a real app, this would verify against a database with proper password hashing
export const authenticateAdmin = (email: string, password: string) => {
  const admin = mockAdmins.find((admin) => admin.email === email);

  if (!admin) {
    return { success: false, message: "Invalid email or password" };
  }

  if (admin.password !== password) {
    return { success: false, message: "Invalid email or password" };
  }

  // Create a session token (in a real app, this would be a JWT or similar)
  const sessionToken = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  return {
    success: true,
    admin: { id: admin.id, name: admin.name, email: admin.email },
    token: sessionToken,
  };
};

// Mock function to send password reset email
export const sendPasswordResetEmail = (email: string) => {
  const admin = mockAdmins.find((admin) => admin.email === email);

  if (!admin) {
    // Don't reveal if the email exists or not for security
    return {
      success: true,
      message:
        "If your email is registered, you will receive a password reset link",
    };
  }

  // In a real app, this would generate a secure token and send an email
  const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  console.log(`Password reset requested for ${email}. Token: ${resetToken}`);

  return {
    success: true,
    message:
      "If your email is registered, you will receive a password reset link",
  };
};

// Mock function to verify session token
export const verifySession = (token: string) => {
  // In a real app, this would verify the token's validity, expiration, etc.
  if (token && token.startsWith("session-")) {
    return { valid: true };
  }

  return { valid: false };
};
