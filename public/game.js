//public/index.html

// Definición de sonidos para efectos de juego
const keypressSound = new Audio('sounds/tipeo.mp3'); // Sonido al escribir
const buttonClickSound = new Audio('sounds/chalentacept.mp3'); // Sonido al hacer clic en botón
const correctSound = new Audio('sounds/correcto.mp3'); // Sonido para respuestas correctas
const incorrectSound = new Audio('sounds/incorrecto.mp3'); // Sonido para respuestas incorrectas
const backgroundMusic = new Audio('sounds/fondoJuego.mp3'); // Música de fondo del juego

backgroundMusic.loop = true; // Reproducir música en bucle
backgroundMusic.volume = 0.5; // Volumen inicial de la música
let isMusicMuted = false; // Estado de silenciamiento de la música
const toggleMusicButton = document.getElementById('toggleMusicButton'); // Botón para silenciar o reanudar música
const musicControl = document.getElementById('musicControl'); // Contenedor del control de música

// Variables de juego y estado
let countries = []; // Array para almacenar países
let usedCountries = []; // Array para países usados en el juego
let currentQuestionIndex = 0; // Índice de la pregunta actual
let correct = 0; // Contador de respuestas correctas
let incorrect = 0; // Contador de respuestas incorrectas
let score = 0; // Puntaje total del juego
let startTime; // Tiempo de inicio del juego
let username = ''; // Nombre de usuario

// Elementos del DOM
const questionText = document.getElementById('questionText'); // Texto de la pregunta
const optionsList = document.getElementById('optionsList'); // Lista de opciones
const registerForm = document.getElementById('registerForm'); // Formulario de registro
const gameArea = document.getElementById('gameArea'); // Área de juego
const startGameButton = document.getElementById('startGameButton'); // Botón para iniciar juego
const usernameInput = document.getElementById('username'); // Entrada de nombre de usuario

// Evento al escribir en el campo de nombre de usuario
usernameInput.addEventListener('input', () => {
    // Reproducir sonido de tipeo
    keypressSound.pause();
    keypressSound.volume = 0.2;
    keypressSound.currentTime = 0;
    keypressSound.play();
});
///////////////
function startGame() {
    console.log("startGame() ejecutado"); // Verifica que la función se está llamando
    console.log("Ocultando formulario y mostrando área de juego...");

    buttonClickSound.pause();
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();

    username = usernameInput.value.trim();
    if (!username) return alert('Ingresa tu nombre.');

    // Reproduce la música al iniciar el juego, si no está silenciada
    if (!isMusicMuted) {
        backgroundMusic.play();
        musicControl.style.display = 'block';
    }

    // Reinicia el juego
    currentQuestionIndex = 0;
    correct = 0;
    incorrect = 0;
    score = 0;
    usedCountries = [];
    startTime = Date.now();

    // Limpia la interfaz
    optionsList.innerHTML = "";
    questionText.textContent = "";
    document.getElementById("progressBar").style.width = "0%";

    // Oculta el formulario de registro y el modal final
    registerForm.style.display = 'none';
    document.getElementById('gameResultModal').style.display = "none";

    // Verifica si `gameArea` existe antes de cambiar su estilo
    if (gameArea) {
        console.log("gameArea encontrado, cambiando display a block...");
        gameArea.style.display = "block";
    } else {
        console.error("Error: gameArea no encontrado en el DOM.");
    }

    // Intenta generar la primera pregunta
    loadCountries().then(() => {
        console.log("Datos de países cargados, generando primera pregunta...");
        generateQuestion();
    }).catch(err => {
        console.error("Error al cargar países:", err);
    });
}


// Asignamos la función 'startGame' al botón de inicio
startGameButton.addEventListener('click', startGame);

// También asignamos la función 'startGame' al botón "Jugar de nuevo"
document.getElementById('closeResultModalButton').addEventListener('click', startGame);

