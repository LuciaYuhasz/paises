const fs = require('fs');
const path = require('path');
const MAX_RANKING_SIZE = 20;
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
        //  Agregar nuevo puntaje
        rankings.push({ player: username, score, correct, incorrect, totalTime, avgTimePerQuestion });
        console.log(`📥 Recibido: ${username} con puntaje ${score}`);

        // Ordenar el ranking por puntaje y luego por tiempo total 
        rankings.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score; // Primero se ordena por puntaje
            return a.totalTime - b.totalTime; // Si hay empate, el que jugó en menos tiempo tiene mejor posición
        });

        // 3. Guardar posición antes de recortar
        const indexBeforeCut = rankings.findIndex(entry => entry.player === username);
        const positionBeforeCut = indexBeforeCut !== -1 ? indexBeforeCut + 1 : null;

        // Mantener solo los mejores 20 jugadores, 
        rankings = rankings.slice(0, MAX_RANKING_SIZE);
        console.log("Rankings antes de guardar:", rankings);

        // Verificar si quedó dentro del top 20
        const indexFinal = rankings.findIndex(entry => entry.player === username);
        const positionFinal = indexFinal !== -1 ? indexFinal + 1 : null;

        if (positionFinal !== null) {
            console.log(`${username} guardado en el TOP 20 con puntaje ${score}. Posición final: ${positionFinal}`);
        } else {
            console.log(`${username} NO quedó en el top 20. Posición previa al recorte: ${positionBeforeCut}`);
        }

        //  Guardar en archivo
        await fs.promises.writeFile(rankingFilePath, JSON.stringify(rankings, null, 2), 'utf8');
        console.log("Guardado exitosamente!");

        return {
            message: "Puntaje guardado correctamente",
            position: positionFinal,
            included: positionFinal !== null
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
        console.log("Enviando ranking con", rankings.length, "jugadores.");
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
