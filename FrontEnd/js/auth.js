// Function to check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Function to update navigation based on auth state
function updateNavigation() {
    const loginButtons = document.querySelectorAll('.login-btn, a[href="login.html"]');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    if (isLoggedIn()) {
        // Hide login buttons, show logout buttons
        loginButtons.forEach(btn => btn.style.display = 'none');
        logoutButtons.forEach(btn => btn.style.display = 'block');
    } else {
        // Show login buttons, hide logout buttons
        loginButtons.forEach(btn => btn.style.display = 'block');
        logoutButtons.forEach(btn => btn.style.display = 'none');
    }
}

// Function to handle logout
async function handleLogout(e) {
    e.preventDefault(); // Prevent the default link behavior
    try {
        const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            // Remove token from localStorage
            localStorage.removeItem('authToken');
            // Update navigation
            updateNavigation();
            // Redirect to home page
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();

    // Add event listeners to logout buttons
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
}); 