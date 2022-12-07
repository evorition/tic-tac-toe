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
    restartButton.hidden = true;
    gameBoard.reset();
    displayGameBoard();
    lockOrUnlockGameBoard(lock = false);
    if (!playerOne.canMove()) {
      playerOne.toggleMove();
      playerTwo.toggleMove();
    }
  }

  const displayWinner = winner => {
    lockOrUnlockGameBoard();
    restartButton.hidden = false;

    if (winner === playerOne.getMark()) {
      console.log(`${playerOne.getName()} won!`);
    } else if (winner === playerTwo.getMark()) {
      console.log(`${playerTwo.getName()} won!`);
    } else {
      console.log(`It's a tie!`);
    }
  }

  const onCellClick = event => {
    if (event.target.classList.contains("disabled")) {
      return;
    }

    let mark;
    if (playerOne.canMove()) {
      mark = playerOne.getMark();
      playerOne.toggleMove();
      playerTwo.toggleMove();
    } else if (playerTwo.canMove()) {
      mark = playerTwo.getMark();
      playerTwo.toggleMove();
      playerOne.toggleMove();
    }

    gameBoard.setGameBoardItem(+event.target.dataset.index, mark);
    displayGameBoard();

    lockOrUnlockCell(event.target);

    // Maybe I should move this block out of `onCellClick`?
    gameBoard.addMoveCount();
    if (gameBoard.getMoveCount() >= 4) {
      const winner = gameBoard.decideWinner();
      if (winner !== null || gameBoard.getMoveCount() === 9) {
        displayWinner(winner);
      }
    }
  }

  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.addEventListener("click", onCellClick));

  const restartButton = document.querySelector("#restart-game");
  restartButton.addEventListener("click", onGameRestart);

  return {};
})();

const player = (name, move, mark) => {
  const getName = () => name;
  const canMove = () => move;
  const getMark = () => mark;
  const toggleMove = () => move = !move;
  return { getName, canMove, toggleMove, getMark };
}

const playerOne = player("Maxim", true, "X");
const playerTwo = player("Alexander", false, "O");
