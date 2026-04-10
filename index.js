var app = document.getElementById("app");
//Globally scoped vars
var boardSize = 0;
var difficulty;
var gameMode;
var excluded = [];
var score = 0;
var state = "paused";
var totalScore = 0;
var combo = 0;
var timer;
var timeLimit;
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
            difficulty = button.getAttribute('data-difficulty');
            setTimeout(function () {
                options.remove();
                buildGameModeSelect();
            }, 800);
        });
    });
}
function buildGameModeSelect() {
    var gameModeSelect = document.createElement('div');
    gameModeSelect.id = 'gameModeSelect';
    var timedMode = document.createElement('div');
    timedMode.id = 'timed';
    timedMode.classList.add('modeButton');
    timedMode.dataset.mode = "timed";
    var timedIcon = document.createElement('img');
    timedIcon.src = "../icons/timed.svg";
    var timedText = document.createElement('p');
    timedText.textContent = "Time attack";
    timedMode.appendChild(timedIcon);
    timedMode.appendChild(timedText);
    var infiniteMode = document.createElement('div');
    infiniteMode.id = 'infinite';
    infiniteMode.classList.add('modeButton');
    infiniteMode.dataset.mode = "infinite";
    var infiniteIcon = document.createElement('img');
    infiniteIcon.src = "../icons/infinity.svg";
    var infiniteText = document.createElement('p');
    infiniteText.textContent = "Infinite";
    infiniteMode.appendChild(infiniteIcon);
    infiniteMode.appendChild(infiniteText);
    gameModeSelect.appendChild(timedMode);
    gameModeSelect.appendChild(infiniteMode);
    app.appendChild(gameModeSelect);
    //Add event listener only after element exists
    document.querySelectorAll('.modeButton').forEach(function (button) {
        button.addEventListener('click', function () {
            var gameModeSelect = document.getElementById('gameModeSelect');
            button.classList.add('chosen');
            gameMode = button.getAttribute('data-mode');
            gameModeSelect.style.opacity = "0";
            setTimeout(function () {
                gameModeSelect.remove();
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
    //timer display if infinite game mode
    if (gameMode === "infinite") {
        var timerContainer = document.createElement('div');
        timerContainer.id = "timer";
        var timerBar = document.createElement('div');
        timerBar.id = "timerBar";
        timerContainer.appendChild(timerBar);
        boardContainer.appendChild(timerContainer);
    }
    else if (gameMode === "timed") {
        var timeLimit_1 = document.createElement('div');
        timeLimit_1.id = "timeLimit";
        var timeLimitBar = document.createElement('div');
        timeLimitBar.id = "timeLimitBar";
        timeLimit_1.appendChild(timeLimitBar);
        boardContainer.appendChild(timeLimit_1);
    }
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
    //Combo display
    if (gameMode === "timed") {
        var comboDisplay = document.createElement('div');
        comboDisplay.id = "comboDisplay";
        var combo_1 = document.createElement('p');
        combo_1.id = "combo";
        combo_1.textContent = "x0";
        comboDisplay.appendChild(combo_1);
        boardContainer.appendChild(comboDisplay);
    }
    //Click event after creation
    document.querySelectorAll('.boardSquare').forEach(function (square) {
        square.addEventListener('click', function (event) {
            squareClick(square, event);
        });
    });
    //Set initial active squares
    startGame();
}
function buildEndGameScreen(gameMode) {
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
    if (gameMode === "infinite") {
        gameOverText.textContent = "Game over!";
    }
    else if (gameMode === "timed") {
        gameOverText.textContent = "Time's up!";
    }
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
        startGame();
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
            document.getElementById("timerBar").style.width = "".concat(score / 5, "%");
            if (score < 100) {
                document.getElementById("timerBar").style.backgroundColor = "red";
            }
            else if (score < 300) {
                document.getElementById("timerBar").style.backgroundColor = "orange";
            }
        }
        else {
            endGame();
        }
    }, 100);
}
function startTimeLimit() {
    timeLimit = 30;
    timer = setInterval(function () {
        console.log(timeLimit);
        timeLimit = timeLimit - 1;
        document.getElementById("timeLimitBar").style.width = "".concat(timeLimit / 30 * 100, "%");
        if (timeLimit < 10) {
            document.getElementById("timeLimitBar").style.backgroundColor = "red";
        }
        else if (timeLimit < 20) {
            document.getElementById("timeLimitBar").style.backgroundColor = "orange";
        }
        else {
            document.getElementById("timeLimitBar").style.backgroundColor = "#7DCD85";
        }
        if (timeLimit === 0) {
            endGame();
        }
    }, 1000);
}
function startGame() {
    var countdown = document.createElement('div');
    countdown.id = "countdown";
    countdown.textContent = "3";
    if (gameMode === "infinite") {
        score = 500;
        activateSquares(boardSize, 2, excluded);
    }
    else if (gameMode === "timed") {
        document.getElementById("board").appendChild(countdown);
        score = 10;
        var count_1 = 3;
        var countdownInterval_1 = setInterval(function () {
            count_1--;
            countdown.textContent = count_1.toString();
            if (count_1 === 0) {
                clearInterval(countdownInterval_1);
                countdown.textContent = "GO!";
                activateSquares(boardSize, 2, excluded);
                countdown.classList.add('fade');
                setTimeout(function () {
                    countdown.remove();
                }, 1000);
            }
            else if (count_1 === 1) {
                startTimeLimit();
            }
        }, 1000);
    }
}
function squareClick(square, e) {
    if (gameMode === "infinite") {
        document.getElementById("timerBar").style.backgroundColor = "#7DCD85";
        if (state === "paused") {
            state = "playing";
            startTimer();
        }
        if (square.classList.contains('active')) {
            square.classList.remove('active');
            showCircle(square, e);
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
    else if (gameMode === "timed") {
        if (square.classList.contains('active')) {
            square.classList.remove('active');
            showCircle(square, e);
            var squareNum_2 = parseInt(square.dataset.i);
            activateSquares(boardSize, 1, excluded);
            excluded = excluded.filter(function (value) { return value !== squareNum_2; });
            increaseScore();
        }
        else {
            combo = 0;
            showCross(square, e);
            document.getElementById("combo").textContent = "x0";
        }
    }
}
function showCircle(square, event) {
    var circle = document.createElement('div');
    var rect = square.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.classList.add('circle');
    square.appendChild(circle);
    var circleContent = document.createElement('div');
    circleContent.classList.add('circleContent');
    circle.appendChild(circleContent);
    setTimeout(function () {
        circle.remove();
    }, 500);
}
function showCross(square, event) {
    var cross = document.createElement('div');
    var rect = square.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    cross.style.left = x + 'px';
    cross.style.top = y + 'px';
    cross.classList.add('cross');
    square.appendChild(cross);
    var crossContent = document.createElement('p');
    crossContent.classList.add('crossContent');
    crossContent.textContent = "+";
    cross.appendChild(crossContent);
    setTimeout(function () {
        cross.remove();
    }, 500);
}
function endGame() {
    buildEndGameScreen(gameMode);
    resetGameValues();
}
function increaseScore() {
    combo++;
    document.getElementById("combo").textContent = "x" + combo;
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
    if (document.getElementById("timerBar")) {
        document.getElementById("timerBar").style.width = "100%";
        document.getElementById("timerBar").style.backgroundColor = "#7DCD85";
    }
    if (document.getElementById("timeLimitBar")) {
        document.getElementById("timeLimitBar").style.width = "100%";
        document.getElementById("timeLimitBar").style.backgroundColor = "#7DCD85";
    }
}
function backToMenu() {
    resetGameValues();
    document.getElementById('boardContainer').remove();
    buildOptions();
}
