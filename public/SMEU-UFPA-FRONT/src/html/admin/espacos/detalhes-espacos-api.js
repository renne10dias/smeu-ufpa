// Function to get the query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to fetch data from the real API
async function fetchSpaceData() {
  try {
    // Use the function to get the UUID from the URL
    const uuid = getQueryParam('uuid');

    // Replace this URL with the actual endpoint of your API and append the UUID
    const response = await fetch(`http://localhost:8000/spaces/find/detalhes/${uuid}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the response as JSON
    const space = await response.json(); // Assuming the API returns an object with space details

    // Get container element
    const spacesContainer = document.getElementById('spacesContainer');

    const imageUrl = space.files.length > 0 ? space.files[0].path : ''; // Fallback if no image exists

    // Create dynamic HTML content
    const spaceHTML = `
      <div class="col-md-4">
        <div class="card">
          <img src="${imageUrl}" class="card-img-top" alt="${space.name}">
          <div class="card-body">
            <h5 class="card-title">${space.name}</h5>
            <br>
            <a href="#" class="btn btn-primary">Editar</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">Detalhes</div>
          <div class="card-body">
            <h5 class="card-title">Capacidade</h5>
            <p class="card-text">${space.capacity}</p>
            <h5 class="card-title">Tipo</h5>
            <p class="card-text">${space.type}</p>
            <h5 class="card-title">Equipamentos</h5>
            <p class="card-text">${space.equipment}</p>
            <h5 class="card-title">Localização</h5>
            <p class="card-text">${space.location}</p>
          </div>
        </div>
      </div>
    `;

    // Insert dynamic content into the container
    spacesContainer.innerHTML = spaceHTML;
  } catch (error) {
    console.error('Error fetching space data:', error);
  }
}

// Call the function to fetch and display the space data
fetchSpaceData();