// Evento al hacer clic en el botón para iniciar el juego
/*startGameButton.addEventListener('click', async () => {
    // Reproducir sonido del botón "chalente acepto"
    buttonClickSound.pause();
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();

    // Obtener nombre de usuario y verificar que no esté vacío
    username = usernameInput.value.trim();
    if (!username) return alert('Ingresa tu nombre.');

    // Reproducir música de fondo si no está silenciada
    if (!isMusicMuted) {
        backgroundMusic.play();
        musicControl.style.display = 'block'; // Mostrar control de música
    }
    // Ocultar formulario de registro y mostrar área de juego
    registerForm.style.display = 'none';
    gameArea.style.display = 'block';
    startTime = Date.now(); // Registrar tiempo de inicio del juego
    // Cargar datos de países y generar primera pregunta
    await loadCountries();
    generateQuestion();
});*/


// Evento para silenciar o reanudar la música de fondo
toggleMusicButton.addEventListener('click', () => {
    if (isMusicMuted) {
        backgroundMusic.play();
        toggleMusicButton.innerHTML = '<i class="bi bi-volume-up"></i> Silenciar Música';
    } else {
        backgroundMusic.pause();
        toggleMusicButton.innerHTML = '<i class="bi bi-volume-mute"></i> Reanudar Música';
    }
    isMusicMuted = !isMusicMuted;
    localStorage.setItem('isMusicMuted', isMusicMuted); // Guardar preferencia de música en localStorage
});

// Función asincrónica para cargar datos de países desde una API
async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json(); // Almacenar datos de países en la variable countries
    } catch (error) {
        alert("No se pudieron cargar los países."); // Alerta en caso de error al cargar países
        console.error(error);
    }
}

// Función para actualizar la barra de progreso del juego
function updateProgressBar() {
    const progress = (currentQuestionIndex / 5) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;
}


// Función para generar y mostrar una pregunta aleatoria
function generateQuestion() {
    if (currentQuestionIndex >= 5) {
        return endGame(); // Finalizar juego si se han mostrado todas las preguntas
    }

    let country;
    do {
        country = countries[Math.floor(Math.random() * countries.length)];
    } while (usedCountries.includes(country.name.common));

    usedCountries.push(country.name.common); // Agregar país usado al array

    // Definir tipos de preguntas disponibles
    const types = ['capital', 'flag', 'borders'];
    const type = types[Math.floor(Math.random() * types.length)]; // Seleccionar tipo de pregunta aleatoriamente

    let question = '';
    let correctAnswer = '';
    let options = [];

    switch (type) {
        case 'capital':
            if (!country.capital) return generateQuestion(); // Evitar preguntas sin capital definida
            question = `¿Cuál es el país de la capital ${country.capital[0]}?`;
            correctAnswer = country.name.common;
            options = generateOptions(correctAnswer); // Generar opciones de respuesta
            break;
        case 'flag':
            if (!country.flags || !country.flags.png) return generateQuestion(); // Evitar países sin bandera
            question = `¿Qué país está representado por esta bandera?`;
            correctAnswer = country.name.common;
            options = generateOptions(correctAnswer); // Generar opciones de respuesta
            break;
        case 'borders':
            question = `¿Cuántos países limítrofes tiene ${country.name.common}?`;
            correctAnswer = country.borders ? country.borders.length : 0; // Obtener número de países limítrofes
            options = generateNumericOptions(correctAnswer); // Generar opciones numéricas de respuesta
            break;
    }
    // Mostrar la pregunta y opciones en pantalla
    displayQuestion({ question, type, correctAnswer, options, flag: country.flags?.png });
}


