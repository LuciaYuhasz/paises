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

