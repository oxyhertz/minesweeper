"use strict";

function setMinesBy7() {
  if (gIsMineByUser) return;
  init();
  gIs7Boom = true;

  var elMsgBoom = document.querySelector(".seven-boom h4");
  elMsgBoom.innerText = "7BOOM MODE IS ON";
  setTimeout(() => {
    elMsgBoom.innerText = "";
  }, 1000);
}

function posMines7Boom() {
  var idxCounter = 0;

  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var curCell = gBoard[i][j];
      idxCounter++;
      if (idxCounter % 7 === 0 || ("" + idxCounter).includes("7")) {
        curCell.isMine = true;
        console.log(idxCounter);
      }
    }
  }
}
