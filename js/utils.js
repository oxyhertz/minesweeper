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
      gAvailablePos.push({ i: i, j: j });
    }
  }
  // board[0][0].isMine = true;
  // board[3][3].isMine = true;
  return board;
}

function rendMat(mat) {
  var strHTML = "";
  for (var i = 0; i < mat.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var cellContent = "";
      if (cell.isMine) cellContent = MINE;

      // var className = "cell cell-" + i + "-" + j;
      var className = `cell cell-${i}-${j}`;

      if (cell.minesAroundCount !== 0) cellContent = cell.minesAroundCount;

      strHTML += `<td class="${className}"  onmousedown="cellClicked(this, event, ${i}, ${j})"></td>`;
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
  console.log(elCell);
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

function getCountSecondaryDiagonal(symbol) {
  var count = 0;
  for (var i = 0; i < gBoard.length; i++) {
    var currCell = gBoard[i][gBoard.length - i - 1];
    if (currCell === symbol) count++;
  }
  return count;
}

function getCountPrimaryDiagonal(symbol) {
  var count = 0;
  for (var i = 0; i < gBoard.length; i++) {
    var currCell = gBoard[i][i];
    if (currCell === symbol) count++;
  }
  return count;
}
var elLives = document.querySelector(".lives");
function easyMode() {
  gLevel.SIZE = 4;
  gLevel.MINES = 2;
  gLevel.LIVES = 1;
  elLives.innerHTML = "💖";
  init();
}

function mediumMode() {
  gLevel.SIZE = 8;
  gLevel.MINES = 12;
  gLevel.LIVES = 2;
  elLives.innerHTML = "💖💖";

  init();
}

function hardMode() {
  gLevel.SIZE = 12;
  gLevel.MINES = 30;
  gLevel.LIVES = 3;
  elLives.innerHTML = "💖💖💖";
  init();
}
