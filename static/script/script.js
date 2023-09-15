const gameBoard = (() => {
  let moveCount = 0;
  const gameBoardArr = ["", "", "", "", "", "", "", "", ""];

  const getMoveCount = () => moveCount;
  const addMoveCount = () => {
    ++moveCount;
  };
  const setGameBoardItem = (index, mark) => {
    gameBoardArr[index] = mark;
  };
  const getGameBoardItem = (index) => gameBoardArr[index];
  const decideWinner = () => {
    const winPositionsArr = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winPositionsArr.length; ++i) {
      const [a, b, c] = winPositionsArr[i];
      const itemA = getGameBoardItem(a);
      if (
        itemA &&
        itemA === getGameBoardItem(b) &&
        itemA === getGameBoardItem(c)
      ) {
        return { mark: itemA, winningPositions: winPositionsArr[i] };
      }
    }
    return { mark: null, winningPositions: null };
  };

  const reset = () => {
    moveCount = 0;
    gameBoardArr.fill("");
  };

  return {
    getMoveCount,
    addMoveCount,
    getGameBoardItem,
    setGameBoardItem,
    decideWinner,
    reset,
  };
})();

const player = (move, mark) => {
  let score = 0;
  const updateScore = () => ++score;
  const canMove = () => move;
  const getMark = () => mark;
  const toggleMove = () => (move = !move);
  return { updateScore, canMove, toggleMove, getMark };
};

const playerOne = player(true, "X");
const playerTwo = player(false, "O");

(() => {
  const BOARD_SIZE = 9;
  const message = document.querySelector("#message");
  const players = document.querySelectorAll(".player-card");
  const scores = document.querySelectorAll(".player-score");
  const grid = document.querySelector("#game-board");
  const gridChildren = grid.children;

  const displayGameBoard = () => {
    for (let i = 0; i < BOARD_SIZE; ++i) {
      gridChildren[i].textContent = gameBoard.getGameBoardItem(i);
    }
  };

  const lockCell = (cell) => {
    cell.classList.add("disabled");
  };

  const lockGameBoard = () => {
    for (const cell of gridChildren) {
      lockCell(cell);
    }
  };

  const togglePlayerMark = (cell) => {
    const currentPlayer = playerOne.canMove() ? playerOne : playerTwo;
    cell.classList.toggle("x", currentPlayer === playerOne);
    cell.classList.toggle("o", currentPlayer === playerTwo);
  };

  const switchPlayerTurn = () => {
    playerOne.toggleMove();
    playerTwo.toggleMove();
  };

  const updatePlayerCard = () => {
    if (playerOne.canMove()) {
      players[0].classList.add("player-turn");
      players[1].classList.remove("player-turn");
    } else {
      players[0].classList.remove("player-turn");
      players[1].classList.add("player-turn");
    }
  };

  const displayPlayerTurn = () => {
    updatePlayerCard();
    message.textContent = `${
      playerOne.canMove() ? playerOne.getMark() : playerTwo.getMark()
    } turn`;
  };

  const onGameRestart = () => {
    gameBoard.reset();

    for (const cell of gridChildren) {
      cell.textContent = "";
      cell.classList.remove("x", "o", "disabled", "win-animation");
    }

    displayGameBoard();

    if (!playerOne.canMove()) {
      switchPlayerTurn();
    }
    displayPlayerTurn();
  };

  const displayWinner = ({ mark, winningPositions }) => {
    lockGameBoard();

    if (!mark) {
      message.textContent = "It's a tie!";
      return;
    }

    message.textContent = `${mark} won!`;

    if (mark === playerOne.getMark()) {
      scores[0].textContent = playerOne.updateScore();
    } else {
      scores[1].textContent = playerTwo.updateScore();
    }

    winningPositions.forEach((index) => {
      gridChildren[index].classList.add("win-animation");
    });
  };

  const onCellClick = (event) => {
    if (event.target.classList.contains("disabled")) {
      return;
    }

    const choosenCell = event.target;
    const currentPlayerMark = playerOne.canMove()
      ? playerOne.getMark()
      : playerTwo.getMark();

    gameBoard.setGameBoardItem(+choosenCell.dataset.index, currentPlayerMark);

    togglePlayerMark(choosenCell);
    lockCell(choosenCell);
    switchPlayerTurn();
    displayPlayerTurn();
    displayGameBoard();

    gameBoard.addMoveCount();
    if (gameBoard.getMoveCount() >= 4) {
      const winner = gameBoard.decideWinner();
      if (winner.mark !== null || gameBoard.getMoveCount() === 9) {
        displayWinner(winner);
      }
    }
  };

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.addEventListener("click", onCellClick));

  const restartButton = document.querySelector("#restart-game");
  restartButton.addEventListener("click", onGameRestart);
})();
