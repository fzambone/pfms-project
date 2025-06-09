<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    // Define the expected type for the `form` prop from the server action
    type LoginActionData = {
        error?: string; // General error message
        email?: string; // To pre-fill the form
        fieldErrors?: { // Specific field validation errors from Zod
            email?: string[];
            password?: string[];
        };
    } | undefined; // `undefined` means the form hasn't been submitted yet

    export let form: LoginActionData; // Use custom type for form data

    // No explicit redirect here because Auth.js handles it
    // However, if server action returns a success flag or specific error, 
    // wen can handle it here as we did with signup
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
    <div class="card p-4" style="width: 100%; max-width: 400px;">
        <h2 class="card-title text-center mb-4">Sign In</h2>

        {#if form?.error}
            <div class="alert alert-danger" role="alert">
                {form.error}
            </div>
        {/if}

        <form method="POST" action="?/login" use:enhance>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input 
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    value={form?.email ?? ''}
                    required
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    required
                />
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign In</button>
        </form>
        <p class="text-center mt-3">Don't have an account? <a href="/auth/signup">Sign Up</a></p>
    </div>
</div>