const accessToken = TOKE_FACEBOOK; // Reemplaza con tu token de acceso
        const query = 'elecciones Ecuador';
        const url = `https://graph.facebook.com/v14.0/search?q=${encodeURIComponent(query)}&type=post&access_token=${accessToken}`;
 
async function fetchPosts() {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                const data = await response.json();
                displayPosts(data.data);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Función para mostrar las publicaciones en la página
        function displayPosts(posts) {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = ''; // Limpiar el contenedor

            if (posts && posts.length > 0) {
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        <strong>Post ID:</strong> ${post.id}<br>
                        <strong>Mensaje:</strong> ${post.message ? post.message : 'No hay mensaje'}<br>
                        <strong>Fecha:</strong> ${post.created_time}<br>
                    `;
                    postsContainer.appendChild(postElement);
                });
            } else {
                postsContainer.innerHTML = '<p>No se encontraron publicaciones.</p>';
            }
        }

        // Ejecutar la función al cargar la página
        fetchPosts();




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
        const keywords = ["crisis","energética","luz","cortes","energía","feriado"]; // Palabras clave

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


async function fetchTweets() {
    const tweetsContainer = document.getElementById('tweets');
    tweetsContainer.innerHTML = '';

    try {
        const response = await fetch('./tweets.json');
        const data = await response.json();

        if (data && data.data) {
            data.data.forEach(tweet => {
                const tweetElement = document.createElement('p');
                tweetElement.textContent = tweet.text;
                tweetsContainer.appendChild(tweetElement);
            });
        } else {
            tweetsContainer.innerHTML = 'No se encontraron tweets.';
        }
    } catch (error) {
        tweetsContainer.innerHTML = 'Error al obtener tweets.';
    }
}

window.onload = fetchTweets;
