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
            document.getElementById("timerBar").style.width = `${score / 5}%`;
            if (score < 100) {
                document.getElementById("timerBar").style.backgroundColor = "red";
            } else if (score < 300) {
                document.getElementById("timerBar").style.backgroundColor = "orange";
            }
        } else {
            combo = 0;
            endGame();
        }
    }, 100)
}

function startGame(): void {
    const countdown = document.createElement('div');
    countdown.id = "countdown";
    countdown.textContent = "3";
    document.getElementById("board").appendChild(countdown);
    let count = 3;
    const countdownInterval = setInterval(() => {
        count--;
        countdown.textContent = count.toString();
        if (count === 0) {
            clearInterval(countdownInterval);
            countdown.textContent = "GO!";
            startTimer();
            activateSquares(boardSize, 2, excluded);
            countdown.classList.add('fade');
            setTimeout(() => {
                countdown.remove();
            }, 1000);
        }
    }, 1000);
}

function squareClick(square): void {
    document.getElementById("timerBar").style.backgroundColor = "#7DCD85";
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
    resetGameValues();
    buildEndGameScreen();
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
    document.getElementById("timerBar").style.width = "100%";
    document.getElementById("timerBar").style.backgroundColor = "#7DCD85";
}

function backToMenu(): void {
    resetGameValues();
    document.getElementById('boardContainer').remove();
    buildOptions();
}