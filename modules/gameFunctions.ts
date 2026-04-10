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
            endGame();
        }
    }, 100)
}

function startTimeLimit(): void {
    timeLimit = 30;
    timer = setInterval(() => {
        console.log(timeLimit);
        timeLimit = timeLimit - 1;
        document.getElementById("timeLimitBar").style.width = `${timeLimit / 30 * 100}%`;
        if (timeLimit < 10) {
            document.getElementById("timeLimitBar").style.backgroundColor = "red";
        } else if (timeLimit < 20) {
            document.getElementById("timeLimitBar").style.backgroundColor = "orange";
        } else {
            document.getElementById("timeLimitBar").style.backgroundColor = "#7DCD85";
        }
        if (timeLimit === 0) {
            endGame();
        }
    }, 1000)
}

function startGame(): void {
    const countdown = document.createElement('div');
    countdown.id = "countdown";
    countdown.textContent = "3";
    if (gameMode === "infinite") {
        score = 500;
        activateSquares(boardSize, 2, excluded);
    } else if (gameMode === "timed") {
        document.getElementById("board").appendChild(countdown);
        score = 10;
        let count = 3;
        const countdownInterval = setInterval(() => {
            count--;
            countdown.textContent = count.toString();
            if (count === 0) {
                clearInterval(countdownInterval);
                countdown.textContent = "GO!";
                activateSquares(boardSize, 2, excluded);
                countdown.classList.add('fade');
                setTimeout(() => {
                    countdown.remove();
                }, 1000);
            } else if (count === 1) {
                startTimeLimit();
            }
        }, 1000);
    }
}

function squareClick(square, e): void {
    if (gameMode === "infinite") {
        document.getElementById("timerBar").style.backgroundColor = "#7DCD85";
        if (state === "paused") {
            state = "playing";
            startTimer();
        }
        if (square.classList.contains('active')) {
            square.classList.remove('active');
            showCircle(square, e);
            const squareNum: number = parseInt(square.dataset.i);
            activateSquares(boardSize, 1, excluded);
            excluded = excluded.filter(value => value !== squareNum);
            increaseScore();
            score = 500;
        } else {
            endGame();
        }
    } else if (gameMode === "timed") {
        if (square.classList.contains('active')) {
            square.classList.remove('active');
            showCircle(square, e);
            const squareNum: number = parseInt(square.dataset.i);
            activateSquares(boardSize, 1, excluded);
            excluded = excluded.filter(value => value !== squareNum);
            increaseScore();
        } else {
            combo = 0;
            showCross(square, e);
            document.getElementById("combo").textContent = "x0";
        }
    }
}

function showCircle(square, event): void {
    const circle = document.createElement('div');
    const rect = square.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.classList.add('circle');
    square.appendChild(circle);
    const circleContent = document.createElement('div');
    circleContent.classList.add('circleContent');
    circle.appendChild(circleContent);
    setTimeout(() => {
        circle.remove();
    }, 500);
}

function showCross(square, event): void {
    const cross = document.createElement('div');
    const rect = square.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cross.style.left = x + 'px';
    cross.style.top = y + 'px';
    cross.classList.add('cross');
    square.appendChild(cross);
    const crossContent = document.createElement('p');
    crossContent.classList.add('crossContent');
    crossContent.textContent = "+";
    cross.appendChild(crossContent);

    setTimeout(() => {
        cross.remove();
    }, 500);
}

function endGame(): void {
    buildEndGameScreen(gameMode);
    resetGameValues();
}

function increaseScore(): void {
    combo++;
    document.getElementById("combo").textContent = "x" + combo;
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
    if(document.getElementById("timerBar")) {
        document.getElementById("timerBar").style.width = "100%";
        document.getElementById("timerBar").style.backgroundColor = "#7DCD85";
    }
    if(document.getElementById("timeLimitBar")) {
        document.getElementById("timeLimitBar").style.width = "100%";
        document.getElementById("timeLimitBar").style.backgroundColor = "#7DCD85";
    }
}

function backToMenu(): void {
    resetGameValues();
    document.getElementById('boardContainer').remove();
    buildOptions();
}