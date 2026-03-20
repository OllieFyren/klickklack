var app = document.getElementById("app");
//Globally scoped vars
var boardSize = 0;
var excluded = [];
var score = 500;
var state = "paused";
var totalScore = 0;
var combo = 0;
var timer;
//Create start screen
(function () {
    var start = document.createElement('div');
    start.id = 'startMenu';
    var play = document.createElement('div');
    play.id = 'playButton';
    var text = document.createElement('p');
    text.textContent = "PLAY!";
    play.appendChild(text);
    start.appendChild(play);
    app.appendChild(start);
    //Click functionality
    play.addEventListener('click', function () {
        buildOptions();
        play.classList.add('clicked');
        var start = document.getElementById('startMenu');
        start.style.height = "0";
        setTimeout(function () {
            start.remove();
        }, 1000);
    });
})();
function buildOptions() {
    var options = document.createElement('div');
    options.id = 'options';
    var difficulties = ["easy", "medium", "hard", "extreme"];
    difficulties.forEach(function (difficulty) {
        var button = document.createElement('div');
        var text = document.createElement('p');
        text.textContent = difficulty;
        button.appendChild(text);
        button.dataset.difficulty = difficulty;
        button.classList.add('optionsButton');
        options.appendChild(button);
        app.appendChild(options);
    });
    //Add event listener only after element exists
    document.querySelectorAll('.optionsButton').forEach(function (button) {
        button.addEventListener('click', function () {
            var options = document.getElementById('options');
            button.classList.add('chosen');
            options.style.opacity = "0";
            var difficulty = button.getAttribute('data-difficulty');
            setTimeout(function () {
                options.remove();
                buildBoard(difficulty);
            }, 800);
        });
    });
}
function buildBoard(difficulty) {
    //Outer container
    var boardContainer = document.createElement('div');
    boardContainer.id = "boardContainer";
    //score display
    var scoreContainer = document.createElement('div');
    scoreContainer.id = "score";
    var scoreTitle = document.createElement('p');
    scoreTitle.textContent = "Score";
    scoreContainer.appendChild(scoreTitle);
    var score = document.createElement('p');
    score.id = "scoreDisplay";
    score.textContent = "0";
    scoreContainer.appendChild(score);
    boardContainer.appendChild(scoreContainer);
    //Board
    var board = document.createElement('div');
    board.id = "board";
    //Check difficulty
    switch (difficulty) {
        case "easy":
            boardSize = 16;
            break;
        case "medium":
            boardSize = 36;
            break;
        case "hard":
            boardSize = 64;
            break;
        case "extreme":
            boardSize = 100;
            break;
        default:
            boardSize = 9;
            break;
    }
    board.dataset.size = "".concat(boardSize);
    //Create squares
    var rows = Math.sqrt(boardSize);
    for (var i = 1; i <= boardSize; i++) {
        var boardPiece = document.createElement('div');
        boardPiece.dataset.i = "".concat(i);
        boardPiece.classList.add('boardSquare');
        boardPiece.style.cssText = "--rows: ".concat(rows);
        board.appendChild(boardPiece);
    }
    boardContainer.appendChild(board);
    app.appendChild(boardContainer);
    //Click event after creation
    document.querySelectorAll('.boardSquare').forEach(function (square) {
        square.addEventListener('click', function () {
            squareClick(square);
        });
    });
    //Set initial active squares
    activateSquares(boardSize, 2, excluded);
}
function buildEndGameScreen() {
    //Create containers
    var endScreen = document.createElement('div');
    endScreen.id = "endScreen";
    var innerEndScreen = document.createElement('div');
    innerEndScreen.id = "innerEndScreen";
    endScreen.appendChild(innerEndScreen);
    //Score display
    var finalScore = document.createElement('div');
    finalScore.id = "finalScore";
    var title = document.createElement('p');
    title.textContent = "Final score:";
    var scoreDisplay = document.createElement('h3');
    scoreDisplay.textContent = "".concat(totalScore);
    finalScore.appendChild(title);
    finalScore.appendChild(scoreDisplay);
    innerEndScreen.appendChild(finalScore);
    //Game over text
    var gameOverText = document.createElement('h2');
    gameOverText.textContent = "Game over!";
    gameOverText.classList.add('endText');
    innerEndScreen.appendChild(gameOverText);
    //Buttons
    var buttons = document.createElement('div');
    buttons.id = "endButtons";
    var retry = document.createElement('div');
    var retryText = document.createElement('p');
    retryText.textContent = "Play again";
    retry.appendChild(retryText);
    retry.id = "gameRetry";
    buttons.appendChild(retry);
    var back = document.createElement('div');
    back.id = "backToMenu";
    var backText = document.createElement('p');
    backText.textContent = "Back to menu";
    back.appendChild(backText);
    buttons.appendChild(back);
    innerEndScreen.appendChild(buttons);
    retry.addEventListener('click', function () {
        endScreen.remove();
        activateSquares(boardSize, 2, excluded);
    });
    back.addEventListener('click', function () {
        backToMenu();
    });
    //Add to board
    var board = document.getElementById('board');
    board.appendChild(endScreen);
}
function chooseSquare(boardSize, excluded) {
    var num = Math.floor(Math.random() * boardSize) + 1;
    while (excluded.includes(num)) {
        num = Math.floor(Math.random() * boardSize) + 1;
    }
    return num;
}
function activateSquares(boardSize, amount, excluded) {
    var chosenNums = [];
    while (amount > chosenNums.length) {
        var chosen = chooseSquare(boardSize, excluded);
        if (!chosenNums.includes(chosen)) {
            chosenNums.push(chosen);
            excluded.push(chosen);
        }
    }
    chosenNums.forEach(function (n) {
        var square = document.querySelector("#board .boardSquare[data-i='".concat(n, "']"));
        square.classList.add('active');
    });
    console.log(excluded);
    console.log(chosenNums);
}
function startTimer() {
    timer = setInterval(function () {
        if (score > 0) {
            score = score - 100;
            console.log(score);
        }
        else {
            combo = 0;
            endGame();
        }
    }, 100);
}
function squareClick(square) {
    if (state === "paused") {
        state = "running";
        startTimer();
    }
    if (square.classList.contains('active')) {
        square.classList.remove('active');
        var squareNum_1 = parseInt(square.dataset.i);
        activateSquares(boardSize, 1, excluded);
        excluded = excluded.filter(function (value) { return value !== squareNum_1; });
        increaseScore();
        score = 500;
    }
    else {
        endGame();
    }
}
function endGame() {
    buildEndGameScreen();
    resetGameValues();
}
function increaseScore() {
    combo++;
    var increase = score * combo;
    totalScore = totalScore + increase;
    var display = document.createElement("p");
    display.classList.add('scoreIncrease');
    display.textContent = increase.toString();
    document.getElementById("score").appendChild(display);
    document.getElementById("scoreDisplay").textContent = totalScore.toString();
}
function resetGameValues() {
    excluded = [];
    score = 500;
    state = "paused";
    totalScore = 0;
    combo = 0;
    clearInterval(timer);
    document.getElementById("scoreDisplay").textContent = "0";
    document.querySelectorAll('.boardSquare.active').forEach(function (square) {
        square.classList.remove('active');
    });
}
function backToMenu() {
    resetGameValues();
    document.getElementById('boardContainer').remove();
    buildOptions();
}
