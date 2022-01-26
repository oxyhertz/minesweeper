"use strict";

const EMPTY = "";
const FLAG = "🚩";
const WIN = "😎";
const LOSE = "😥";
const SMILEY = "😊";
const TIME = "⌛";
const LIVE = "💖";
var gFirstClick;
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
  gLevel.LIVES = 1;
  gAvailablePos = [];
  gBoard = createMat(gLevel.SIZE);
  gMinesPos = setRandMines(gBoard);
  setMinesNegsCount();
  rendMat(gBoard);
  elEmoji.innerText = SMILEY;
  timeEl.innerText = TIME;
  clearInterval(gTimeInterval);
  gTimeInterval = null;
  gTimer = 0;
  gGame.isOn = true;
  gFirstClick = false;
}

function cellClicked(elCell, event, i, j) {
  var currCell = gBoard[i][j];
  if (elCell.classList.contains("clicked")) return;
  if (!gGame.isOn) return;

  if (!gGame.shownCount) {
    console.log("first click");
    gTimeInterval = setInterval(runTime, 10);
  }

  // Mouse Left Click
  if (!event.button) {
    if (currCell.isMarked) return;
    currCell.isShown = true;

    if (currCell.isMine) {
      if (gLevel.LIVES === 0) {
        gameStops();
        elCell.innerText = MINE;
        elCell.style.backgroundColor = "red";
        elEmoji.innerText = LOSE;
        revealMines(gMinesPos);
      }
      gLevel.LIVES--;
      console.log(gLevel.LIVES);
      //   gameStops();
      elCell.innerText = MINE;
      //   elCell.style.backgroundColor = "red";
      //   elEmoji.innerText = LOSE;
      //   revealMines(gMinesPos);
    }

    elCell.classList.add("clicked");
    if (!currCell.minesAroundCount && !currCell.isMine) {
      gGame.shownCount++;
      checkWin();
      expandShown(gBoard, elCell, i, j);
    }
    if (currCell.minesAroundCount && !currCell.isMine) {
      gGame.shownCount++;
      checkWin();
      elCell.innerText = currCell.minesAroundCount;
    }
  }
  //   if (gGame.shownCount) {
  //     gMinesPos = setRandMines(gBoard);
  //     setMinesNegsCount();
  //   }

  // Mouse Right Click
  if (event.button === 2) {
    cellMarked(elCell, currCell);
  }
}

function expandShown(board, elCell, possI, possJ) {
  for (var i = possI - 1; i <= possI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = possJ - 1; j <= possJ + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === possI && j === possJ) continue;
      var currCell = board[i][j];
      if (currCell.isMarked) continue;
      if (!currCell.isShown) {
        gGame.shownCount++;
        checkWin();
      }

      var elCurrCell = document.querySelector(`.cell-${i}-${j}`);
      elCurrCell.classList.add("clicked");
      currCell.isShown = true;
      if (currCell.minesAroundCount) elCurrCell.innerHTML = currCell.minesAroundCount;
    }
  }
}

function cellMarked(elCell, currCell) {
  //   if (elCell.classList.contains("clicked")) return;
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
  if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) {
    gameStops();
    elEmoji.innerText = WIN;
    console.log("WIN!");
  }
}

function gameStops() {
  gGame.isOn = false;
  clearInterval(gTimeInterval);
  gTimeInterval = null;
}

function runTime() {
  timeEl.innerText = (++gTimer / 100).toFixed(1);
}
