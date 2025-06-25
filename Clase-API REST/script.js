// Obtiene todos los personajes con paginación dinámica
async function getAllCharacters() {
    const container = document.getElementById('characterList');
    container.innerHTML = '<p>Cargando...</p>';

    try {
        let allCharacters = [];
        let page = 1;
        let totalPages = 1; // Inicializamos con 1 para la primera solicitud

        while (page <= totalPages) {
            const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
            const data = await response.json();
            if (page === 1) {
                totalPages = data.info.pages; // Actualizamos dinámicamente el total de páginas
            }
            allCharacters = allCharacters.concat(data.results);
            page++;
        }

        renderCharacters(allCharacters);
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Error al cargar personajes. Intenta de nuevo.</p>';
        console.error('Error:', error);
    }
}

// Filtra personajes según inputs
async function filterCharacters(event) {
    event.preventDefault(); // Evita recargar la página
    const container = document.getElementById('characterList');
    container.innerHTML = '<p>Cargando...</p>';

    const name = document.getElementById('name').value.trim();
    const status = document.getElementById('status').value.trim();
    const species = document.getElementById('species').value.trim();
    const type = document.getElementById('type').value.trim();
    const gender = document.getElementById('gender').value.trim();

    const query = new URLSearchParams({
        name: name || '',
        status: status || '',
        species: species || '',
        type: type || '',
        gender: gender || ''
    }).toString();

    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?${query}`);
        if (!response.ok) throw new Error('No se encontraron personajes.');
        const data = await response.json();
        renderCharacters(data.results);
        // Limpia los inputs después de filtrar
        document.getElementById('filterForm').reset();
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Error al filtrar. Verifica los filtros.</p>';
        console.error('Error:', error);
    }
}

// Renderiza cards de personajes
function renderCharacters(list) {
    const container = document.getElementById('characterList');
    container.innerHTML = list.length ? '' : '<p>No se encontraron personajes.</p>';

    list.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p><strong>Estado:</strong> ${character.status}</p>
            <p><strong>Especie:</strong> ${character.species}</p>
            <p><strong>Género:</strong> ${character.gender}</p>
        `;
        container.appendChild(card);
    });
}

// Event listeners
document.getElementById('getAllCharacters').addEventListener('click', getAllCharacters);
document.getElementById('filterForm').addEventListener('submit', filterCharacters);