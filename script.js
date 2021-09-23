const qs = (selector) => document.querySelector(selector);

const qsa = (selector) => document.querySelectorAll(selector);

const tilesUIInformation = {
   2: { bgColor: "#eee4da", color: "#776e65" },
   4: { bgColor: "#eee1c9", color: "#776e65" },
   8: { bgColor: "#f3b27a", color: "#ffffff" },
   16: { bgColor: "#f69664", color: "#ffffff" },
   32: { bgColor: "#f77c5f", color: "#ffffff" },
   64: { bgColor: "#f75f3b", color: "#ffffff" },
   128: { bgColor: "#edc53f", color: "#ffffff" },
};

const getRandomInt = (min, max) =>
   Math.floor(Math.random() * (max - min) + min);

const getRandomStartTile = () => (getRandomInt(0, 2) === 0 ? 2 : 4);

const getInitialState = () => {
   return {
      state: "PLAYING",
      board: [
         [null, null, null],
         [null, null, null],
         [null, null, null],
      ],
   };
};

const state = getInitialState();

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

const updateUI = () => {
   const gameBoard = qs("#gameBoard");

   const { board } = state;
   board.forEach((row) => {
      row.forEach((item) => {
         const tile = document.createElement("div");
         tile.innerHTML = item;
         tile.className = "tile";
         gameBoard.appendChild(tile);
      });
   });
};

const startGame = () => {
   addInitialTiles();
   updateUI();
};

startGame();
