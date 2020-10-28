function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];
  if (tile.value > 67108864)
    classes = ["tile", "tile-" + 67108864, positionClass];

  this.applyClasses(wrapper, classes);
  var outputtext = new Array();
  outputtext[2] = "H";
  outputtext[4] = "He";
  outputtext[8] = "Li";
  outputtext[16] = "Be";
  outputtext[32] = "B";
  outputtext[64] = "C";
  outputtext[128] = "N";
  outputtext[256] = "O";
  outputtext[512] = "F";
  outputtext[1024] = "Ne";
  outputtext[2048] = "Na";
  outputtext[4096] = "Mg";
  outputtext[8192] = "Al";
  outputtext[16384] = "Si";
  outputtext[32768] = "P";
  outputtext[65536] = "S";
  outputtext[131072] = "Cl";
  outputtext[262144] = "Ar";
  outputtext[524288] = "K";
  outputtext[1048576] = "Ca";
  outputtext[2097152] = "Sc";
  outputtext[4194304] = "Ti";
  outputtext[8388608] = "V";
  outputtext[16777216] = "Cr";
  outputtext[33554432] = "Mn";
  outputtext[67108864] = "Fe";
  outputtext[134217728] = "Co";
  outputtext[268435456] = "Ni";
  outputtext[536870912] = "Cu";
  outputtext[1073741824] = "Zn";
  outputtext[2147483648] = "Ga";
  outputtext[4294967296] = "Ge";
  outputtext[8589934592] = "As";
  outputtext[17179869184] = "Se";
  outputtext[34359738368] = "Br";
  outputtext[68719476736] = "Kr";
  outputtext[137438953472] = "Rb";
  outputtext[274877906944] = "Sr";
  outputtext[549755813888] = "Y";
  outputtext[1099511627776] = "Zr";
  outputtext[2199023255552] = "Nb";
  outputtext[4398046511104] = "Mo";
  outputtext[8796093022208] = "Tc";
  outputtext[17592186044416] = "Ru";
  outputtext[35184372088832] = "Rh";
  outputtext[70368744177664] = "Pd";
  outputtext[140737488355328] = "Ag";
  outputtext[281474976710656] = "Cd";
  outputtext[562949953421312] = "In";
  outputtext[1125899906842624] = "Sn";
  outputtext[2251799813685248] = "Sb";
  outputtext[4503599627370496] = "Te";
  outputtext[9007199254740992] = "I";
  
  inner.classList.add("tile-inner");
  inner.textContent = outputtext[tile.value];

  if (tile.value > 67108864) classes.push("tile-super");
  if (tile.value < 0) classes.push("tile--super");
  
  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};  
