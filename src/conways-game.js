;(function () {

  window.onload = function () {

    var PetriDish = function (width, height) {
      this.columns = width || 25;
      this.rows = height || 15;
      this.cells = this.columns * this.rows;
      this.container = document.getElementById("petri-dish");
      this.cells = [];
    };

    PetriDish.prototype.createBoard = function () {
      for (var i = 0; i < this.rows; i++) {
        var newRow = document.createElement("span");
        newRow.id = "row-" + i;
        newRow.className = "row";
        this.container.appendChild(newRow);
        this.cells.push([]);
        for (var j = 0; j < this.columns; j++) {
          var newCell = document.createElement("span");
          newCell.id = "cell-" + i + "-" + j;
          newCell.className = "cell";
          newCell.setAttribute("data-row", i);
          newCell.setAttribute("data-column", j);
          newRow.appendChild(newCell);
          var cell = new Cell(i,j);
          cell.domCell = newCell;
          this.cells[i].push(cell);
        }
      }
    };

    PetriDish.prototype.populateBoard = function () {
      var self = this;
      for (var i = 0; i < this.cells.length; i++) {
        for (var j = 0; j < this.cells[i].length; j++) {
          var choice = Math.round(Math.random());
          if (choice === 1) {
            this.cells[i][j].awaken();
          }
          this.cells[i][j].findNeighbors();
          // this.cells[i][j].domCell.addEventListener("click", function (event) {
          //   var row = event.srcElement.getAttribute("data-row");
          //   var col = event.srcElement.getAttribute("data-column");
          //   self.cells[row][col].showNeighbors();
          //   self.cells[row][col].countLiveNeighbors();
          // });
        }
      }
    };

    PetriDish.prototype.checkNeighborStatus = function () {
      for (var i = 0; i < this.cells.length; i++) {
        for (var j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j].liveNeighbors = this.cells[i][j].countLiveNeighbors();
        }
      }
    };

    PetriDish.prototype.evolve = function () {
      for (var i = 0; i < this.cells.length; i++) {
        for (var j = 0; j < this.cells[i].length; j++) {  
          if (this.cells[i][j].liveNeighbors === 3) {
            this.cells[i][j].awaken();
          } else if (this.cells[i][j].liveNeighbors < 2 || this.cells[i][j].liveNeighbors > 3) {
            this.cells[i][j].kill();
          } 
        }
      }
    };

    PetriDish.prototype.killBoard = function () {
      for (var i = 0; i < this.cells.length; i++) {
        for (var j = 0; j < this.cells[i].length; j++) {  
          this.cells[i][j].kill();
        }
      }
    };

    PetriDish.prototype.clearBoard = function () {
      this.container.innerHTML = "";
    };

    var Cell = function (row, column) {
      this.row = row;
      this.column = column;
      // 0 is dead, 1 is alive
      this.status = 0;
    };

    Cell.prototype.awaken = function () {
      this.status = 1;
      this.domCell.className = "cell alive";
    };

    Cell.prototype.kill = function () {
      this.status = 0;
      this.domCell.className = "cell";
    };

    Cell.prototype.findNeighbors = function () {
      this.neighbors = [];
      // add neighbors in my row
      this.addToNeighborsUnlessUndefined(petri.cells[this.row][this.column - 1]);
      this.addToNeighborsUnlessUndefined(petri.cells[this.row][this.column + 1]);
      // add neighbors in previous and next rows
      this.addAdjacentRowNeighbors(this.row - 1);
      this.addAdjacentRowNeighbors(this.row + 1);
    };

    Cell.prototype.addAdjacentRowNeighbors = function (row) {
      // make sure row exists
      if (petri.cells[row]) {
        this.addToNeighborsUnlessUndefined(petri.cells[row][this.column]);
        this.addToNeighborsUnlessUndefined(petri.cells[row][this.column - 1]);
        this.addToNeighborsUnlessUndefined(petri.cells[row][this.column + 1]);
      }
    };

    Cell.prototype.addToNeighborsUnlessUndefined = function (neighbor) {
      if (neighbor !== undefined) {
        this.neighbors.push(neighbor);
      }
    };

    Cell.prototype.countLiveNeighbors = function () {
      var count = 0;
      for (var i = 0; i < this.neighbors.length; i++) {
        if (this.neighbors[i].domCell.className === "cell alive") {
          count += 1;
        }
      }
      return count;
    };

    // Cell.prototype.showNeighbors = function () {
    //   for (var i = 0; i < this.neighbors.length; i++) {
    //     this.neighbors[i].domCell.className = "cell neighbor";
    //   }
    // };

    var petri = new PetriDish();
    petri.createBoard();
    petri.populateBoard();

    var petriInterval = setInterval(function () {
      petri.checkNeighborStatus();
      petri.evolve();
    }, 500);

    var createNewBoard = function () {
      var width = document.getElementById("board-width").value;
      var height = document.getElementById("board-height").value;
      clearInterval(petriInterval);
      petri.clearBoard();
      petri = new PetriDish(width,height);
      petri.createBoard();
    };

    document.getElementById("new-game-button").addEventListener("click", function (event) {
      document.getElementById("new-game-form").style.display = "block";
      document.getElementById("new-game-button").style.display = "none";
    });

    document.getElementById("board-width").addEventListener("change", function () {
      createNewBoard();
    });

    document.getElementById("board-height").addEventListener("change", function () {
      createNewBoard();
    });

    document.getElementById("again").addEventListener("click", function (event) {
      event.preventDefault();
      clearInterval(petriInterval);
      petri.killBoard();
      petri.populateBoard();
      petriInterval = setInterval(function () {
        petri.checkNeighborStatus();
        petri.evolve();
      }, 500);
    });

  };

})();