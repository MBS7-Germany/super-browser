const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// Hier trägst du deine E-Mail ein – diese darf den Browser nutzen
const authorizedUsers = ["deine-email@web.de", "test@user.com"];

app.get('/tunnel', async (req, res) => {
    const { url, email } = req.query;

    if (!authorizedUsers.includes(email)) {
        return res.status(403).send("Zugriff verweigert: Kein Abo aktiv.");
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            responseType: 'arraybuffer'
        });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        res.status(500).send("PC-Tunneling Fehler.");
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server ist bereit!"));
