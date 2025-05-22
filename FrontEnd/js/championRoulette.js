let championRoles = [];

// Function to get the authentication token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Function to handle the roll button click
async function handleRoll() {
    const selectedRoles = championRoles.filter(role => 
        document.getElementById(role).checked
    );

    console.log('Selected roles:', selectedRoles);

    try {
        let url = new URL('http://localhost:3000/random-champion');
        
        // Add selected roles to query parameters
        selectedRoles.forEach(role => {
            url.searchParams.append('roles', role);
        });
        
        console.log('Sending request to:', url.toString());
        console.log('Auth token:', getAuthToken());

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken() || ''}`
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 401) {
                console.log('Authentication error - redirecting to login');
                // Redirect to login with return URL
                const returnUrl = encodeURIComponent(window.location.pathname);
                window.location.href = `login.html?returnUrl=${returnUrl}`;
                return;
            }
            if (response.status === 404) {
                console.log('No champions found for selected roles');
                // Show user-friendly message when no champions found
                const displayDiv = document.getElementById('championDisplay');
                displayDiv.innerHTML = `
                    <div class="champion-card" style="text-align: center; justify-content: center;">
                        <div class="champion-info">
                            <h3>No Champions Found</h3>
                            <p style="color: #965b6f; margin-top: 0.5rem;">
                                There are no champions that match all selected roles.<br>
                                Try selecting different role combinations!
                            </p>
                        </div>
                    </div>
                `;
                return;
            }

            const errorData = await response.json();
            console.error('Server error response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('Received champion data:', data);
        displayChampion({champion: data});
    } catch (error) {
        console.error('Detailed error:', error);
        alert('Error getting random champion. Please try again.');
    }
}

// Function to display the champion
function displayChampion(data) {
    const { champion, totalMatching, selectedRoles } = data;
    const displayDiv = document.getElementById('championDisplay');
    
    displayDiv.innerHTML = `
        <div class="champion-card">
            <div class="champion-image-container">
                <img src="${champion.imgUrl}" alt="${champion.name}" class="champion-image">
            </div>
            <div class="champion-info">
                <h3>${champion.name}</h3>
                <div class="champion-roles">
                    ${champion.ChampionTags.map(tag => 
                        `<span class="role-tag">${tag.tag}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

// Initialize the page
async function init() {
    try {
        const response = await fetch('http://localhost:3000/champions', {
            method: 'GET'
        });
        const championJson = await response.json();
        
        // Extract unique roles
        championRoles = [...new Set(championJson.flatMap(champion => 
            champion.ChampionTags.map(tag => tag.tag)
        ))];

        // Create role checkboxes
        const rolesContainer = document.getElementById('roles');
        const roleElements = championRoles.map(role => {
            const roleContainer = document.createElement('div');
            const roleLabel = document.createElement('label');
            const roleCheckbox = document.createElement('input');

            roleContainer.className = 'role-container';
            roleLabel.className = 'role-label';
            roleLabel.innerHTML = role;
            roleCheckbox.type = 'checkbox';
            roleCheckbox.id = role;
            roleCheckbox.className = 'role-checkbox';

            roleContainer.appendChild(roleCheckbox);
            roleContainer.appendChild(roleLabel);
            return roleContainer;
        });

        rolesContainer.replaceChildren(...roleElements);

        // Add event listener to roll button
        document.getElementById('rollButton').addEventListener('click', handleRoll);
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 