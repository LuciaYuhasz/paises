//const { getNewQuestion, evaluateAnswer, resetGame, getGameState } = require('./game');
const fs = require('fs');
const path = require('path');
const rankingFilePath = path.join(__dirname, 'data', 'ranking.json');

// Obtener nueva pregunta
const getQuestion = async (req, res) => {
    try {
        const questionData = await getNewQuestion();
        res.json(questionData);
    } catch (error) {
        console.error("Error al generar la pregunta:", error);
        res.status(500).json({ error: 'Error al generar la pregunta.' });
    }
};

// Enviar respuesta del usuario
const submitAnswer = (req, res) => {
    try {
        const result = evaluateAnswer(req.body.answer);
        res.json(result);
    } catch (error) {
        console.error("Error al procesar la respuesta:", error);
        res.status(500).json({ error: 'Error al procesar la respuesta.' });
    }
};