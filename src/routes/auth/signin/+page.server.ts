import { AuthError } from "@auth/core/errors";
import { fail, redirect} from "@sveltejs/kit";
import type { Actions } from "./$types";
import z from "zod";
import { signIn } from "@auth/sveltekit/client";


// Define the schema for login input
const LoginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
});

// Define the action function
export const actions: Actions = {
    login: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        // 1. Validate input using Zod
        const parsed = LoginSchema.safeParse(formData);

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
            // 2. Attempt to sign in using Auth.js credentials provider
            // The `signIn`function handles the entire authentication flow
            // including credential verification (via our `authorize` function in auth.ts)
            // and session creation.
            await signIn("credentials", {
                email,
                password,
                redirectTo: "/",
            });
        } catch (error) {
            console.error("Login error:", error);

            // 3. Handle Auth.js specific errors
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return fail(401, { error: "Invalid credentials. Please check yuor email and password." });
                    case "Verification":
                        // Handle cases like email not verified if we implement it later
                        return fail(401, { error: "Your email is not verified. Please check your inbox for a verification email." });
                    default:
                        return fail(401, { error: "An unexpected error occurred." });
                }
            }

            // 4. Handle other unexpected errors
            return fail(500, { error: "An unexpected error occurred during login. Please try again later." });
        }
    }
};