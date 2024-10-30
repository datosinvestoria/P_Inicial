async function loadFeed() {
    const feedUrls = [
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.elcomercio.com/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.lahora.com.ec/feed/", // Reemplaza con otra fuente
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.teleamazonas.com/feed/" // Agrega más fuentes según sea necesario
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
        const keywords = ["elecciones", "candidatos", "voto", "elección"]; // Palabras clave

        // Filtrar los artículos según las palabras clave
        const filteredItems = allItems.filter(item => 
            keywords.some(keyword => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword))
        );

        if (filteredItems.length > 0) {
            filteredItems.slice(0, 5).forEach(item => {
                const itemContainer = document.createElement("div");
                itemContainer.className = "feed-item";

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

