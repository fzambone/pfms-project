import { SvelteKitAuth } from "@auth/sveltekit";
import { handle } from "./auth"; // Import `handle` from my `auth.ts` file

export { handle }; // Export the `handle` function provided by Auth.js

// Optional: Add `sequence`if we have other hooks
// Import { sequence } from "@sveltejs/kit/hooks";
// export const handle = sequence(handleAuth, myOtherHooks);