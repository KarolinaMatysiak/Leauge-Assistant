let championRoles;
let allChampions = []; // Store all champions for filtering

//funkcja odpowiedzialna za filtrowanie postaci
async function championFilter() {
    const selectedRoles = championRoles.filter(role => 
        document.getElementById(role).checked
    );

    // Fetch filtered champions from backend
    try {
        let url = new URL('http://localhost:3000/champions');
        
        // Add selected roles to query parameters
        if (selectedRoles.length > 0) {
            selectedRoles.forEach(role => {
                url.searchParams.append('roles', role);
            });
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const filteredChampions = await response.json();
        
        if (filteredChampions.length === 0) {
            // If no champions found, show a message
            const championsGallery = document.querySelector("#champions-gallery");
            championsGallery.innerHTML = '<p class="no-results">No champions found with all selected roles.</p>';
        } else {
            displayChampions(filteredChampions);
        }
    } catch (error) {
        console.error('Error fetching filtered champions:', error);
    }
}

// Helper function to display champions
function displayChampions(champions) {
    const championsGallery = document.querySelector("#champions-gallery");
    
    const images = champions.map((x) => {
        const imageContainer = document.createElement("div");
        const image = document.createElement("img");
        const imgLabel = document.createElement("label");

        imageContainer.className = "img-container"

        image.className = "gallery-photo";
        image.src = x.imgUrl;
        image.alt = x.name;

        imgLabel.id = x.name;
        imgLabel.className = "gallery-label";
        imgLabel.innerHTML = x.name;

        imageContainer.replaceChildren(image, imgLabel);

        return imageContainer;
    });

    championsGallery.replaceChildren(...images);
}

//odpalanie funkcji
fetch('http://localhost:3000/champions')
    .then(response => response.json())
  .then((championJson) => {
        allChampions = championJson; // Store all champions
        
    // Extract unique tags from ChampionTags array
    championRoles = [...new Set(championJson.flatMap(champion => 
      champion.ChampionTags.map(tag => tag.tag)
    ))];

      const checkBoxSelector = document.querySelector("#roles");

      const roles = championRoles.map((y) => {
      const roleContainer = document.createElement("div");
      const roleLabel = document.createElement("label");
      const roleCheckBox = document.createElement("input");

      roleContainer.className = "role-container"
      roleLabel.className = "role-label";
      roleLabel.innerHTML = y;
      roleCheckBox.className = "champ-checkbox";
      roleCheckBox.type = "checkbox";
            roleCheckBox.id = y;
            roleCheckBox.onclick = championFilter;

      roleContainer.replaceChildren(roleCheckBox, roleLabel);

      return roleContainer;
    });

    checkBoxSelector.replaceChildren(...roles);

        // Display all champions initially
        displayChampions(championJson);
    })
    .catch(error => {
        console.error('Error fetching champions:', error);
  });
