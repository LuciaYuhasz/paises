const fs = require('fs');
const path = require('path');
const rankingFilePath = path.join(__dirname, 'data', 'ranking.json');
// ranking una sola vez en memoria
let rankings = [];
try {
    const data = fs.readFileSync(rankingFilePath, 'utf8');
    rankings = JSON.parse(data || '[]');
} catch (error) {
    console.error("Error leyendo el ranking al iniciar:", error.message);
}


// Guardar un nuevo puntaje en el ranking
const saveScore = async (username, score, correct, incorrect, totalTime, avgTimePerQuestion) => {
    try {

        rankings.push({ player: username, score, correct, incorrect, totalTime, avgTimePerQuestion });

        // Ordenar el ranking por puntaje y luego por tiempo total (menor tiempo mejor)
        rankings.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score; // Primero se ordena por puntaje
            }
            return a.totalTime - b.totalTime; // Si hay empate, el que jugó en menos tiempo tiene mejor posición
        });

        // Mantener solo los mejores 20 jugadores
        rankings = rankings.slice(0, 20);
        console.log("Rankings antes de guardar:", rankings);

        await fs.promises.writeFile(rankingFilePath, JSON.stringify(rankings, null, 2), 'utf8');
        console.log("Guardado exitosamente!");

        //const position = rankings.findIndex(entry => entry.player === username) + 1;

        const index = rankings.findIndex(entry => entry.player === username);
        const position = index !== -1 ? index + 1 : null;
        return {
            message: "Puntaje guardado correctamente",
            position: position, // puede ser null
            included: position !== null
        };



    } catch (error) {
        console.error("Error guardando el ranking:", error.message);
        throw new Error(`Error al guardar el ranking:  ${error.message}`);
    }
};

// Leer el ranking (para el getRanking y getRankingPage)
const readRankingData = async () => {
    try {
        const data = await fs.promises.readFile(rankingFilePath, 'utf8');
        const rankingData = JSON.parse(data || '[]');
        return rankingData;
    } catch (error) {
        console.error("Error leyendo el ranking:", error.message);
        throw error;
    }
};

// Obtener ranking
const getRanking = async (req, res) => {
    try {
        const rankings = await readRankingData();

        if (!rankings || rankings.length === 0) {
            return res.status(404).json({ message: "⚠️ No hay datos de ranking disponibles." });
        }

        res.json(rankings);
    } catch (error) {
        console.error("Error al leer el ranking:", error.message);
        res.status(500).json({ error: `Error al obtener el ranking:${error.message}` });
    }
};

const getRankingPage = async (req, res) => {
    try {
        const rankingData = await readRankingData();
        res.render('ranking', { ranking: rankingData });
    } catch (error) {
        console.error("Error al obtener el ranking:", error);
        res.render('ranking', { ranking: [] });
    }
};

module.exports = { saveScore, getRanking, readRankingData, getRankingPage };
