const MINE = "💣";
var gMinesPos = [];

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      cell.minesAroundCount = countNegs(gBoard, i, j);
    }
  }
}

function setRandMines(board) {
  var minesPos = [];
  for (var c = 0; c < gLevel.MINES; c++) {
    var randIdx = getRandomInt(0, gAvailablePos.length - 1);
    var pos = gAvailablePos.splice(randIdx, 1)[0];
    board[pos.i][pos.j].isMine = true;
    minesPos.push(pos);
  }
  return minesPos;
}

function revealMines(positions) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var pos = positions[i];
    var elClicked = document.querySelector(`.cell-${pos.i}-${pos.j}`);
    elClicked.classList.add("clicked");

    renderCell(pos, MINE);
  }
}
