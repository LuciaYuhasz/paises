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

function generateQuestion() {
    if (currentQuestionIndex >= 5) {
        return endGame();
    }

    let country;
    do {
        country = countries[Math.floor(Math.random() * countries.length)];
    } while (usedCountries.includes(country.name.common));

    usedCountries.push(country.name.common);

    const types = ['capital', 'flag', 'borders'];
    const type = types[Math.floor(Math.random() * types.length)];

    let question = '';
    let correctAnswer = '';
    let options = [];

    switch (type) {
        case 'capital':
            if (!country.capital) return generateQuestion();
            question = `¿Cuál es el país de la capital ${country.capital[0]}?`;
            correctAnswer = country.name.common;
            options = generateOptions(correctAnswer);
            break;
        case 'flag':
            if (!country.flags || !country.flags.png) return generateQuestion();
            question = `¿Qué país está representado por esta bandera?`;
            correctAnswer = country.name.common;
            options = generateOptions(correctAnswer);
            break;
        case 'borders':
            question = `¿Cuántos países limítrofes tiene ${country.name.common}?`;
            correctAnswer = country.borders ? country.borders.length : 0;
            options = generateNumericOptions(correctAnswer);
            break;
    }

    displayQuestion({ question, type, correctAnswer, options, flag: country.flags?.png });
}

function displayQuestion({ question, options, correctAnswer, type, flag }) {
    questionText.innerHTML = flag ? `<img src="${flag}" alt="Bandera" style="width:100px;"><br>${question}` : question;
    optionsList.innerHTML = '';

    options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.onclick = () => {
            const isCorrect = option.toString().toLowerCase() === correctAnswer.toString().toLowerCase();
            if (isCorrect) {
                score += type === 'flag' ? 5 : 3;
                correct++;
                alert("✅ ¡Correcto!");
            } else {
                incorrect++;
                alert(`❌ Incorrecto. La respuesta era: ${correctAnswer}`);
            }
            currentQuestionIndex++;
            generateQuestion();
        };
        optionsList.appendChild(li);
    });
}

function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        const random = countries[Math.floor(Math.random() * countries.length)];
        options.add(random.name.common);
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}

function generateNumericOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        options.add(Math.floor(Math.random() * 10));
    }

    return Array.from(options).sort((a, b) => a - b);
}

function endGame() {
    const totalTime = (Date.now() - startTime) / 1000;

    fetch('/api/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score, correct, incorrect, totalTime })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(err => {
            console.error('Error al guardar el resultado:', err);
            alert("Ocurrió un error al guardar el puntaje.");
        });
}
/*git add . — agregaste los cambios
✅ git commit -m "comienzo del front" — creaste el commit con un mensaje claro
✅ git push — subiste los cambios a GitHub sin problemas*/