// Función para mostrar la pregunta y opciones en pantalla
function displayQuestion({ question, options, correctAnswer, type, flag }) {
    const questionModal = document.getElementById('questionResultModal');
    const modalMessageQuestion = document.getElementById('modalMessageQuestion');

    // Mostrar pregunta con la bandera si está disponible
    questionText.innerHTML = flag ? `<img src="${flag}" alt="Bandera" style="width:100px;"><br>${question}` : question;
    optionsList.innerHTML = ''; // Limpiar lista de opciones

    // Mostrar cada opción como elemento de lista
    options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.classList.add('list-group-item'); // Estilo básico con animaciones
        li.style.animationDelay = `${index * 0.2}s`; // Retraso dinámico para cada opción

        li.onclick = () => {
            const allOptions = document.querySelectorAll('#optionsList li');
            allOptions.forEach(opt => opt.onclick = null); // Deshabilitar clic en opciones

            const isCorrect = option.toString().toLowerCase() === correctAnswer.toString().toLowerCase();

            if (isCorrect) {
                li.classList.add('correct-answer'); // Estilo para respuesta correcta
                correctSound.pause();
                correctSound.currentTime = 0;
                correctSound.play(); // Reproducir sonido de respuesta correcta
                score += type === 'flag' ? 5 : 3; // Aumentar puntaje según tipo de pregunta
                correct++;
                modalMessageQuestion.textContent = "✅ ¡Correcto!";
            } else {
                li.classList.add('incorrect-answer'); // Estilo para respuesta incorrecta
                incorrectSound.pause();
                incorrectSound.currentTime = 0;
                incorrectSound.play(); // Reproducir sonido de respuesta incorrecta
                incorrect++;
                modalMessageQuestion.textContent = `❌ Incorrecto. La respuesta era: ${correctAnswer}`;
            }

            questionModal.style.display = "flex"; // Mostrar modal de resultado

            // Cerrar modal y avanzar a la siguiente pregunta
            document.getElementById('closeQuestionModalButton').onclick = () => {
                questionModal.style.display = "none";
                currentQuestionIndex++;
                updateProgressBar();
                generateQuestion();
            };
        };

        setTimeout(() => {
            li.style.opacity = 1; // Hacer visible la opción con animación
            li.style.transform = 'translateY(0)'; // Posición final
        }, index * 200); // Retraso por índice

        optionsList.appendChild(li); // Agregar opción a la lista
    });
}

// Función para generar opciones de respuesta
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
    const totalTime = (Date.now() - startTime) / 1000; // Calcula el tiempo total jugado
    const avgTimePerQuestion = (totalTime / 5).toFixed(3); // Calcula el tiempo promedio por pregunta

    fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score, correct, incorrect, totalTime })
    })
        .then(res => res.json())
        .then(data => {
            // Obtener los elementos del modal
            const gameModal = document.getElementById('gameResultModal');
            const modalMessage = document.getElementById('modalMessage');
            const modalDetails = document.getElementById('modalDetails');
            const modalRanking = document.getElementById('modalRanking');

            // Rellena el mensaje del modal con los resultados
            modalMessage.innerHTML = `<strong>🎉 Juego terminado</strong>`;
            modalDetails.innerHTML = `
                <p>Puntaje: <strong>${score}</strong></p>
                <p>Correctas: <strong>${correct}</strong></p>
                <p>Incorrectas: <strong>${incorrect}</strong></p>
                <p>Tiempo total: <strong>${totalTime.toFixed(3)} segundos</strong></p>
                <p>Tiempo promedio por pregunta: <strong>${avgTimePerQuestion} segundos</strong></p>
            `;

            // Mensaje de ranking con la posición del jugador
            modalRanking.innerHTML = `🎯 ¡Has alcanzado la posición <strong>${data.position}</strong> en el ranking!`;

            // Mostrar el modal
            gameModal.style.display = "flex";

            // Asignar evento al botón "Jugar de nuevo"
            document.getElementById('closeResultModalButton').onclick = startGame;
        })
        .catch(err => {
            console.error("Error al guardar el resultado:", err);
            alert("Ocurrió un error al guardar el puntaje.");
        });
}
/////////////////////////////////


























/*// public/game.js
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
*/