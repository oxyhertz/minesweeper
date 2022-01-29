"use strict";

const EMPTY = "";
const FLAG = `<img src="images/flag.gif" width="25px" height="25px">`;
const WIN = `<img src="images/cool2.gif" width="45px" height="45px">`;
const LOSE = `<img src="images/lose.gif" width="45px" height="45px">`;
const SMILEY = `<img src="images/normal.gif" width="45px" height="45px">`;

var bestTimes = {
  easy: Infinity,
  medium: Infinity,
  hard: Infinity,
};

var gIs7Boom;
var gIsMineByUser;
var gUserMinesCount;
var gIsMinesLeft;
var gIsFirstClick;
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
  renderLives();
  gBoard = createMat(gLevel.SIZE);
  gAvailablePos = [];
  rendMat(gBoard);
  elEmoji.innerHTML = SMILEY;
  clearInterval(gTimeInterval);
  gTimeInterval = null;
  gTimer = 0;
  timeEl.innerHTML = EMPTY;
  gGame.isOn = true;
  gIsFirstClick = false;
  gHintCounts = 3;
  gSafeClickCount = 3;
  gElClicksLeft.innerText = 3;
  document.querySelector(".user-mines-left").innerText = "";
  printScores();
  resetHints();
  gAvailablePos = [];
  gMinesPos = [];
  gIsMinesLeft = false;
  gUserMinesCount = 0;
  gIsUserPlay = false;
  gIsHintClicked = false;
  gIs7Boom = false;
  gIsMineByUser = false;
}

function cellClicked(elCell, event, i, j) {
  var currCell = gBoard[i][j];
  if (elCell.classList.contains("clicked")) return;
  if (!gGame.isOn || gIsMinesLeft) return;

  // Mouse Left Click
  if (!event.button) {
    if (currCell.isMarked) return;
    if (gIsMineByUser) {
      userMines(elCell, i, j);
      return;
    }
    if (gIsHintClicked && gHintCounts > 0) {
      hintReveal(i, j);
      gGame.isOn = false;
      setTimeout(() => {
        hintUnreveal(i, j);
        gIsHintClicked = false;
        gHintCounts--;
        gGame.isOn = true;
      }, 700);
    } else {
      runTimer();
      currCell.isShown = true;

      // set mines in rand positions on first click
      if (!gIsFirstClick) {
        gIsFirstClick = true;
        if (!gIsUserPlay && !gIs7Boom) {
          gAvailablePos = findAvailablPos(gBoard);
          gMinesPos = setRandMines(gBoard);
        }
        setMinesNegsCount();
      }

      // if currCell is mine
      if (currCell.isMine) {
        if (gLevel.LIVES === 0) {
          gameStops();
          elCell.innerText = MINE;
          elCell.style.backgroundColor = "red";
          elEmoji.innerHTML = LOSE;
          revealMines(gMinesPos);
        } else {
          gGame.shownCount++;
          checkWin();
          addAction(i, j);
          gLevel.LIVES--;
          if (gLevel.LIVES < 0) return;
          elLives.innerHTML = renderLives();
          elCell.innerText = MINE;
        }
      }

      elCell.classList.add("clicked");
      // if currcell is not mine and doesnt have negs
      if (!currCell.minesAroundCount && !currCell.isMine) {
        gGame.shownCount++;
        checkWin();
        addAction(i, j);

        expandShown(gBoard, i, j);
      }
      // if curcell have mine negs
      if (currCell.minesAroundCount && !currCell.isMine) {
        gGame.shownCount++;

        checkWin();
        addAction(i, j);

        elCell.innerText = currCell.minesAroundCount;
      }
    }
  }

  // Mouse Right Click
  if (event.button === 2) {
    if (gIsMineByUser) return;
    cellMarked(elCell, currCell);
    addAction(i, j);
  }
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
      if (gIsFirstClick && gIs7Boom) {
        posMines7Boom();
        setMinesNegsCount();
      }
      checkWin();
      addAction(i, j);

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
    if (currCell.isMine) gGame.markedCount--;

    checkWin();
  } else {
    // mark
    currCell.isMarked = true;
    elCell.innerHTML = FLAG;
    if (currCell.isMine) gGame.markedCount++;
    checkWin();
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
