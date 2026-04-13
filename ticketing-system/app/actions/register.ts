import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { RegisterSchema } from "@/lib/zod" // Import your strict schema

export async function registerUser(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    const validatedFields = RegisterSchema.safeParse(rawData);

    // 3. If validation fails, return EVERY error found
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
            message: "Validation failed."
        }
    }

    // 4. If we get here, the data is CLEAN and SAFE
    const { email, password, firstName, lastName } = validatedFields.data;
    const name = `${firstName} ${lastName}`; // Already trimmed by Zod!

    try {
        // Check: Does user exist?
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return {
                success: false,
                message: "An account with this email already exists."
            }
        }

        const hashPassword = await hash(password, 12)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                emailVerified: new Date()
            }
        })

        return { success: true, message: "User registered successfully!" }

    } catch (error) {
        console.error("Registration Error:", error);
        return { success: false, message: "A server error occurred." };
    }
}