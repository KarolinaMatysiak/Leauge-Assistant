
let championJson = {};
let championRoles;

//funkcja odpowiedzialna za filtrowanie postaci
async function championFilter(event)
{
   champId = event.target.id;
   checkBox = document.getElementById(champId);

   if ( checkBox.checked == true){
      
    }
}

//odpalanie funkcji
fetch('http://localhost:3000/champions').then(response => response.json())
  .then((championJson) => {
    championRoles = [...new Set(championJson.flatMap((x) => x.tags))];

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
      roleCheckBox.id=y
      roleCheckBox.onclick=championFilter;

      roleContainer.replaceChildren(roleCheckBox, roleLabel);

      return roleContainer;
    });

    checkBoxSelector.replaceChildren(...roles);

    return championJson;
  })
  .then((championJson) => {
    const championsGallery = document.querySelector("#champions-gallery");

      const images = championJson.map((x) => {
      const imageContainer = document.createElement("div");
      const image = document.createElement("img");
      const imgLabel = document.createElement("label");

      imageContainer.className="img-container"

      image.className = "gallery-photo";
      image.src = x.image;
      image.alt = x.name;

      imgLabel.id = x.name;
      imgLabel.className = "gallery-label";
      imgLabel.innerHTML = x.name;

      imageContainer.replaceChildren(image, imgLabel);

      return imageContainer;
    });

    championsGallery.replaceChildren(...images);
  });
