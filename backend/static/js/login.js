import { login } from './api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = document.getElementById('login-button');
    const errorContainer = document.getElementById('error-container');

    // Clear previous errors
    errorContainer.innerHTML = '';

    // Show loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading"><span class="spinner"></span> Signing in...</span>';

    try {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('remember_me') === 'on';

        const response = await login(email, password, rememberMe);

        if (response && response.user) {
            // Redirect to dashboard
            window.location.href = '/';
        }
    } catch (error) {
        // Show error message
        errorContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> ${error.message}
            </div>
        `;
    } finally {
        // Reset button state
        button.disabled = false;
        button.innerHTML = 'Sign In';
    }
});

// Check if user is already logged in
if (localStorage.getItem('access_token')) {
    window.location.href = '/';
}
