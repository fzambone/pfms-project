import z from "zod";
import type { Actions } from "./$types";
import bcrypt from "bcrypt";
import { prisma } from "$lib/server/db";
import { fail } from "@sveltejs/kit";


// Define the schemna for signup input using Zod
const SignupSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Where the error will be displayed
    message: "Passwords do not match.",
});

// Define the action function
export const actions: Actions = {
    signup: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        // 1. Validate input using Zod
        const parsed = SignupSchema.safeParse(formData);

        if (!parsed.success) {
            // If validation fails, return the errors to the client
            const fieldErrors = parsed.error.flatten().fieldErrors;
            return fail(400, {
                error: "Validation failed. Please check your inputs.",
                fieldErrors,
                email: formData.email as string // Return email to pre-fill the form
            });
        }

        const { email, password } = parsed.data;

        try {
            // 2. Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return fail(409, {
                    error: "Email already registered. Please sign in or use a different email.",
                    email // Return email to pre-fill the form
                });
            }

            // 3. Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 4. Create the user in the database
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            // 5. Success! Redirect or return success message
            // For now, just return a success flag. Auth.js `signIn` will be used later.

            return { sucess: true };

        } catch (err) {
            console.error("Signup error:", err); // Log the error on the server
            return fail(500, {
                error: "An unexpected error occurred during signup. Please try again later.",
                email: formData.email as string // Return email to pre-fill the form
            });
        }
    }
};