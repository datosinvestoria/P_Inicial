window.onload = async function() {
    await loadFeed();
};

async function loadFeed() {
    const feedUrls = [
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.elcomercio.com/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.lahora.com.ec/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.teleamazonas.com/feed/"
    ];

    const allItems = [];
    const feedContainer = document.getElementById("feed");
    const keywords = ["crisis", "energética", "luz", "cortes", "energía", "feriado"]; // Palabras clave

    try {
        // Realizar solicitudes a todas las URLs de feeds
        for (const url of feedUrls) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Error en la respuesta: ${response.status}`);
                
                const data = await response.json();
                allItems.push(...data.items); // Combina los artículos
            } catch (error) {
                console.warn(`Error al cargar el feed de ${url}:`, error);
            }
        }

        // Filtrar y ordenar los artículos
        const filteredItems = allItems
            .filter(item => 
                keywords.some(keyword => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword))
            )
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)); // Ordenar por fecha, más recientes primero

        // Mostrar los artículos filtrados
        if (filteredItems.length > 0) {
            filteredItems.slice(0, 5).forEach(item => {
                const itemContainer = document.createElement("div");
                itemContainer.className = "feed-item";

                // Imagen del artículo
                if (item.thumbnail) {
                    const img = document.createElement("img");
                    img.src = item.thumbnail;
                    img.alt = "Imagen del artículo";
                    img.className = "feed-image";
                    itemContainer.appendChild(img);
                }

                // Título del artículo
                const title = document.createElement("h2");
                title.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
                itemContainer.appendChild(title);

                // Descripción del artículo
                const description = document.createElement("p");
                description.textContent = item.description
                    ? item.description.slice(0, 100) + "..." // Mostrar solo los primeros 100 caracteres
                    : "No hay descripción disponible.";
                itemContainer.appendChild(description);

                feedContainer.appendChild(itemContainer);
            });
        } else {
            feedContainer.innerHTML = "<p>No se encontraron artículos sobre las palabras clave.</p>";
        }
    } catch (error) {
        console.error("Error al cargar los feeds:", error);
        feedContainer.innerHTML = "<p>Error al cargar los feeds. Por favor, intenta de nuevo más tarde.</p>";
    }
}

// Cargar el feed al cargar la página
loadFeed();


const query = 'elecciones';
async function fetchTrendingData() {
    try {
        const response = await fetch(`https://p-inicial.vercel.app/.app/trending?query=${query}`); //Colocar URL del proyecto en Vercel
        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }
        const data = await response.json();
        displayTrendingData(data);
    } catch (error) {
        document.getElementById('trending-results').innerText = 'No se pudieron cargar los resultados de tendencias.';
        console.error(error);
    }
}
function displayTrendingData(data) {
    const trendingContainer = document.getElementById('trending-results');
    trendingContainer.innerHTML = '';
    data.forEach((item, index) => {
        const trendItem = document.createElement('div');
        trendItem.innerHTML = `<h3>${index + 1}. ${item.title}</h3><p>Interés: ${item.value}</p>`;
        trendingContainer.appendChild(trendItem);
    });
}
// Llamar a la función para obtener los datos.
fetchTrendingData();
 
