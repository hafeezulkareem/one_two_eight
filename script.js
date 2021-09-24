const gameStatus = {
   playing: "PLAYING",
   continuing: "CONTINUING",
   won: "WON",
   lost: "LOST",
};

const qs = (selector) => document.querySelector(selector);

const qsa = (selector) => document.querySelectorAll(selector);

const getRandomInt = (min, max) =>
   Math.floor(Math.random() * (max - min) + min);

const getRandomStartTile = () => (getRandomInt(0, 2) === 0 ? 2 : 4);

let state;

const initState = () => {
   state = {
      status: gameStatus.playing,
      board: [
         [null, null, null],
         [null, null, null],
         [null, null, null],
      ],
      score: 0,
      bestScore: 0,
   };
};

const addInitialTiles = () => {
   const firstTile = getRandomStartTile();
   const secondTile = getRandomStartTile();

   const firstTileRow = getRandomInt(0, 3);
   const firstTileCol = getRandomInt(0, 3);

   let secondTileRow = getRandomInt(0, 3);
   let secondTileCol = getRandomInt(0, 3);
   while (firstTileRow === secondTileRow && firstTileCol === secondTileCol) {
      secondTileRow = getRandomInt(0, 3);
      secondTileCol = getRandomInt(0, 3);
   }

   console.log(firstTile, secondTile);
   console.log(firstTileRow, firstTileCol, secondTileRow, secondTileCol);

   const { board } = state;

   board[firstTileRow][firstTileCol] = firstTile;
   board[secondTileRow][secondTileCol] = secondTile;
};

const addClassesToTile = (tile, number) => {
   tile.classList.add("tile");
   switch (number) {
      case 2:
         tile.classList.add("two");
         break;
      case 4:
         tile.classList.add("four");
         break;
      case 8:
         tile.classList.add("eight");
         break;
      case 16:
         tile.classList.add("sixteen");
         break;
      case 32:
         tile.classList.add("thirty-two");
         break;
      case 64:
         tile.classList.add("sixty-four");
         break;
      case 128:
         tile.classList.add("one-twenty-eight");
         break;
      case null:
         break;
      default:
         tile.classList.add("extra");
         break;
   }
};

const updateWinningContainerDisplay = (display) => {
   const winningContainer = qs("#winningContainer");
   winningContainer.style.display = display;
};

const updateLosingContainerDisplay = (display) => {
   const losingContainer = qs("#losingContainer");
   losingContainer.style.display = display;
};

const updateCurrentScore = () => {
   const scoreElement = qs("#score");
   scoreElement.innerHTML = state.score;
};

const updateBestScore = () => {
   if (state.score > state.bestScore) {
      state.bestScore = state.score;
   }
   const bestScoreElement = qs("#bestScore");
   bestScoreElement.innerHTML = state.bestScore;
};

const updateUI = () => {
   const gameBoard = qs("#gameBoard");

   while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
   }

   const { board } = state;
   board.forEach((row) => {
      row.forEach((number) => {
         const tile = document.createElement("div");
         tile.innerHTML = number;
         addClassesToTile(tile, number);
         gameBoard.appendChild(tile);
      });
   });

   updateCurrentScore();

   if (state.status === gameStatus.won) {
      updateWinningContainerDisplay("flex");
   }

   if (state.status === gameStatus.lost) {
      updateLosingContainerDisplay("flex");
   }
};

const mergeLeft = (board) => {
   for (let i = 0; i < 3; i++) {
      for (let j = 1; j < 3; j++) {
         if (board[i][j] === null) {
            continue;
         }
         let k = j - 1;
         while (k >= 0 && board[i][k] === null) {
            k -= 1;
         }
         if (k >= 0 && board[i][k] === board[i][j]) {
            board[i][k] += board[i][j];
            state.score += board[i][k];
            board[i][j] = null;
         }
         if (k === -1) {
            board[i][0] = board[i][j];
            board[i][j] = null;
         } else if (board[i][k + 1] === null) {
            board[i][k + 1] = board[i][j];
            board[i][j] = null;
         }
         k += 1;
         while (k < 2 && board[i][k] === null) {
            board[i][k] = board[i][k + 1];
            board[i][k + 1] = null;
            k += 1;
         }
      }
   }
};

const mergeTop = (board) => {
   for (let i = 1; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         if (board[i][j] === null) {
            continue;
         }
         let k = i - 1;
         while (k >= 0 && board[k][j] === null) {
            k -= 1;
         }
         if (k >= 0 && board[k][j] === board[i][j]) {
            board[k][j] += board[i][j];
            state.score += board[k][j];
            board[i][j] = null;
         }
         if (k === -1) {
            board[0][j] = board[i][j];
            board[i][j] = null;
         } else if (board[k + 1][j] === null) {
            board[k + 1][j] = board[i][j];
            board[i][j] = null;
         }
         k += 1;
         while (k < 2 && board[k][j] === null) {
            board[k][j] = board[k + 1][j];
            board[k + 1][j] = null;
            k += 1;
         }
      }
   }
};

const mergeRight = (board) => {
   for (let i = 0; i < 3; i++) {
      for (let j = 1; j >= 0; j--) {
         if (board[i][j] === null) {
            continue;
         }
         let k = j + 1;
         while (k <= 2 && board[i][k] === null) {
            k += 1;
         }
         if (k <= 2 && board[i][k] === board[i][j]) {
            board[i][k] += board[i][j];
            state.score += board[i][k];
            board[i][j] = null;
         }
         if (k === 3) {
            board[i][2] = board[i][j];
            board[i][j] = null;
         } else if (board[i][k - 1] === null) {
            board[i][k - 1] = board[i][j];
            board[i][j] = null;
         }
         k -= 1;
         while (k > 0 && board[i][k] === null) {
            board[i][k] = board[i][k - 1];
            board[i][k - 1] = null;
            k -= 1;
         }
      }
   }
};

