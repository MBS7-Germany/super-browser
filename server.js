const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());

// Verbindung zur Datenbank
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/tunnel', async (req, res) => {
    const { url, email } = req.query;

    // VOLLAUTOMATISCHER CHECK: Ist der Nutzer in der Datenbank als "bezahlt" markiert?
    const { data, error } = await supabase
        .from('users')
        .select('is_active')
        .eq('email', email)
        .single();

    if (error || !data || !data.is_active) {
        return res.status(403).send("Zugriff verweigert: Kein aktives Abo.");
    }

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
            responseType: 'arraybuffer'
        });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        res.status(500).send("PC-Tunnel Fehler.");
    }
});

app.listen(process.env.PORT || 3000);
