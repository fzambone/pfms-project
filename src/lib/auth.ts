import { z } from "zod";
import { SvelteKitAuth } from "@auth/sveltekit";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "@auth/sveltekit/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "$lib/server/db";

// Define the credentials schema for login
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const { handle, signIn, signOut } = SvelteKitAuth({
    // Adapter for Prisma
    adapter: PrismaAdapter(prisma),
    // Configure authentication providers
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                // This is where we'll verify user credentials
                // Keeping it simple for now, will refine it later.

                const parsed = LoginSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new Error("Invalid credentials");
                }

                const { email, password } = parsed.data;
                
                // Find user in database
                const user = await prisma.user.findUnique({
                    where: { email: email as string }
                });

                if (!user || !user.password) {
                    throw new Error("User not found or no password set");
                }

                // Compare hashed password
                const passwordsMatch = await bcrypt.compare(password as string, user.password);

                if (user && passwordsMatch) {
                    // Return user object (minimally) if authentication is successful
                    // Auth.js will handle the session creation from here
                    return { id: user.id, email: user.email, name: user.name };
                }

                return null; // Return null if authentication fails
            }
        })

        // Add other providers here as needed, e.g. Google, GitHub, etc.
        // For example:
        // Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
        // GitHub({
        //     clientId: process.env.GITHUB_CLIENT_ID,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // }),
    ],

    // Secret for signing cookies and JWTs. Store securely in environment variables.
    secret: process.env.AUTH_SECRET,

    // Session configuration
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        // updateAge: 24 * 60 * 60, // 24 hours
    },
    // Callbacks (usefull for customizing behavior and extending session data)
    callbacks: {
        async session({ session, user }) {
            // Attach optional user data to the session object if needed
            // For example, might want to expose the user's ID
            if (user) {
                session.user.id = user.id; // Add user ID to session
            }

            return session; // Return the session object
        }
    },
    // Debug mode (set to true in development)
    debug: process.env.NODE_ENV === "development",
    // Pages where Auth.js handles redirects
    pages: {
        signIn: "/auth/signin", // Custom sign in page
        error: "/auth/error", // Custom error page
    },
})