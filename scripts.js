window.onload = async function() {
    await loadFeed();
};
async function loadFeed() {
    const feedUrls = [
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.elcomercio.com/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.lahora.com.ec/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://www.teleamazonas.com/feed/",
        "https://api.rss2json.com/v1/api.json?rss_url=https://cnnespanol.cnn.com/feed/"
    ];

    try {
        const allItems = [];
        const addedLinks = new Set(); // Para rastrear artículos ya agregados

        const feedContainer = document.getElementById("feed");
        feedContainer.innerHTML = ""; // Limpiar contenido previo

        // Realizar solicitudes a todas las URLs de feeds
        for (const url of feedUrls) {
            const response = await fetch(url);
            const data = await response.json();
            if (data.items) {
                allItems.push(...data.items); // Combina los artículos
            } else {
                console.warn(`No se encontraron artículos en la URL: ${url}`);
            }
        }

        const keywords = ["elecciones", "candidatos", "democracia"]; // Palabras clave

        // Filtrar los artículos según las palabras clave
        const filteredItems = allItems.filter(item =>
            keywords.some(keyword => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword))
        );

        if (filteredItems.length > 0) {
            filteredItems.slice(0,3).forEach(item => {
                // Verifica si el enlace ya ha sido agregado
                if (!addedLinks.has(item.link)) {
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

                    // Agrega el enlace a la lista de artículos ya agregados
                    addedLinks.add(item.link);
                }
            });
        } else {
            feedContainer.innerHTML = "<p>No se encontraron artículos sobre elecciones 2025.</p>";
        }
    } catch (error) {
        console.error("Error al cargar el feed:", error);
    }
}


