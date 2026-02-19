(function () {
    var app = document.getElementById("app");
    //Create start menu
    var start = document.createElement('div');
    start.id = 'startMenu';
    var play = document.createElement('div');
    play.id = 'playButton';
    var text = document.createElement('p');
    text.textContent = "PLAY!";
    play.appendChild(text);
    start.appendChild(play);
    app.appendChild(start);
    //Game options menu
    var options = document.createElement('div');
    var difficulties = ["easy", "medium", "hard", "custom"];
    difficulties.forEach(function (difficulty) {
        var button = document.createElement('div');
        var text = document.createElement('p');
        text.textContent = difficulty;
        button.appendChild(text);
        button.dataset.difficulty = difficulty;
        button.classList.add('button');
        options.appendChild(button);
    });
    app.appendChild(options);
})();
document.getElementById('playButton').onclick = function (event) {
    console.log;
};
