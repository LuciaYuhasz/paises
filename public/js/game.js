// IMPORTACION DE MODULOS
// Sonidos para distintas acciones del juego
import {
    keypressSound,
    buttonClickSound,
    correctSound,
    incorrectSound,
    //backgroundMusic,
    toggleMusic         // ESTA ES LA FUNCION QUE SUSTITUYE 
} from './sounds.js';

// Elementos y funciones de la interfaz de usuario (UI)
import {
    questionText,
    optionsList,
    registerForm,
    gameArea,
    usernameInput,
    startGameButton,
    toggleMusicButton,
    updateProgressBar,
    questionModal,
    modalMessageQuestion,
    setupHintHandler,
    initializeProgressBar,
    showPointsEarned
} from './ui.js';

// VARIABLES DE ESTADO Y JUEGO
let gameTimerInterval; // Intervalo del reloj
let countries = [];
let usedCountries = [];
let currentQuestionIndex = 0; // Índice de la pregunta actual
let correct = 0; // Contador de respuestas correctas
let incorrect = 0; // Contador de respuestas incorrectas
let score = 0; // Puntaje total del juego
let startTime;
let username = '';
let isMusicMuted = false;


// EVENTOS DE INTERFAZ
// sonido al escribir en el campo de nombre de usuario
usernameInput.addEventListener('input', () => {
    keypressSound.pause();
    keypressSound.volume = 0.2;
    keypressSound.currentTime = 0;
    keypressSound.play();
});

// Función para iniciar el juego
function startGame() {
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
    username = usernameInput.value.trim();// trim para eliminar espacios en blanco
    if (!username) return alert('Ingresa tu nombre.');
    // Reproduce la música al iniciar el juego, si no está silenciada
    musicControl.style.display = 'block';
    toggleMusic(isMusicMuted, toggleMusicButton);
    console.log(` Inicio del juego con el Usuario: ${username}`);


    // Reinicia el juego
    currentQuestionIndex = 0;
    correct = 0;
    incorrect = 0;
    score = 0;
    usedCountries = [];
    startTime = Date.now();

    const gameTimerElement = document.getElementById('gameTimer');
    clearInterval(gameTimerInterval); // Por si estaba corriendo de antes
    gameTimerElement.textContent = "⏱️ Tiempo: 0.00 s";

    gameTimerInterval = setInterval(() => {
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        gameTimerElement.textContent = `⏱️ Tiempo: ${elapsedSeconds} s`;
    }, 100);


    // Limpia la interfaz
    optionsList.innerHTML = "";
    questionText.textContent = "";
    initializeProgressBar();


    // Oculta el formulario de registro y el modal final
    registerForm.style.display = 'none';
    document.getElementById('gameResultModal').style.display = "none";

    // Verifica si `gameArea` existe antes de cambiar su estilo
    if (gameArea) {
        gameArea.style.display = "block";
    } else {
        console.error("Error: gameArea no encontrado en el DOM.");
    }

    // Intenta generar la primera pregunta
    loadCountries().then(() => {
        generateQuestion();
    }).catch(err => {
        console.error("Error al cargar países:", err);
    });
}

//EVENTO DE BOTONES
// Asigna la función 'startGame' al botón de inicio
startGameButton.addEventListener('click', startGame);

// A startGame al botón "Jugar de nuevo"
document.getElementById('closeResultModalButton').addEventListener('click', startGame);

// Evento para silenciar o reanudar la música de fondo
toggleMusicButton.addEventListener('click', () => {
    isMusicMuted = !isMusicMuted;
    console.log(`[🔊] Música ${isMusicMuted ? 'silenciada' : 'activada'}`);
    toggleMusic(isMusicMuted, toggleMusicButton);  // Ahora usa la función toggleMusic
});

