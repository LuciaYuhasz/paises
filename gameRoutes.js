const express = require('express');
const { saveScore, getRanking } = require('./rankingController');

const router = express.Router();

// // POST /api/submit-score. Guarda un nuevo puntaje
router.post('/submit-score', async (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { username, score, correct, incorrect, totalTime, avgTimePerQuestion } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Falta el nombre de usuario." });
    }

    try {
        const result = await saveScore(username, score, correct, incorrect, totalTime, avgTimePerQuestion);
        res.json(result);
    } catch (error) {
        console.error("Error al guardar el ranking (POST /submit-score):", error.message);
        res.status(500).json({ message: "Error al guardar el ranking." });
    }
});

// GET /api/ranking . Devuelve el top de jugadores
router.get('/ranking', getRanking);

module.exports = router;
