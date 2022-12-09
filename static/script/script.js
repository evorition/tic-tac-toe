const gameBoard = (() => {
  let moveCount = 0;
  const gameBoardArr = ["", "", "", "", "", "", "", "", ""];

  const getMoveCount = () => moveCount;
  const addMoveCount = () => { ++moveCount; }
  const setGameBoardItem = (index, mark) => { gameBoardArr[index] = mark; }
  const getGameBoardItem = index => gameBoardArr[index];
  const decideWinner = () => {
    const winPositionsArr = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winPositionsArr.length; ++i) {
      const [a, b, c] = winPositionsArr[i];
      if (getGameBoardItem(a) && getGameBoardItem(a) === getGameBoardItem(b)
        && getGameBoardItem(a) == getGameBoardItem(c)) {
        return getGameBoardItem(a);
      }
    }
    return null;
  }

  const reset = () => {
    moveCount = 0;
    for (let i = 0; i < 9; ++i) {
      setGameBoardItem(i, "");
    }
  }

  return { getMoveCount, addMoveCount, getGameBoardItem, setGameBoardItem, decideWinner, reset };
})();

const displayController = (() => {
  const message = document.querySelector("#message");
  const grid = document.querySelector("#game-board");
  const gridChildren = grid.children;

  const displayGameBoard = () => {
    for (let i = 0; i < 9; ++i) {
      gridChildren[i].textContent = gameBoard.getGameBoardItem(i);
    }
  }

  const lockOrUnlockCell = (cell, lock = true) => {
    if (lock) {
      cell.classList.add("disabled");
    } else {
      cell.classList.remove("disabled");
    }
  }

  const lockOrUnlockGameBoard = (lock = true) => {
    for (const cell of gridChildren) {
      lockOrUnlockCell(cell, lock);
    }
  }

  const onGameRestart = () => {
    restartButton.disabled = true;
    gameBoard.reset();
    displayGameBoard();
    lockOrUnlockGameBoard(lock = false);
    message.textContent = `${playerOne.getName()}'s turn`;

    const classes = ["x", "o"];
    for (const child of gridChildren) {
      child.classList.remove(...classes);
    }

    if (!playerOne.canMove()) {
      playerOne.toggleMove();
      playerTwo.toggleMove();
    }
  }

  const displayWinner = winner => {
    lockOrUnlockGameBoard();
    restartButton.disabled = false;

    if (winner === playerOne.getMark()) {
      message.textContent = `${playerOne.getName()} won!`;
    } else if (winner === playerTwo.getMark()) {
      message.textContent = `${playerTwo.getName()} won!`;
    } else {
      message.textContent = "It's a tie!";
    }
  }

  const onCellClick = event => {
    if (event.target.classList.contains("disabled")) {
      return;
    }

    let mark;
    if (playerOne.canMove()) {
      mark = playerOne.getMark();
      event.target.classList.add("x");
      message.textContent = `${playerTwo.getName()}'s turn`;

      playerOne.toggleMove();
      playerTwo.toggleMove();
    } else if (playerTwo.canMove()) {
      mark = playerTwo.getMark();
      event.target.classList.add("o");
      message.textContent = `${playerOne.getName()}'s turn`;

      playerTwo.toggleMove();
      playerOne.toggleMove();
    }

    gameBoard.setGameBoardItem(+event.target.dataset.index, mark);
    lockOrUnlockCell(event.target);
    displayGameBoard();

    gameBoard.addMoveCount();
    if (gameBoard.getMoveCount() >= 4) {
      const winner = gameBoard.decideWinner();
      if (winner !== null || gameBoard.getMoveCount() === 9) {
        displayWinner(winner);
      }
    }
  }

  const askPlayersName = () => {
    let playerOneName;
    let playerTwoName;

    do {
      playerOneName = prompt("Enter X player name");
    } while (playerOneName === "" || playerOneName === null);

    do {
      playerTwoName = prompt("Enter O player name");
    } while (playerTwoName === "" || playerTwoName === null);

    message.textContent = `${playerOneName}'s turn`;

    return [playerOneName, playerTwoName];
  }

  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.addEventListener("click", onCellClick));

  const restartButton = document.querySelector("#restart-game");
  restartButton.addEventListener("click", onGameRestart);

  return { askPlayersName };
})();

const player = (name, move, mark) => {
  const getName = () => name;
  const canMove = () => move;
  const getMark = () => mark;
  const toggleMove = () => move = !move;
  return { getName, canMove, toggleMove, getMark };
}

const [playerOneName, playerTwoName] = displayController.askPlayersName();

const playerOne = player(playerOneName, true, "X");
const playerTwo = player(playerTwoName, false, "O");