// // Función asincrónica: carga países desde la API 
async function loadCountries() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none'; // Oculta errores anteriores
    errorContainer.textContent = '';
    console.log("[🌐] Cargando países desde la API...");
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');


        // Validar estado de respuesta HTTP
        if (!response.ok) {
            throw new Error(`No se pudo cargar la API de países ⚠️: ${response.status} ${response.statusText}`);
        }
        countries = await response.json();
    } catch (error) {

        console.error(error);
        errorContainer.textContent = `⚠️ ${error.message}`;
        errorContainer.style.display = 'block'; // Muestra el error en pantalla
    }
}
// Función para generar y mostrar una pregunta aleatoria
function generateQuestion() {
    if (currentQuestionIndex >= 10) {
        return endGame(); // Finaliza juego si se mostraron todas las preguntas
    }

    let country;
    do {
        country = countries[Math.floor(Math.random() * countries.length)];
    } while (usedCountries.includes(country.name.common));
    usedCountries.push(country.name.common); // Agregar país usado al array
    // Tipos de preguntas posibles
    const types = ['capital', 'flag', 'borders'];
    const type = types[Math.floor(Math.random() * types.length)];
    let question = '';
    let correctAnswer = '';
    let options = [];
    switch (type) {
        case 'capital':
            if (!country.capital) return generateQuestion(); // Evitar preguntas sin capital definida
            question = `¿${country.capital[0]} , es la capital de qué país?`;
            //correctAnswer = country.name.common;
            correctAnswer = country.translations?.spa?.common || country.name.common;

            options = generateOptions(correctAnswer); // Generar opciones de respuesta
            break;
        case 'flag':
            if (!country.flags || !country.flags.png) return generateQuestion(); // Evitar países sin bandera
            question = `¿Qué país está representado por esta bandera?`;
            //correctAnswer = country.name.common;
            correctAnswer = country.translations?.spa?.common || country.name.common;
            options = generateOptions(correctAnswer); // Generar opciones de respuesta
            break;
        case 'borders':
            question = `¿Cuántos países limítrofes tiene ${country.name.common}?`;
            correctAnswer = country.borders ? country.borders.length : 0; // Obtener número de países limítrofes
            options = generateNumericOptions(correctAnswer); // Generar opciones numéricas de respuesta
            break;
    }
    console.log(`❓ Pregunta #${currentQuestionIndex + 1} | Tipo: ${type} | "${question}" | Opciones: ${options.join(", ")}`);

    // Mostrar la pregunta y opciones en pantalla
    displayQuestion({ question, type, correctAnswer, options, flag: country.flags?.png });
}

// Función para mostrar la pregunta y opciones en pantalla
function displayQuestion({ question, options, correctAnswer, type, flag }) {
    const questionModal = document.getElementById('questionResultModal');
    const modalMessageQuestion = document.getElementById('modalMessageQuestion');

    // Mostrar pregunta con la bandera si está disponible
    questionText.innerHTML = (type === 'flag' && flag)
        ? `<img src="${flag}" alt="Bandera" class="flag-question-img"><br>${question}`
        : question;

    const flagHint = document.getElementById('flagHint');


    setupHintHandler(type, flag, question); // Llama a la función importada

    optionsList.innerHTML = ''; // Limpiar lista de opciones

    //  // Crear botón para cada opción opción como elemento de lista
    options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.classList.add('list-group-item'); // Estilo básico con animaciones
        li.style.animationDelay = `${index * 0.2}s`; // Retraso dinámico para cada opción

        li.onclick = () => {
            const allOptions = document.querySelectorAll('#optionsList li');
            allOptions.forEach(opt => opt.onclick = null); // Deshabilitar clic en opciones

            const isCorrect = option.toString().toLowerCase() === correctAnswer.toString().toLowerCase();
            //
            const addedPoints = isCorrect ? (type === 'flag' ? 5 : 3) : 0;
            console.log(`${username} eligió: ${option} | Rta correcta: ${correctAnswer} | ${isCorrect ? 'Correcto ✅' : 'Incorrecto ❌'}`);

            if (isCorrect) {
                li.classList.add('correct-answer'); // Estilo para respuesta correcta
                correctSound.play();
                //
                score += addedPoints; // Sumás los puntos definidos
                correct++;
                modalMessageQuestion.textContent = "✅ ¡Correcto!";
            } else {
                li.classList.add('incorrect-answer'); // Estilo para respuesta incorrecta
                incorrectSound.play();
                incorrect++;
                modalMessageQuestion.textContent = `❌ Incorrecto. La respuesta era: ${correctAnswer}`;
            }

            showPointsEarned(addedPoints);
            questionModal.style.display = "flex"; // Mostrar modal de resultado

            // Cerrar modal y avanzar a la siguiente pregunta
            document.getElementById('closeQuestionModalButton').onclick = () => {
                questionModal.style.display = "none";
                currentQuestionIndex++;
                updateProgressBar(currentQuestionIndex);
                generateQuestion();
            };
        };
        // Animación de aparición
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
        //options.add(random.name.common);
        const nameInSpanish = random.translations?.spa?.common || random.name.common;
        options.add(nameInSpanish);
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}
// Opciones numéricas (cantidad de bordes)
function generateNumericOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        options.add(Math.floor(Math.random() * 10));
    }

    return Array.from(options).sort((a, b) => a - b);
}


