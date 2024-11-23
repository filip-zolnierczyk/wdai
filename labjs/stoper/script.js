let seconds = 0;
let intervalId = null; 

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    timerDisplay.textContent = minutes > 0 
        ? `${minutes}min ${remainingSeconds}s` 
        : `${remainingSeconds}s`;
}

function startTimer() {
    if (!intervalId) { 
        intervalId = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

updateTimerDisplay();
