"use strict";

/////////////////////////////
// Avatar Data
///////////////////////

const avatarData = {
  freddy: {
    name: "freddy",
    url: "./assets/freddy-fazbear-avatar-125x125.png",
    backdrop: "",
    isSelected: false,
    isConfirmed: false,
  },
  bonnie: {
    name: "bonnie",
    url: "./assets/bonnie-the-bunny-avatar-125x125.png",
    backdrop: "",
    isSelected: false,
    isConfirmed: false,
  },
  chica: {
    name: "chica",
    url: "./assets/chica-the-chicken-avatar-125x125.png",
    backdrop: "",
    isSelected: false,
    isConfirmed: false,
  },
  carl: {
    name: "carl",
    url: "./assets/carl-the-cupcake-avatar-125x125.png",
    backdrop: "",
    isSelected: false,
    isConfirmed: false,
  },
};

/////////////////////////////////////////////
// Connect varibales to DOM elements
///////////////////////

const introPageContainerElement = document.querySelector(
  ".intro-page-container"
);
const player1NameInput = document.querySelector(".player-1-name");
const player2NameInput = document.querySelector(".player-2-name");
const playGameBtn = document.querySelector(".play-game-btn");
const devSkipBtn = document.querySelector(".dev-skip-btn");
const characterSelectContainerElement = document.querySelector(
  ".character-select-container"
);
const characterSelectMessage = document.querySelector(
  ".character-select-message"
);
const characterSelectPlayerName = document.querySelector(
  ".character-select--current-player"
);
const confirmCharacterBtn = document.querySelector(".confirm-character-btn");
const characterSelectFreddyBtn = document.querySelector(
  ".character-select-freddy"
);
const characterSelectBonnieBtn = document.querySelector(
  ".character-select-bonnie"
);
const characterSelectCarlBtn = document.querySelector(".character-select-carl");
const characterSelectChicaBtn = document.querySelector(
  ".character-select-chica"
);
const currentPlayerElement = document.querySelector(
  ".game-board--current-player"
);
const gameBoardContainerElement = document.querySelector(
  ".game-board-container"
);
const cellElement = document.querySelectorAll(".cell");

// Scorboard elements
const player1WinsElement = document.querySelector(".player-1-wins");
const player2WinsElement = document.querySelector(".player-2-wins");

const playAgainBtn = document.querySelector(".play-again-btn");
const endGameBtn = document.querySelector(".end-game-btn");

const soundToggleBtn = document.querySelector(".sound-toggle");

/////////////////////////////
// Set up variables
///////////////////////

let player0 = {
  name: "",
  character: "",
  url: "",
  cells: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  wins: 0,
};
let player1 = {
  name: "",
  character: "",
  url: "",
  cells: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  wins: 0,
};
let currentPlayer = 0;
let isPlaying;
let availableCells;
let selectedCharacter;

// How we check if a cell is already taken
const cellData = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

const allWinningCombos = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
];

// Sounds
let soundOn = true;
const bgmusic = new Audio("./assets/fnaftheme.mp3");
const click1 = new Audio("./assets/click1.wav");
const click2 = new Audio("./assets/click2.wav");
const winGame = new Audio("./assets/wingame.wav");

// Start BG music
bgmusic.play();

// Set volume
bgmusic.volume = 0.25;
click1.volume = 0.5;
click2.volume = 0.5;
winGame.volume = 0.1;

/////////////////////////////
// Functions
///////////////////////

function getRandomPlayer() {
  // Get random number between 0(player1) or 1(player2) and set to current player var
  let randomNum = Math.floor(Math.random() * 2);
  currentPlayer = randomNum;
  // Current player chooses character first
  document.querySelector(".character-select--current-player").textContent =
    currentPlayer === 0 ? player0.name : player1.name;
}

function deselectAllCharacters() {
  document.querySelectorAll(".character").forEach((char) => {
    char.classList.remove("character-selected");
  });
}

function updateUI() {
  if (currentPlayer === 0) {
    characterSelectPlayerName.textContent = player0.name;
    currentPlayerElement.textContent = `${player0.name}, it's your turn!`;
  } else {
    characterSelectPlayerName.textContent = player1.name;
    currentPlayerElement.textContent = `${player1.name}, it's your turn!`;
  }
}

