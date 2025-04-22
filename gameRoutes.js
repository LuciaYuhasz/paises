const express = require('express');
const { saveScore, getRanking } = require('./rankingController');

const router = express.Router();


// Ruta para enviar puntaje al ranking
router.post('/submit-score', (req, res) => {
    const { username, score, correct, incorrect, totalTime } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Falta el nombre de usuario." });
    }

    saveScore(username, score, correct, incorrect, totalTime, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al guardar el ranking." });
        }
        res.json(result);
    });
});

// Ruta para obtener el ranking
router.get('/ranking', getRanking);

module.exports = router;
