"use strict";
var gSafeClickCount;

var gElClicksLeft = document.querySelector(".clicks-left");
function safeClick() {
  if (!gSafeClickCount || !gGame.isOn) return;

  var isVacant = true;
  while (isVacant) {
    var randI = getRandomInt(0, gBoard.length - 1);
    var randJ = getRandomInt(0, gBoard.length - 1);
    var randCell = gBoard[randI][randJ];
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
        elRandCell.innerText = "";
      }, 1000);
    }
  }
  return;
}
