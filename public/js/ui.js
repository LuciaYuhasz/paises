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