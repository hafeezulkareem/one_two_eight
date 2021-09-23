const qs = (selector) => document.querySelector(selector);

const qsa = (selector) => document.querySelectorAll(selector);

const getRandomInt = (min, max) =>
   Math.floor(Math.random() * (max - min) + min);

const getRandomStartTile = () => (getRandomInt(0, 2) === 0 ? 2 : 4);

let state;

const initState = () => {
   state = {
      state: "PLAYING",
      board: [
         [null, null, null],
         [null, null, null],
         [null, null, null],
      ],
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
};

const mergeLeft = (board) => {
   for (let i = 0; i < 3; i++) {
      for (let j = 2; j > 0; j--) {
         let k = j - 1;
         while (k >= 0 && board[i][k] === null) {
            k -= 1;
         }
         if (k >= 0 && board[i][j] === board[i][k]) {
            board[i][k] += board[i][j];
            board[i][j] = null;
         }
         if (k === -1) {
            board[i][0] = board[i][j];
            board[i][j] = null;
         } else if (board[i][k + 1] === null) {
            board[i][k + 1] = board[i][j];
            board[i][j] = null;
         }
         k += 2;
         while (k < 2 && board[i][k] === null) {
            board[i][k] = board[i][k + 1];
            board[i][k + 1] = null;
            k += 1;
         }
      }
   }
};

const mergeTop = (board) => {
   for (let i = 2; i > 0; i--) {
      for (let j = 0; j < 3; j++) {
         let k = i - 1;
         while (k >= 0 && board[k][j] === null) {
            k -= 1;
         }
         if (k >= 0 && board[i][j] === board[k][j]) {
            board[k][j] += board[i][j];
            board[i][j] = null;
         }
         if (k === -1) {
            board[0][j] = board[i][j];
            board[i][j] = null;
         } else if (board[k + 1][j] === null) {
            board[k + 1][j] = board[i][j];
            board[i][j] = null;
         }
         k += 2;
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
      for (let j = 0; j < 2; j++) {
         let k = j + 1;
         while (k <= 2 && board[i][k] === null) {
            k += 1;
         }
         if (k <= 2 && board[i][j] === board[i][k]) {
            board[i][k] += board[i][j];
            board[i][j] = null;
         }
         if (k === 3) {
            board[i][2] = board[i][j];
            board[i][j] = null;
         } else if (board[i][k - 1] === null) {
            board[i][k - 1] = board[i][j];
            board[i][j] = null;
         }
         k -= 2;
         while (k > 0 && board[i][k] === null) {
            board[i][k] = board[i][k - 1];
            board[i][k - 1] = null;
            k -= 1;
         }
      }
   }
};

const mergeBottom = (board) => {
   for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
         let k = i + 1;
         while (k <= 2 && board[k][j] === null) {
            k += 1;
         }
         if (k <= 2 && board[i][j] === board[k][j]) {
            board[k][j] += board[i][j];
            board[i][j] = null;
         }
         if (k === 3) {
            board[2][j] = board[i][j];
            board[i][j] = null;
         } else if (board[k - 1][j] === null) {
            board[k - 1][j] = board[i][j];
            board[i][j] = null;
         }
         k -= 2;
         while (k > 0 && board[k][j] === null) {
            board[k][j] = board[k - 1][j];
            board[k - 1][j] = null;
            k -= 1;
         }
      }
   }
};

const mergeTiles = (event) => {
   const { board } = state;
   switch (event.keyCode) {
      case 37:
         mergeLeft(board);
         updateUI();
         break;
      case 38:
         mergeTop(board);
         updateUI();
         break;
      case 39:
         mergeRight(board);
         updateUI();
         break;
      case 40:
         mergeBottom(board);
         updateUI();
         break;
      default:
         break;
   }
};

const addEvents = () => {
   window.addEventListener("keydown", mergeTiles);

   const newGameButton = qs("#newGameButton");
   newGameButton.addEventListener("click", startGame);
};

const startGame = () => {
   initState();
   addEvents();
   addInitialTiles();
   updateUI();
};

startGame();
