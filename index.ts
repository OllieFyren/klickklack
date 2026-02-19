(function() {
    const app = document.getElementById("app");

    //Create start menu
    const start = document.createElement('div');
    start.id = 'startMenu';
    const play = document.createElement('div');
    play.id = 'playButton';
    const text = document.createElement('p');
    text.textContent = "PLAY!";
    play.appendChild(text);
    start.appendChild(play);
    app.appendChild(start);

    //Game options menu
    const options = document.createElement('div')

    const difficulties : string[] = ["easy", "medium", "hard", "custom"];
    difficulties.forEach((difficulty) => {
        const button = document.createElement('div');
        const text = document.createElement('p');
        text.textContent = difficulty;
        button.appendChild(text);
        button.dataset.difficulty = difficulty;
        button.classList.add('button')
        options.appendChild(button);
    })
    app.appendChild(options);
})();


document.getElementById('playButton').onclick = (event) => {
    console.log
}