const app = document.getElementById("app");

//Globally scoped vars
let boardSize = 0;
let excluded: number[] = [];
let score = 500;
let state = "paused";
let totalScore = 0;
let combo = 0;
let timer: ReturnType<typeof setInterval>;

//Create start screen
(() => {
    const start = document.createElement('div');
    start.id = 'startMenu';
    const play = document.createElement('div');
    play.id = 'playButton';
    const text = document.createElement('p');
    text.textContent = "PLAY!";
    play.appendChild(text);
    start.appendChild(play);
    app.appendChild(start);

    //Click functionality
    play.addEventListener('click', () => {
        buildOptions();
        play.classList.add('clicked');
        const start = document.getElementById('startMenu');
        start.style.height = "0";
        setTimeout(() => {
            start.remove();
        }, 1000)
    })
})();
