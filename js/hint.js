"use strict";
var gIsHintClicked = false;
var gHintCounts = 3;

function useHint(elHint) {
  if (!gGame.isOn || !gIsFirstClick) return;
  if (elHint.innerHTML) {
    console.log(elHint);
    elHint.innerHTML = "";
  }
  gIsHintClicked = true;
}

function hintReveal(rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      var curCell = gBoard[i][j];
      var elCurrCell = document.querySelector(`.cell-${i}-${j}`);
      if (curCell.isMine) {
        elCurrCell.innerHTML = MINE;
      } else {
        elCurrCell.innerHTML = gBoard[i][j].minesAroundCount;
      }

      elCurrCell.classList.add("revealed");
    }
  }
}

function hintUnreveal(rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      var curCell = gBoard[i][j];
      var elCurrCell = document.querySelector(`.cell-${i}-${j}`);
      if (curCell.isShown) {
        if (curCell.minesAroundCount && !curCell.isMine)
          renderCell({ i: i, j: j }, curCell.minesAroundCount);
        if (!curCell.minesAroundCount && !curCell.isMine) renderCell({ i: i, j: j }, EMPTY);
        if (curCell.isMine) renderCell({ i: i, j: j }, MINE);
      } else {
        elCurrCell.innerHTML = EMPTY;
      }
      elCurrCell.classList.remove("revealed");
    }
  }
}

function resetHints() {
  var elHints = document.querySelectorAll(".hint");
  for (var i = 0; i < elHints.length; i++) {
    elHints[i].innerHTML = `<img src="images/hint.jpg" width="35px" height="35px" alt="">`;
  }
}
