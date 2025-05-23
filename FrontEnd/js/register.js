document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Simple frontend validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.message || 'Registration failed');
                return;
            }

            // After successful registration, automatically log in the user
            const loginResponse = await fetch('http://localhost:3001/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                alert('Registration successful but login failed. Please log in manually.');
                window.location.href = 'login.html';
                return;
            }

            // Store the token and redirect
            localStorage.setItem('authToken', loginData.token);
            window.location.href = 'index.html';

        } catch (error) {
            alert('Connection error. Please try again.');
        }
    });
}); 