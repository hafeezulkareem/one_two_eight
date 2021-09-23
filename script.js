const qs = (selector) => document.querySelector(selector);

const qsa = (selector) => document.querySelectorAll(selector);

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

const startGame = () => {
   addInitialTiles();
   updateUI();
};

startGame();
