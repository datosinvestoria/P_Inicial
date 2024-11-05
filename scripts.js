window.onload = async function() {
    await loadFeed();
};

async function loadFeed() {
    const feedUrls = [
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.elcomercio.com/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.lahora.com.ec/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.teleamazonas.com/feed/"
    ];

    try {
        const allItems = [];

        // Realizar solicitudes a todas las URLs de feeds
        for (const url of feedUrls) {
            const response = await fetch(url);
            const data = await response.json();
            allItems.push(...data.items); // Combina los artículos
        }

        const feedContainer = document.getElementById("feed");
        const keywords = ["crisis","energética","luz","cortes","energía","feriado"]; // Palabras clave

        // Filtrar los artículos según las palabras clave
        const filteredItems = allItems.filter(item => 
            keywords.some(keyword => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword))
        );

        if (filteredItems.length > 0) {
            filteredItems.slice(0, 5).forEach(item => {
                const itemContainer = document.createElement("div");
                itemContainer.className = "feed-item";

               // Obtener la imagen del artículo
                let imgUrl = '';
                if (item.enclosure && item.enclosure.url) {
                    imgUrl = item.enclosure.url; // Usar la URL de la imagen del artículo
                } else if (item.thumbnail) {
                    imgUrl = item.thumbnail; // O usar una miniatura si está disponible
                }

                // Mostrar la imagen del artículo, si está disponible
                if (imgUrl) {
                    const img = document.createElement("img");
                    img.src = imgUrl;
                    img.className = "feed-image"; // Clase CSS para la imagen
                    itemContainer.appendChild(img);
                }
                const title = document.createElement("h2");
                title.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
                itemContainer.appendChild(title);

                const description = document.createElement("p");
                description.textContent = item.description || "No hay descripción disponible.";
                itemContainer.appendChild(description);

                feedContainer.appendChild(itemContainer);
            });
        } else {
            feedContainer.innerHTML = "<p>No se encontraron artículos sobre elecciones 2025.</p>";
        }
    } catch (error) {
        console.error("Error al cargar el feed:", error);
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
 
