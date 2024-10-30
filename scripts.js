 async function loadFeed() {
            try {
                const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.elcomercio.com/feed/");
                const data = await response.json();
                console.log(data); 

                const feedContainer = document.getElementById("feed");
                const keywords = ["elecciones", "2025", "candidatos", "voto", "elección"]; // Palabras clave

                const filteredItems = data.items.filter(item => 
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
