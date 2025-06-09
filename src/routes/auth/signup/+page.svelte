<script lang="ts">
    // This makes form data and submission status available in the template
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    // Define the expected type for the `form` prop from the server action
    // This mirrors the structure returned by `fail()` in +page.server.ts
    type SignupActionData = {
        success?: boolean; // When signup is successful
        error?: string; // General error message
        email?: string; // To pre-fill the form
        fieldErrors?: {
            email?: string[];
            password?: string[];
            confirmPassword?: string[];
            // Add other fields here if the schema grows
        };
    } | undefined; // `undefined` means the form hasn't been submitted yet

    export let form: SignupActionData; // Use custom type for form data

    // If the form submission was successful, redirect to login or dashboard
    $: if (form?.success) {
        goto("/auth/signin");
    }

</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh;">
    <div class="card p-4" style="width: 100%; max-width: 400px;">
        <h2 class="card-title text-center mb-4">Sign Up</h2>

        {#if form?.error}
            <div class="alert alert-danger" role="alert">
                {form.error}
            </div>
        {/if}

        <form method="POST" action="?/signup" use:enhance>
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
                {#if form?.fieldErrors?.email}
                    <div class="form-text text-danger">{form.fieldErrors.email}</div>
                {/if}
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
                {#if form?.fieldErrors?.password}
                    <div class="form-text text-danger">{form.fieldErrors.password}</div>
                {/if}
            </div>
            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                />
                {#if form?.fieldErrors?.confirmPassword}
                    <div class="form-text text-danger">{form.fieldErrors.confirmPassword}</div>
                {/if}
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign Up</button>
        </form>
        <p class="text-center mt-3">Already have an account? <a href="/auth/signin">Sign In</a></p>
    </div>
</div>