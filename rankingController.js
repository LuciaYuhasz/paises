//rankingController.js

const fs = require('fs');
const path = require('path');
const rankingFilePath = path.join(__dirname, 'data', 'ranking.json');

// Guardar un nuevo puntaje en el ranking
const saveScore = (username, score, correct, incorrect, totalTime, callback) => {
    fs.readFile(rankingFilePath, 'utf8', (err, data) => {
        if (err) return callback(err);

        let rankings = JSON.parse(data || '[]');
        rankings.push({ player: username, score, correct, incorrect, totalTime });

        rankings.sort((a, b) => b.score - a.score); // Ordenar por puntaje
        rankings = rankings.slice(0, 20); // Mantener los mejores 20 jugadores

        fs.writeFile(rankingFilePath, JSON.stringify(rankings, null, 2), 'utf8', (writeErr) => {
            if (writeErr) return callback(writeErr);

            const position = rankings.findIndex(entry => entry.player === username) + 1;
            callback(null, { message: "Puntaje guardado correctamente", position });
        });
    });
};

// Obtener ranking
const getRanking = (req, res) => {
    fs.readFile(rankingFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Error al leer el ranking." });

        try {
            const rankings = JSON.parse(data);
            res.json(rankings);
        } catch (parseError) {
            res.status(500).json({ error: "Error al interpretar los datos del ranking." });
        }
    });
};

module.exports = { saveScore, getRanking };
