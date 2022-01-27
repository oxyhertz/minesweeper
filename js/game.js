"use strict";

const EMPTY = "";
const FLAG = "🚩";
const WIN = "😎";
const LOSE = "😥";
const SMILEY = "😊";
const TIME = "⌛";
const LIVE = "💖";

var bestTimes = {
  easy: Infinity,
  medium: Infinity,
  hard: Infinity,
};

var gUserMinesCount;
var gIsMineByUser;
var gIsRecOn;
var gIsFirstClick = false;
var gTimer;
var gAvailablePos;
var gBoard;
var gFlagged;
var gTimeInterval;
var gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 1,
};

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

// global els
var elEmoji = document.querySelector(".game-condition");
var timeEl = document.querySelector(".game-timer");

function init() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gLevel.LIVES = 3;
  elLives.innerHTML = gLevel.LIVES;
  gBoard = createMat(gLevel.SIZE);
  gAvailablePos = [];
  rendMat(gBoard);
  elEmoji.innerText = SMILEY;
  clearInterval(gTimeInterval);
  gTimeInterval = null;
  gTimer = 0;
  timeEl.innerText = 0;
  gGame.isOn = true;
  gIsFirstClick = false;
  gHintCounts = 3;
  gSafeClickCount = 3;
  gElClicksLeft.innerText = 3;
  gIsRecOn = true;
  printScores();
  resetHints();
  gAvailablePos = [];
  gMinesPos = [];
  gIsMineByUser = false;
  gUserMinesCount = 0;
}

function cellClicked(elCell, event, i, j) {
  var currCell = gBoard[i][j];
  if (elCell.classList.contains("clicked")) return;
  if (!gGame.isOn || gIsMineByUser) return;

  // run timer in first click
  if (!gTimer) {
    console.log("first click");
    gTimeInterval = setInterval(runTime, 100);
  }

  // Mouse Left Click
  if (!event.button) {
    if (currCell.isMarked) return;
    if (gIsHintClicked && gHintCounts > 0) {
      hintReveal(i, j);
      gGame.isOn = false;
      setTimeout(() => {
        hintUnreveal(i, j);
        gIsHintClicked = false;
        gHintCounts--;
        gGame.isOn = true;
      }, 1000);
    } else {
      currCell.isShown = true;

      // set mines in rand positions on first click
      if (!gIsFirstClick) {
        gIsFirstClick = true;
        gAvailablePos = findAvailablPos(gBoard);
        gMinesPos = setRandMines(gBoard);
        setMinesNegsCount();
      }

      // if currCell is mine
      if (currCell.isMine) {
        if (gLevel.LIVES === 0) {
          gameStops();
          elCell.innerText = MINE;
          elCell.style.backgroundColor = "red";
          elEmoji.innerText = LOSE;
          revealMines(gMinesPos);
        } else {
          gGame.shownCount++;
          checkWin();
          gLevel.LIVES--;
          if (gLevel.LIVES < 0) return;
          elLives.innerHTML = gLevel.LIVES;
          elCell.innerText = MINE;
        }
      }

      elCell.classList.add("clicked");
      // if currcell is not mine and doesnt have negs
      if (!currCell.minesAroundCount && !currCell.isMine) {
        gGame.shownCount++;
        checkWin();
        // debugger;
        expandShown(gBoard, i, j);
      }
      // if curcell have mine negs
      if (currCell.minesAroundCount && !currCell.isMine) {
        gGame.shownCount++;
        checkWin();
        elCell.innerText = currCell.minesAroundCount;
      }
    }
  }

  // Mouse Right Click
  if (event.button === 2) {
    cellMarked(elCell, currCell);
  }
  console.log(gGame.shownCount);
}

function expandShown(board, possI, possJ) {
  for (var i = possI - 1; i <= possI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = possJ - 1; j <= possJ + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === possI && j === possJ) continue;
      var currCell = board[i][j];
      if (currCell.isMarked || currCell.isShown || currCell.isMine) continue;
      gGame.shownCount++;
      checkWin();
      var elCurrCell = document.querySelector(`.cell-${i}-${j}`);
      elCurrCell.classList.add("clicked");
      currCell.isShown = true;
      if (currCell.minesAroundCount) elCurrCell.innerHTML = currCell.minesAroundCount;
      if (!currCell.minesAroundCount) {
        expandShown(gBoard, i, j);
      }
    }
  }
}

function cellMarked(elCell, currCell) {
  // unmark

  if (currCell.isMarked) {
    currCell.isMarked = false;
    elCell.innerText = EMPTY;
    gGame.markedCount--;
    checkWin();
  } else {
    // mark
    currCell.isMarked = true;
    elCell.innerText = FLAG;
    gGame.markedCount++;
    checkWin();
  }
}

function checkWin() {
  if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2) {
    gameStops();
    elEmoji.innerText = WIN;
    console.log("WIN!");
    checkBestScore();
  }
}

function gameStops() {
  gGame.isOn = false;
  clearInterval(gTimeInterval);
  gTimeInterval = null;
}

function checkBestScore() {
  var mode = "";
  switch (gLevel.SIZE) {
    case 4:
      mode = "easy";
      break;
    case 8:
      mode = "medium";
      break;
    case 12:
      mode = "hard";
      break;
  }

  var elTime = document.querySelector(`.${mode}`);
  var bestTime = localStorage.getItem(mode) ? localStorage.getItem(mode) : Infinity;
  var currTime = gTimer / 10;

  if (bestTime > currTime) {
    localStorage.setItem(mode, currTime);
    elTime.innerText = currTime;
  } else {
    elTime.innerText = bestTime;
  }
}
