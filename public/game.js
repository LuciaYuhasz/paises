// public/game.js
// sonido de tipeo
const keypressSound = new Audio('sounds/tipeo.mp3');
// Archivo de sonido para el botón challe acepto
const buttonClickSound = new Audio('sounds/chalentacept.mp3');
//sonido de correcto e incorrecto 
// Sonidos para respuestas
const correctSound = new Audio('sounds/correcto.mp3'); // Sonido para respuestas correctas
const incorrectSound = new Audio('sounds/incorrecto.mp3'); // Sonido para respuestas incorrectas


//sonido de fondo

const backgroundMusic = new Audio('sounds/fondoJuego.mp3');
backgroundMusic.loop = true; // Reproduce en bucle
backgroundMusic.volume = 0.5; // Ajusta el volumen inicial
let isMusicMuted = false; // Variable global para controlar si la música está silenciada
const toggleMusicButton = document.getElementById('toggleMusicButton');
const musicControl = document.getElementById('musicControl'); // Contenedor del botón para silenciar música

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


// Agregar el evento al campo de texto
usernameInput.addEventListener('input', () => {
    keypressSound.pause(); // Reinicia el sonido por si es muy corto
    keypressSound.volume = 0.2;
    keypressSound.currentTime = 0;
    keypressSound.play();
});

startGameButton.addEventListener('click', async () => {
    //reproducir sonido boton chalentacept
    buttonClickSound.pause(); // Reinicia el sonido si ya está reproduciéndose
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
    username = usernameInput.value.trim();
    if (!username) return alert('Ingresa tu nombre.');


    // Reproduce la música al iniciar el juego, si no está silenciada
    if (!isMusicMuted) {
        backgroundMusic.play();
        // Muestra el botón para silenciar música
        musicControl.style.display = 'block'; // Hacer visible el botón
    }

    // Cambia la visibilidad de las secciones

    registerForm.style.display = 'none';
    gameArea.style.display = 'block';
    startTime = Date.now();

    await loadCountries();
    generateQuestion();
});

toggleMusicButton.addEventListener('click', () => {
    if (isMusicMuted) {
        backgroundMusic.play();
        toggleMusicButton.innerHTML = '<i class="bi bi-volume-up"></i> Silenciar Música';
    } else {
        backgroundMusic.pause();
        toggleMusicButton.innerHTML = '<i class="bi bi-volume-mute"></i> Reanudar Música';
    }
    isMusicMuted = !isMusicMuted;
    localStorage.setItem('isMusicMuted', isMusicMuted); // Guarda la preferencia
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
function updateProgressBar() {
    const progress = (currentQuestionIndex / 5) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;
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
    //con modal
    const modal = document.getElementById('resultModal');
    const modalMessage = document.getElementById('modalMessage');

    questionText.innerHTML = flag ? `<img src="${flag}" alt="Bandera" style="width:100px;"><br>${question}` : question;
    optionsList.innerHTML = '';

    options.forEach((option, index) => {  // aca agregue en index para que pueda implementar el estilo css y la ubicacionde cada elemnto 
        const li = document.createElement('li');
        li.textContent = option;
        //estilo css
        li.classList.add('list-group-item'); // Clase básica con animaciones
        li.style.animationDelay = `${index * 0.2}s`; // Retraso dinámico para cada opción
        li.onclick = () => {
            //color para correcta o incorrecto
            // Deshabilitar todas las opciones para evitar múltiples clics
            const allOptions = document.querySelectorAll('#optionsList li');
            allOptions.forEach(opt => opt.onclick = null); // Elimina onclick

            const isCorrect = option.toString().toLowerCase() === correctAnswer.toString().toLowerCase();
            if (isCorrect) {
                //aca estilo 
                li.classList.add('correct-answer');
                //
                correctSound.pause(); // Reinicia el sonido si se está reproduciendo
                correctSound.currentTime = 0;
                correctSound.play(); // Reproduce el sonido de respuesta correcta

                score += type === 'flag' ? 5 : 3;
                correct++;
                modalMessage.textContent = "✅ ¡Correcto!";
            } else {

                //estilo
                li.classList.add('incorrect-answer');
                //
                incorrectSound.pause(); // Reinicia el sonido si se está reproduciendo
                incorrectSound.currentTime = 0;
                incorrectSound.play(); // Reproduce el sonido de respuesta incorrecta
                incorrect++;
                modalMessage.textContent = `❌ Incorrecto. La respuesta era: ${correctAnswer}`;
            }

            // Mostrar el modal
            modal.style.display = "flex";

            //Cerrar el modal y pasar a la siguiente pregunta
            document.getElementById('closeModalButton').onclick = () => {
                modal.style.display = "none";
                currentQuestionIndex++;
                updateProgressBar();
                generateQuestion();
            };
        };
        setTimeout(() => {
            li.style.opacity = 1; // Hace visible la opción
            li.style.transform = 'translateY(0)'; // Posición final
        }, index * 200); // Retraso por índice

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
