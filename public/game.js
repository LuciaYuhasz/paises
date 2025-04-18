// public/game.js

let countries = [];
let usedCountries = [];
let currentQuestionIndex = 0;
let correct = 0;
let incorrect = 0;
let score = 0;
let startTime;
let username = '';

const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const registerForm = document.getElementById('registerForm');
const gameArea = document.getElementById('gameArea');
const startGameButton = document.getElementById('startGameButton');
const usernameInput = document.getElementById('username');

startGameButton.addEventListener('click', async () => {
    username = usernameInput.value.trim();
    if (!username) return alert('Ingresa tu nombre.');

    registerForm.style.display = 'none';
    gameArea.style.display = 'block';
    startTime = Date.now();

    await loadCountries();
    generateQuestion();
});

async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
    } catch (error) {
        alert("No se pudieron cargar los países.");
        console.error(error);
    }
}