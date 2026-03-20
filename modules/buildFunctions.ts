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
            const difficulty = button.getAttribute('data-difficulty');
            setTimeout(() => {
                options.remove();
                buildBoard(difficulty);
            }, 800)
        })
    });
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

    //Click event after creation
    document.querySelectorAll('.boardSquare').forEach((square) => {
        square.addEventListener('click', () => {
            squareClick(square);
        })
    })
    //Set initial active squares
    activateSquares(boardSize, 2, excluded);
}

function buildEndGameScreen(): void {
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
    gameOverText.textContent = "Game over!";
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
        activateSquares(boardSize, 2, excluded);
    })

    back.addEventListener('click', () => {
        backToMenu();
    })

    //Add to board
    const board = document.getElementById('board');
    board.appendChild(endScreen);
}