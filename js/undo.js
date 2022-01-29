"use strict";
var gActions = [];

function addAction(i, j) {
  gActions.push({ i: i, j: j });
}

function undoCell() {
  if (!gActions.length) {
    init();
  }

  if (!gActions.length || !gGame.isOn) return;

  var cellPos = gActions.pop();
  var cell = gBoard[cellPos.i][cellPos.j];
  var elCell = document.querySelector(`.cell-${cellPos.i}-${cellPos.j}`);

  elCell.innerHTML = EMPTY;

  if (cell.isMarked) {
    cell.isMarked = false;
    if (cell.isMine) gGame.markedCount--;
  } else {
    elCell.classList.remove("clicked");
    cell.isShown = false;
    gGame.shownCount--;
    if (cell.isMine) {
      gLevel.LIVES++;
      renderLives();
    }
  }
}