function switchPlayerTurn() {
  currentPlayer === 0 ? currentPlayer++ : currentPlayer--;
  console.log(`Switched turns. It is ${currentPlayer}'s turn`);
  updateUI();
}

function resetPlayerDataCells(player) {
  for (let i = 0; i < player.cells.length; i++) player.cells[i] = 0;
}

function resetGameCells() {
  cellElement.forEach((cell) => {
    cell.style.backgroundColor = "grey";
    cell.style.backgroundImage = "";
    cellData[cell.id] = false;
  });
}
function updateScoreboard() {
  player1WinsElement.textContent = `${player0.name}: ${player0.wins} wins`;
  player2WinsElement.textContent = `${player1.name}: ${player1.wins} wins`;
}

function init() {
  // Set initial states
  switchPlayerTurn();
  isPlaying = true;
  availableCells = 9;
  playAgainBtn.classList.add("hidden");

  updateUI();
  resetGameCells();
  resetPlayerDataCells(player0);
  resetPlayerDataCells(player1);
  updateScoreboard();
}

function checkForWin(currentPlayerCells) {
  // cell value tracks how many cells match a winning combo.. therefor vellValue = 3 is a win
  let cellValue = 0;
  let hasWon = false;
  allWinningCombos.forEach((combo) => {
    combo.forEach((value) => {
      if (currentPlayerCells[value] === 1) cellValue++;
    });
    cellValue === 3 ? (hasWon = true) : (cellValue = 0);
  });

  if (!hasWon) {
    if (availableCells === 0) {
      isPlaying = false;
      console.log(isPlaying);
    } else {
      switchPlayerTurn();
    }
  } else {
    isPlaying = false;
    winGame.play();
    if (currentPlayer === 0) {
      player0.wins += 1;
      currentPlayerElement.textContent = `${player0.name}, You win!`;
    } else {
      player1.wins += 1;
      currentPlayerElement.textContent = `${player1.name}, You win!`;
    }
    playAgainBtn.classList.toggle("hidden");
    updateScoreboard();
  }
}

function fullReset() {
  // Reset player data to empty
  player0 = {
    name: "",
    character: "",
    url: "",
    cells: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    wins: 0,
  };
  player1 = {
    name: "",
    character: "",
    url: "",
    cells: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    wins: 0,
  };
  // Reset game board and show the intro page
  gameBoardContainerElement.classList.add("hidden");
  characterSelectContainerElement.classList.add("hidden");
  introPageContainerElement.classList.remove("hidden");
  // Reset the character select screen
  selectedCharacter = "";
  document.querySelectorAll(".character").forEach((char) => {
    char.classList.remove("character-selected");
    char.classList.remove("greyscale");
  });
  // Reset avatar data back to default
  avatarData.freddy.isConfirmed = false;
  avatarData.freddy.isSelected = false;
  avatarData.bonnie.isConfirmed = false;
  avatarData.bonnie.isSelected = false;
  avatarData.carl.isConfirmed = false;
  avatarData.carl.isSelected = false;
  avatarData.chica.isConfirmed = false;
  avatarData.chica.isSelected = false;
}

/////////////////////////////
// Event Listeners
///////////////////////
soundToggleBtn.addEventListener("click", function () {
  soundOn = !soundOn;
  if (soundOn === false) bgmusic.pause();
  else bgmusic.play();

  if (soundOn) soundToggleBtn.textContent = "SOUND OFF";
  else soundToggleBtn.textContent = "SOUND ON";
  console.log(soundOn);
});

playGameBtn.addEventListener("click", function () {
  // Check for name inputs and save name to each player.
  if (player1NameInput.value === "" || player2NameInput.value === "") {
    console.log("Enter a name for both players");
  } else {
    if (soundOn) click2.play();
    player0.name = player1NameInput.value.toUpperCase();
    player1.name = player2NameInput.value.toUpperCase();
    characterSelectContainerElement.classList.remove("hidden");
    introPageContainerElement.classList.add("hidden");
    getRandomPlayer();
    player1NameInput.value = "";
    player2NameInput.value = "";
  }
});

