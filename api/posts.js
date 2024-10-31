
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const accessToken = process.env.TOKEN_FACEBOOK; // Obtiene el token de las variables de entorno
    const query = 'elecciones Ecuador';
    const url = `https://graph.facebook.com/v14.0/search?q=${encodeURIComponent(query)}&type=post&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la solicitud a Facebook: ' + response.statusText);
        }
        const data = await response.json();
        res.status(200).json(data.data); // Devuelve los datos
    } catch (error) {
        console.error('Error al obtener publicaciones de Facebook:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
}