function endGame() {
    clearInterval(gameTimerInterval); // Detener el cronómetro 
    const totalTime = (Date.now() - startTime) / 1000; // Calcula el tiempo total jugado
    const avgTimePerQuestion = (totalTime / 10).toFixed(3); // Calcula el tiempo promedio por pregunta

    // Verificar y actualizar récord
    const previousHighScore = localStorage.getItem(`highScore_${username}`);
    const currentScore = score;



    let recordMessage = "";

    if (previousHighScore !== null && currentScore > Number(previousHighScore)) {
        localStorage.setItem(`highScore_${username}`, currentScore);
        recordMessage = `🎉 <strong>¡Nuevo récord, ${username}!</strong> Tu nuevo puntaje es <strong>${currentScore}</strong>.`;
    } else if (previousHighScore === null) {
        localStorage.setItem(`highScore_${username}`, currentScore);
        recordMessage = `🎯 <strong>Primer intento, ${username}!</strong> Este es tu puntaje: <strong>${currentScore}</strong>.`;
    } else {
        recordMessage = `✅ Tu puntaje fue <strong>${currentScore}</strong>. Tu récord actual es <strong>${previousHighScore}</strong>.`;
    }

    fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score, correct, incorrect, totalTime, avgTimePerQuestion })
    })
        .then(res => res.json())
        .then(data => {
            localStorage.removeItem('ranking');
            // Obtener los elementos del modal
            const gameModal = document.getElementById('gameResultModal');
            const modalMessage = document.getElementById('modalMessage');
            const modalDetails = document.getElementById('modalDetails');
            const modalRanking = document.getElementById('modalRanking');

            // Rellena el mensaje del modal con los resultados
            modalMessage.innerHTML = `<strong> Tu resultado :</strong>`;
            modalDetails.innerHTML = `
                <p>Puntaje: <strong>${score}</strong></p>
                <p>Correctas: <strong>${correct}</strong></p>
                <p>Incorrectas: <strong>${incorrect}</strong></p>
                <p>Tiempo total: <strong>${totalTime.toFixed(3)} segundos</strong></p>
                <p>Tiempo promedio por pregunta: <strong>${avgTimePerQuestion} segundos</strong></p>
                
            `;
            // Mensaje de ranking 
            if (data.position !== null) {
                modalRanking.textContent = `🔥🔥¡LLEGASTE AL PUESTO ${data.position}, FELICITACIONES!!🔥🔥`;
            } else {
                modalRanking.textContent = ` Todavía no estás en la cima, pero cada intento te acerca más 🔝`;
            }

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

document.getElementById('viewRankingButton').onclick = () => {
    window.location.href = "/ranking"; // Redirige a la nueva página de ranking
};

document.getElementById('viewRankingButtonFinal').onclick = () => {
    window.location.href = "/ranking";
};
