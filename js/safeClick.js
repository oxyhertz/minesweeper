"use strict";
var gSafeClickCount;

var gElClicksLeft = document.querySelector(".clicks-left");
function safeClick() {
  if (!gSafeClickCount || !gGame.isOn || !gIsFirstClick) return;

  var isVacant = true;
  while (isVacant) {
    var randI = getRandomInt(0, gBoard.length - 1);
    var randJ = getRandomInt(0, gBoard.length - 1);
    var randCell = gBoard[randI][randJ];
    // if all unShown cells are mines  => return
    if (isAllUnshowenCellsMine()) return;
    var elRandCell = document.querySelector(`.cell-${randI}-${randJ}`);
    if (!randCell.isMine && !randCell.isShown) {
      var negs = randCell.minesAroundCount ? randCell.minesAroundCount : "";
      elRandCell.classList.add("revealed");
      elRandCell.innerText = negs;
      isVacant = false;
      gSafeClickCount--;
      gElClicksLeft.innerText = gSafeClickCount;
      setTimeout(() => {
        elRandCell.classList.remove("revealed");
        if (randCell.isMarked) {
          elRandCell.innerHTML = FLAG;
        } else {
          elRandCell.innerText = EMPTY;
        }
      }, 500);
    }
  }
  return;
}

function isAllUnshowenCellsMine() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var curCell = gBoard[i][j];
      if (!curCell.isShown && !curCell.isMine) return false;
    }
  }

  return true;
}
