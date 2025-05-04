// sounds.js

export const keypressSound = new Audio('sounds/tipeo.mp3');
export const buttonClickSound = new Audio('sounds/chalentacept.mp3');
export const correctSound = new Audio('sounds/correcto.mp3');
export const incorrectSound = new Audio('sounds/incorrecto.mp3');
export const backgroundMusic = new Audio('sounds/fondoJuego.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

export function toggleMusic(isMuted, button) {
    // Controla la música
    if (isMuted) {
        backgroundMusic.pause();  // Pausa la música
    } else {
        backgroundMusic.play();   // Reproduce la música
    }

    // Cambia el estado visual del botón
    if (isMuted) {
        button.innerHTML = '<i class="bi bi-volume-mute"></i> Reanudar Música';
        button.classList.add('muted');
        button.style.backgroundColor = "#f44336";  // Rojo para muteado
    } else {
        button.innerHTML = '<i class="bi bi-volume-up"></i> Silenciar Música';
        button.classList.remove('muted');
        button.style.backgroundColor = "#4CAF50";  // Verde para reanudado
    }

    // Guarda el estado de la música en localStorage
    localStorage.setItem('isMusicMuted', isMuted);
}