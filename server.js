// server.js
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// La clé API sera récupérée depuis Vercel via variable d'environnement
const API_KEY = process.env.OPENROUTER_KEY;

app.post("/ai", async (req, res) => {
    const { messages } = req.body;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages,
                temperature: 0.8
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));