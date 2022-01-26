"use strict";

const EMPTY = "";
const FLAG = "🚩";
var SIZE = 4;
var gAvailablePos;
var gBoard;
var gFlagged;
var gFirstClicked;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init() {
  gAvailablePos = [];
  gBoard = createMat(gLevel.SIZE);
  gFirstClicked = false;
  rendMat(gBoard);
}

function cellClicked(elCell, event, i, j) {
  var currCell = gBoard[i][j];
  if (!event.button) {
    if (currCell.isMarked) return;
    if (!gGame.shownCount) {
      gMinesPos = setRandMines(gBoard);
      setMinesNegsCount();
    }
    gGame.shownCount++;

    currCell.isShown = true;
    if (currCell.isMine) {
      elCell.innerText = MINE;
      elCell.style.backgroundColor = "red";
      revealMines(gMinesPos);
    }
    elCell.classList.add("clicked");
    if (!currCell.minesAroundCount && !currCell.isMine) {
      expandShown(gBoard, elCell, i, j);
    }
    if (currCell.minesAroundCount && !currCell.isMine) {
      elCell.innerText = currCell.minesAroundCount;
    }
    // first click
  }

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
      if (currCell.isMine) return;
      if (currCell.isMarked) continue;
      //   var elCurrCell = document.querySelector(`.cell-${i}-${j}`);
      elCell.classList.add("clicked");
      if (currCell.minesAroundCount) elCell.innerHTML = currCell.minesAroundCount;
    }
  }
}

function cellMarked(elCell, currCell) {
  if (elCell.classList.contains("clicked")) return;
  // unmark
  if (currCell.isMarked) {
    currCell.isMarked = false;
    elCell.innerText = EMPTY;
    gGame.markedCount--;
  } else {
    // mark
    currCell.isMarked = true;
    elCell.innerText = FLAG;
    gGame.markedCount++;
  }
  console.log(gGame.markedCount);
}
