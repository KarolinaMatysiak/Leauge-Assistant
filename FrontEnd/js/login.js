document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login form');
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || 'index.html';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Simple frontend validation - just check if fields are not empty
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Display the error message from the backend
                alert(data.message || 'Login failed');
                return;
            }

            // Store the token and redirect
            localStorage.setItem('authToken', data.token);
            window.location.href = returnUrl;

        } catch (error) {
            alert('Connection error. Please try again.');
        }
    });
}); 