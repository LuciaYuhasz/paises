const express = require('express');
const { saveScore, getRanking } = require('./rankingController');

const router = express.Router();

// Ruta para enviar puntaje al ranking
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
        res.status(500).json({ message: "Error al guardar el ranking." });
    }
});

router.get('/ranking', getRanking);

module.exports = router;