const mergeBottom = (board) => {
   for (let i = 1; i >= 0; i--) {
      for (let j = 0; j < 3; j++) {
         if (board[i][j] === null) {
            continue;
         }
         let k = i + 1;
         while (k <= 2 && board[k][j] === null) {
            k += 1;
         }
         if (k <= 2 && board[k][j] === board[i][j]) {
            board[k][j] += board[i][j];
            state.score += board[k][j];
            board[i][j] = null;
         }
         if (k === 3) {
            board[2][j] = board[i][j];
            board[i][j] = null;
         } else if (board[k - 1][j] === null) {
            board[k - 1][j] = board[i][j];
            board[i][j] = null;
         }
         k -= 1;
         while (k < 0 && board[k][j] === null) {
            board[k][j] = board[k - 1][j];
            board[k - 1][j] = null;
            k -= 1;
         }
      }
   }
};

const isBoardFull = (board) => {
   for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         if (board[i][j] === null) {
            return false;
         }
      }
   }
   return true;
};

const addANewTile = (board) => {
   if (isBoardFull(board)) {
      return;
   }

   const tile = getRandomStartTile();

   let row = getRandomInt(0, 3);
   let col = getRandomInt(0, 3);

   while (board[row][col] !== null) {
      row = getRandomInt(0, 3);
      col = getRandomInt(0, 3);
   }

   board[row][col] = tile;
};

const checkForWinningCondition = (board) => {
   let won = false;
   for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         if (board[i][j] === 128) {
            won = true;
            break;
         }
      }
      if (won) {
         break;
      }
   }
   if (won) {
      state.status = gameStatus.won;
      updateBestScore();
   }
};

const checkForLosingCondition = (board) => {
   let lost = true;
   for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         if (board[i][j] === null) {
            lost = false;
            break;
         }
         if (i === 0) {
            if (board[i][j] === board[i + 1][j]) {
               lost = false;
               break;
            }
            if (j + 1 <= 2 && board[i][j] === board[i][j + 1]) {
               lost = false;
               break;
            }
            if (j - 1 >= 0 && board[i][j] === board[i][j - 1]) {
               lost = false;
               break;
            }
         } else if (j === 0) {
            if (board[i][j] === board[i][j + 1]) {
               lost = false;
               break;
            }
            if (i + 1 <= 2 && board[i][j] === board[i + 1][j]) {
               lost = false;
               break;
            }
            if (i - 1 >= 0 && board[i][j] === board[i - 1][j]) {
               lost = false;
               break;
            }
         } else if (i === 2) {
            if (board[i][j] === board[i - 1][j]) {
               lost = false;
               break;
            }
            if (j + 1 <= 2 && board[i][j] === board[i][j + 1]) {
               lost = false;
               break;
            }
            if (j - 1 >= 0 && board[i][j] === board[i][j - 1]) {
               lost = false;
               break;
            }
         } else if (j === 2) {
            if (board[i][j] === board[i][j - 1]) {
               lost = false;
               break;
            }
            if (i + 1 <= 2 && board[i][j] === board[i + 1][j]) {
               lost = false;
               break;
            }
            if (i - 1 >= 0 && board[i][j] === board[i - 1][j]) {
               lost = false;
               break;
            }
         }

         if (!lost) {
            break;
         }
      }
      if (!lost) {
         break;
      }
   }
   if (lost) {
      state.status = gameStatus.lost;
      updateBestScore();
   }
};

const continuePlayingGame = () => {
   updateWinningContainerDisplay("none");
   state.status = gameStatus.continuing;
};

const mergeTiles = (event) => {
   const { board } = state;
   const keyCode = event.keyCode;
   let updateGameState = false;
   if (
      state.status === gameStatus.playing ||
      state.status === gameStatus.continuing
   ) {
      if (keyCode === 37) {
         mergeLeft(board);
         updateGameState = true;
      } else if (keyCode === 38) {
         mergeTop(board);
         updateGameState = true;
      } else if (keyCode === 39) {
         mergeRight(board);
         updateGameState = true;
      } else if (keyCode === 40) {
         mergeBottom(board);
         updateGameState = true;
      }
      if (updateGameState) {
         if (state.status === gameStatus.playing) {
            checkForWinningCondition(board);
         }
         addANewTile(board);
         checkForLosingCondition(board);
         updateUI();
      }
   }
};

const addEvents = () => {
   window.addEventListener("keydown", mergeTiles);

   const newGameButton = qs("#newGameButton");
   const winningNewGameButton = qs("#winningNewGameButton");
   const winningContinueButton = qs("#winningContinueButton");
   const tryAgainButton = qs("#tryAgainButton");

   newGameButton.addEventListener("click", startGame);
   winningNewGameButton.addEventListener("click", startGame);
   winningContinueButton.addEventListener("click", continuePlayingGame);
   tryAgainButton.addEventListener("click", startGame);
};

const startGame = () => {
   initState();
   updateWinningContainerDisplay("none");
   updateLosingContainerDisplay("none");
   addEvents();
   addInitialTiles();
   updateUI();
};

startGame();
