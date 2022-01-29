const MINE = "💣";
var gMinesPos = [];
var gIsUserPlay;
function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      cell.minesAroundCount = countNegs(gBoard, i, j);
    }
  }
}

// setting rand mines in available pos
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

// find available pos

function findAvailablPos(board) {
  var positions = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell.isShown) continue;
      positions.push({ i: i, j: j });
    }
  }
  return positions;
}

function userMines(elCell, i, j) {
  if (!gIsMineByUser) return;
  gIsUserPlay = true;
  var currCell = gBoard[i][j];
  currCell.isMine = true;
  elCell.classList.add("revealed");
  elCell.innerText = MINE;
  setTimeout(() => {
    elCell.classList.remove("revealed");
    elCell.innerText = EMPTY;
  }, 1000);
  gUserMinesCount++;
  var elMinesLeft = document.querySelector(".user-mines-left");
  elMinesLeft.innerText = `${gLevel.MINES - gUserMinesCount} Mines Left`;
  if (gUserMinesCount === gLevel.MINES) {
    elMinesLeft.innerText = "LETS START";
    setTimeout(() => {
      elMinesLeft.innerText = "";
    }, 1000);
    gIsMineByUser = false;
    return;
  }
}

function minesByUser() {
  if (gUserMinesCount === gLevel.MINES) return;
  if (gGame.shownCount || gGame.markedCount) return;
  gIsMineByUser = true;
  document.querySelector(".user-mines-left").innerText = `${
    gLevel.MINES - gUserMinesCount
  } Mines Left`;
}
