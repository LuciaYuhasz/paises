export const questionText = document.getElementById('questionText');
export const optionsList = document.getElementById('optionsList');
export const gameArea = document.getElementById('gameArea');
export const registerForm = document.getElementById('registerForm');
export const usernameInput = document.getElementById('username');
export const startGameButton = document.getElementById('startGameButton');
export const toggleMusicButton = document.getElementById('toggleMusicButton');
export const questionModal = document.getElementById('questionResultModal');
export const modalMessageQuestion = document.getElementById('modalMessageQuestion');
export const musicControl = document.getElementById('musicControl');
//barra de progreso 
export function initializeProgressBar() {
    console.log("Inicializando barra de progreso (0%)");
    document.getElementById("progressBar").style.width = "0%";
}
export function updateProgressBar(currentIndex) {
    const progress = (currentIndex / 10) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;
}

//gestionar la lógica para mostrar una pista visual 
export function setupHintHandler(type, flag, question) {
    hintContainer.style.display = 'none';
    showFlagHintButton.style.display = 'inline-block';

    if (type !== 'flag' && flag) {
        hintContainer.style.display = 'block';
        showFlagHintButton.onclick = () => {
            questionText.innerHTML = `<img src="${flag}" alt="Bandera del país" class="flag-question-img"><br>${question}`;
            showFlagHintButton.style.display = 'none';
        };
    }
}
// muestra  cuantos puntos sume si acerte
export function showPointsEarned(addedPoints) {
    const pointsEarned = document.getElementById('pointsEarned');
    if (!pointsEarned) return;

    if (addedPoints > 0) {
        pointsEarned.textContent = `🎯 ¡Sumaste ${addedPoints} puntos!`;
        pointsEarned.classList.remove('animate');
        void pointsEarned.offsetWidth; // Forzar reflow
        pointsEarned.classList.add('animate');
    } else {
        pointsEarned.textContent = '';
    }
}
//relor visual 
let gameTimerInterval;
export function startGameTimer(startTime) {
    const gameTimerElement = document.getElementById('gameTimer');
    clearInterval(gameTimerInterval); // Por si estaba corriendo de antes

    gameTimerElement.textContent = "⏱️ Tiempo: 0.00 s";

    gameTimerInterval = setInterval(() => {
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        gameTimerElement.textContent = `⏱️ Tiempo: ${elapsedSeconds} s`;
    }, 100);
}
export function stopGameTimer() {
    clearInterval(gameTimerInterval);
}