// Character Selection
document.querySelectorAll(".character").forEach((char) => {
  char.addEventListener("click", function () {
    if (soundOn) click1.play();
    selectedCharacter = char.dataset.char;
    deselectAllCharacters();
    char.classList.add("character-selected");
  });
});

confirmCharacterBtn.addEventListener("click", function () {
  if (player0.url === "" || player1.url === "") {
    if (soundOn) click2.play();
    if (currentPlayer === 0) {
      switch (selectedCharacter) {
        case "freddy":
          if (!avatarData.freddy.isConfirmed) {
            characterSelectFreddyBtn.classList.add("greyscale");
            player0.character = avatarData.freddy.name;
            player0.url = avatarData.freddy.url;
            avatarData.freddy.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
        case "bonnie":
          if (!avatarData.bonnie.isConfirmed) {
            characterSelectBonnieBtn.classList.add("greyscale");
            player0.character = avatarData.bonnie.name;
            player0.url = avatarData.bonnie.url;
            avatarData.bonnie.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
        case "carl":
          if (!avatarData.carl.isConfirmed) {
            characterSelectCarlBtn.classList.add("greyscale");
            player0.character = avatarData.carl.name;
            player0.url = avatarData.carl.url;
            avatarData.carl.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
        case "chica":
          if (!avatarData.chica.isConfirmed) {
            characterSelectChicaBtn.classList.add("greyscale");
            player0.character = avatarData.chica.name;
            player0.url = avatarData.chica.url;
            avatarData.chica.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
      }
    } else {
      switch (selectedCharacter) {
        case "freddy":
          if (!avatarData.freddy.isConfirmed) {
            characterSelectFreddyBtn.classList.add("greyscale");
            player1.character = avatarData.freddy.name;
            player1.url = avatarData.freddy.url;
            avatarData.freddy.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
        case "bonnie":
          if (!avatarData.bonnie.isConfirmed) {
            characterSelectBonnieBtn.classList.add("greyscale");
            player1.character = avatarData.bonnie.name;
            player1.url = avatarData.bonnie.url;
            avatarData.bonnie.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
        case "carl":
          if (!avatarData.carl.isConfirmed) {
            characterSelectCarlBtn.classList.add("greyscale");
            player1.character = avatarData.carl.name;
            player1.url = avatarData.carl.url;
            avatarData.carl.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
        case "chica":
          if (!avatarData.chica.isConfirmed) {
            characterSelectChicaBtn.classList.add("greyscale");
            player1.character = avatarData.chica.name;
            player1.url = avatarData.chica.url;
            avatarData.chica.isConfirmed = true;
            switchPlayerTurn();
          } else {
            characterSelectMessage.textContent = "THAT CHARACTER IS TAKEN!";
          }
          break;
      }
    }
  }
  if (player0.url !== "" && player1.url !== "") {
    characterSelectContainerElement.classList.add("hidden");
    gameBoardContainerElement.classList.remove("hidden");
    init();
  }
});

// Selecting the cell
cellElement.forEach((cell) => {
  cell.addEventListener("click", function () {
    if (isPlaying && availableCells > 0) {
      if (cellData[cell.id]) {
        if (soundOn) click1.play();
        currentPlayerElement.textContent = "That space is taken!";
      } else {
        if (currentPlayer === 0) {
          if (soundOn) click2.play();
          cell.style.backgroundImage = `url(${player0.url})`;
          // cell.style.objectFit = "cover";
          player0.cells[cell.id] = 1;
          checkForWin(player0.cells);
        } else {
          if (soundOn) click2.play();
          cell.style.backgroundImage = `url(${player1.url})`;
          // cell.style.objectFit = "cover";
          player1.cells[cell.id] = 1;
          checkForWin(player1.cells);
        }
        cellData[cell.id] = true;
        availableCells--;
        // if no more available moves, end game
        if (availableCells <= 0) {
          playAgainBtn.classList.remove("hidden");
          currentPlayerElement.textContent = "No winner! Play again?";
        }
      }
    }
  });
});

playAgainBtn.addEventListener("click", function () {
  if (soundOn) click1.play();
  init();
});

endGameBtn.addEventListener("click", function () {
  if (soundOn) click2.play();
  fullReset();
});
