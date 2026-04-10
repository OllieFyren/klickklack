function buildOptions(): void {
    const options = document.createElement('div')
    options.id = 'options';
    const difficulties: string[] = ["easy", "medium", "hard", "extreme"];
    difficulties.forEach((difficulty) => {
        const button = document.createElement('div');
        const text = document.createElement('p');
        text.textContent = difficulty;
        button.appendChild(text);
        button.dataset.difficulty = difficulty;
        button.classList.add('optionsButton')
        options.appendChild(button);
        app.appendChild(options);
    })
    //Add event listener only after element exists
    document.querySelectorAll('.optionsButton').forEach((button) => {
        button.addEventListener('click', () => {
            const options = document.getElementById('options');
            button.classList.add('chosen');
            options.style.opacity = "0";
            difficulty = button.getAttribute('data-difficulty');
            setTimeout(() => {
                options.remove();
                buildGameModeSelect();
            }, 800)
        })
    });
}

function buildGameModeSelect(): void {
    const gameModeSelect = document.createElement('div');
    gameModeSelect.id = 'gameModeSelect';

    const timedMode = document.createElement('div');
    timedMode.id = 'timed';
    timedMode.classList.add('modeButton');
    timedMode.dataset.mode = "timed";
    const timedIcon = document.createElement('img');
    timedIcon.src = "../icons/timed.svg";
    const timedText = document.createElement('p');
    timedText.textContent = "Time attack";
    timedMode.appendChild(timedIcon);
    timedMode.appendChild(timedText);

    const infiniteMode = document.createElement('div');
    infiniteMode.id = 'infinite';
    infiniteMode.classList.add('modeButton');
    infiniteMode.dataset.mode = "infinite";
    const infiniteIcon = document.createElement('img');
    infiniteIcon.src = "../icons/infinity.svg";
    const infiniteText = document.createElement('p');
    infiniteText.textContent = "Infinite";
    infiniteMode.appendChild(infiniteIcon);
    infiniteMode.appendChild(infiniteText);
    gameModeSelect.appendChild(timedMode);
    gameModeSelect.appendChild(infiniteMode);

    app.appendChild(gameModeSelect);

    //Add event listener only after element exists
    document.querySelectorAll('.modeButton').forEach((button) => {
        button.addEventListener('click', () => {
            const gameModeSelect = document.getElementById('gameModeSelect');
            button.classList.add('chosen');
            gameMode = button.getAttribute('data-mode');
            gameModeSelect.style.opacity = "0";
            setTimeout(() => {
                gameModeSelect.remove();
                buildBoard(difficulty);
            }, 800)
        })
    })
}

function buildBoard(difficulty): void {

    //Outer container
    const boardContainer = document.createElement('div');
    boardContainer.id = "boardContainer";

    //score display
    const scoreContainer = document.createElement('div');
    scoreContainer.id = "score";
    const scoreTitle = document.createElement('p');
    scoreTitle.textContent = "Score";
    scoreContainer.appendChild(scoreTitle);
    const score = document.createElement('p');
    score.id = "scoreDisplay";
    score.textContent = "0";
    scoreContainer.appendChild(score);
    boardContainer.appendChild(scoreContainer);

    //timer display if infinite game mode
    if(gameMode === "infinite") {
        const timerContainer = document.createElement('div');
        timerContainer.id = "timer";
        const timerBar = document.createElement('div');
        timerBar.id = "timerBar";
        timerContainer.appendChild(timerBar);
        boardContainer.appendChild(timerContainer);
    } else if(gameMode === "timed") {
        const timeLimit = document.createElement('div');
        timeLimit.id = "timeLimit";
        const timeLimitBar = document.createElement('div');
        timeLimitBar.id = "timeLimitBar";
        timeLimit.appendChild(timeLimitBar);
        boardContainer.appendChild(timeLimit);
    }

    //Board
    const board = document.createElement('div');
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
    board.dataset.size = `${boardSize}`;

    //Create squares
    const rows = Math.sqrt(boardSize);
    for (let i = 1; i <= boardSize; i++) {
        const boardPiece = document.createElement('div');
        boardPiece.dataset.i = `${i}`;
        boardPiece.classList.add('boardSquare');
        boardPiece.style.cssText = `--rows: ${rows}`
        board.appendChild(boardPiece);
    }
    boardContainer.appendChild(board);
    app.appendChild(boardContainer);

    //Combo display
    if(gameMode === "timed"){
        const comboDisplay = document.createElement('div');
        comboDisplay.id = "comboDisplay";
        const combo = document.createElement('p');
        combo.id = "combo";
        combo.textContent = "x0";
        comboDisplay.appendChild(combo);
        boardContainer.appendChild(comboDisplay);
    }
    
    //Click event after creation
    document.querySelectorAll('.boardSquare').forEach((square) => {
        square.addEventListener('click', (event: Event) => {
            squareClick(square, event);
        })
    })
    //Set initial active squares
    startGame();
}

function buildEndGameScreen(gameMode): void {
    //Create containers
    const endScreen = document.createElement('div');
    endScreen.id = "endScreen";
    const innerEndScreen = document.createElement('div');
    innerEndScreen.id = "innerEndScreen";
    endScreen.appendChild(innerEndScreen);

    //Score display
    const finalScore = document.createElement('div');
    finalScore.id = "finalScore";
    const title = document.createElement('p');
    title.textContent = "Final score:";
    const scoreDisplay = document.createElement('h3');
    scoreDisplay.textContent = `${totalScore}`;
    finalScore.appendChild(title);
    finalScore.appendChild(scoreDisplay);
    innerEndScreen.appendChild(finalScore);

    //Game over text
    const gameOverText = document.createElement('h2');
    if(gameMode === "infinite") {
        gameOverText.textContent = "Game over!";
    } else if(gameMode === "timed") {
        gameOverText.textContent = "Time's up!";
    }
    gameOverText.classList.add('endText');
    innerEndScreen.appendChild(gameOverText);

    //Buttons
    const buttons = document.createElement('div');
    buttons.id = "endButtons";
    const retry = document.createElement('div');
    const retryText = document.createElement('p');
    retryText.textContent = "Play again";
    retry.appendChild(retryText);
    retry.id = "gameRetry";
    buttons.appendChild(retry);
    const back = document.createElement('div');
    back.id = "backToMenu";
    const backText = document.createElement('p');
    backText.textContent = "Back to menu";
    back.appendChild(backText);
    buttons.appendChild(back);

    innerEndScreen.appendChild(buttons);

    retry.addEventListener('click', () => {
        endScreen.remove();
        startGame();
    })

    back.addEventListener('click', () => {
        backToMenu();
    })

    //Add to board
    const board = document.getElementById('board');
    board.appendChild(endScreen);
}