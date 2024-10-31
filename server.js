require('dotenv').config(); // Carga el archivo .env si trabajas localmente
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const accessToken = process.env.TOKEN_FACEBOOK;
const PORT = process.env.PORT || 3000;

app.get('/api/posts', async (req, res) => {
    const query = 'elecciones Ecuador';
    const url = `https://graph.facebook.com/v14.0/search?q=${encodeURIComponent(query)}&type=post&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la solicitud');
        const data = await response.json();
        res.json(data.data); // Envía los datos al cliente
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
