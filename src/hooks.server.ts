import { SvelteKitAuth } from "@auth/sveltekit"; // Import `handle` from my `auth.ts` file
import { handle } from "$lib/auth";

export { handle }; // Export the `handle` function provided by Auth.js

// Optional: Add `sequence`if we have other hooks
// Import { sequence } from "@sveltejs/kit/hooks";
// export const handle = sequence(handleAuth, myOtherHooks);