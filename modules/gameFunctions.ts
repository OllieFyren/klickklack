function chooseSquare(boardSize: number, excluded: number[]): number {
    let num = Math.floor(Math.random() * boardSize) + 1
    while (excluded.includes(num)) {
        num = Math.floor(Math.random() * boardSize) + 1
    }
    return num;
}

function activateSquares(boardSize: number, amount: number, excluded: number[]): void {
    let chosenNums: number[] = [];
    while (amount > chosenNums.length) {
        let chosen = chooseSquare(boardSize, excluded);
        if (!chosenNums.includes(chosen)) {
            chosenNums.push(chosen);
            excluded.push(chosen);
        }
    }
    chosenNums.forEach((n) => {
        const square = document.querySelector(`#board .boardSquare[data-i='${n}']`)
        square.classList.add('active');
    })
    console.log(excluded);
    console.log(chosenNums);

}

function startTimer(): void {
    timer = setInterval(() => {
        if (score > 0) {
            score = score - 100;
            console.log(score);
        } else {
            combo = 0;
            endGame();
        }
    }, 100)
}

function squareClick(square): void {
    if (state === "paused") {
        state = "running";
        startTimer();
    }
    if (square.classList.contains('active')) {
        square.classList.remove('active');
        const squareNum: number = parseInt(square.dataset.i);
        activateSquares(boardSize, 1, excluded);
        excluded = excluded.filter(value => value !== squareNum);
        increaseScore();
        score = 500;
    } else {
        endGame();
    }
}

function endGame(): void {
    buildEndGameScreen();
    resetGameValues();
}

function increaseScore(): void {
    combo++;
    const increase = score * combo;
    totalScore = totalScore + increase;
    const display = document.createElement("p");
    display.classList.add('scoreIncrease');
    display.textContent = increase.toString();
    document.getElementById("score").appendChild(display);
    document.getElementById("scoreDisplay").textContent = totalScore.toString();
}

function resetGameValues(): void {
    excluded = [];
    score = 500;
    state = "paused";
    totalScore = 0;
    combo = 0;
    clearInterval(timer);
    document.getElementById("scoreDisplay").textContent = "0";
    document.querySelectorAll('.boardSquare.active').forEach((square) => {
        square.classList.remove('active');
    })
}

function backToMenu(): void {
    resetGameValues();
    document.getElementById('boardContainer').remove();
    buildOptions();
}