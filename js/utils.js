"use strict";

function createMat(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }

  return board;
}

function rendMat(mat) {
  var strHTML = "";
  for (var i = 0; i < mat.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];

      var className = `cell cell-${i}-${j}`;
      strHTML += `<td class="${className}" onmousedown="cellClicked(this, event, ${i}, ${j})"></td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody>";
  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//count negs with mine
function countNegs(mat, rowIdx, colIdx) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      var currCell = mat[i][j];
      if (currCell.isMine) count++;
    }
  }
  return count;
}

var elLives = document.querySelector(".lives");

function easyMode() {
  gLevel.SIZE = 4;
  gLevel.MINES = 2;
  init();
}

function mediumMode() {
  gLevel.SIZE = 8;
  gLevel.MINES = 12;
  init();
}

function hardMode() {
  gLevel.SIZE = 12;
  gLevel.MINES = 30;
  init();
}

// display best scores in reset
function printScores() {
  var elEasy = document.querySelector(".easy");
  var innerText = localStorage.getItem("easy") ? localStorage.getItem("easy") : "  ";
  elEasy.innerText = innerText;

  var elMedium = document.querySelector(".medium");
  innerText = localStorage.getItem("medium") ? localStorage.getItem("medium") : "  ";
  elMedium.innerText = innerText;

  var elHard = document.querySelector(".hard");
  innerText = localStorage.getItem("hard") ? localStorage.getItem("hard") : " ";
  elHard.innerText = innerText;
}
function runTime() {
  timeEl.innerText = (++gTimer / 10).toFixed(1);
}

function checkWin() {
  if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2) {
    gameStops();
    elEmoji.innerHTML = WIN;
    console.log("WIN!");
    checkBestScore();
  }
}

function runTimer() {
  if (!gTimer) {
    gTimeInterval = setInterval(runTime, 100);
  }
}

function renderLives() {
  var str = "";
  var elLives = document.querySelector(".lives");
  for (var i = 0; i < gLevel.LIVES; i++) {
    str += `<img src="images/hear2.png" width="45px" height="45px">`;
  }
  elLives.innerHTML = str;

  return str;
}
