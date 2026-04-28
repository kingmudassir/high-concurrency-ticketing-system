import { z } from "zod";

export const RegisterSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        // Alphanumeric, underscores, and dots only.
        .regex(/^[a-zA-Z0-9._]+$/, "Letters, numbers, dots, and underscores only")
        // Prevent starting/ending with dots or underscores
        .regex(/^[^._].*[^._]$/, "Cannot start or end with a dot or underscore")
        // Block consecutive special characters (e.g., "user..name")
        .refine((s) => !/[._]{2,}/.test(s), "Cannot contain consecutive dots or underscores")
        .toLowerCase()
        // Blacklist sensitive/administrative terms
        .refine((s) => !["admin", "root", "support", "system", "moderator"].includes(s), {
            message: "This username is reserved",
        }),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long")
        .regex(/[A-Z]/, "Include at least one uppercase letter")
        .regex(/[a-z]/, "Include at least one lowercase letter")
        .regex(/[0-9]/, "Include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Include at least one special character"),
        
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const LoginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required") 
        .email("Please enter a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required"),
});