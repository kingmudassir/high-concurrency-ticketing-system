import { z } from "zod";

export const RegisterSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name is too long")
        .regex(/^[a-zA-Z\s-]+$/, "First name can only contain letters, spaces, and hyphens"),
    
    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name is too long")
        .regex(/^[a-zA-Z\s-]+$/, "Last name can only contain letters, spaces, and hyphens"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid professional email")
        .toLowerCase(), // Always store emails in lowercase to prevent duplicate account bugs

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
        
    confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This tells Zod to attach the error to the confirmPassword field
});

export const LoginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required"), // Don't enforce complexity here, just presence
});