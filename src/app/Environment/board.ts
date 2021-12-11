import { cellStatus } from '../Enums/cellStatus';
import { gameStatus } from '../Enums/gameStatus';
import { Cell } from './cell';

const NEIGHBOURS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export class Board {
  cells: Cell[][] = [];

  private remainingCells = 0;
  public mineCount = 0;

  constructor(width: number, height: number, mines: number) {
    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        this.cells[y][x] = new Cell(y, x);
      }
    }

    // Assign mines to cells.
    for (let i = 0; i < mines; i++) {
      const cell = this.getRandomCell();

      if (!cell.mine) {
        cell.mine = true;
        this.mineCount++;
      } else {
        i--;
      }
    }

    // Loop through all cells and calculate the number of mines around each cell.
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let adjacentMines = 0;
        for (const neighbour of NEIGHBOURS) {
          if (
            this.cells[y + neighbour[0]] &&
            this.cells[y + neighbour[0]][x + neighbour[1]] &&
            this.cells[y + neighbour[0]][x + neighbour[1]].mine
          ) {
            adjacentMines++;
          }
        }
        this.cells[y][x].estimateMines = adjacentMines;

        if (this.cells[y][x].mine) {
          this.mineCount++;
        }
      }
    }
    this.remainingCells = width * height - this.mineCount;
  }

  getRandomCell(): Cell {
    const y = Math.floor(Math.random() * this.cells.length);
    const x = Math.floor(Math.random() * this.cells[y].length);
    return this.cells[y][x];
  }

  checkCell(cell: Cell): gameStatus.GameOver | gameStatus.Win | null {
    if (cell.status !== cellStatus.Unvisited) {
      return null;
    } else if (cell.mine) {
      this.revealAll();
      return gameStatus.GameOver;
    } else {
      cell.status = cellStatus.Visited;

      // Empty cell, all other empty cells in the block will be cleared.
      if(cell.estimateMines === 0) {
        for(const neighbour of NEIGHBOURS) {
          if (
            this.cells[cell.row + neighbour[0]] &&
            this.cells[cell.row + neighbour[0]][cell.column + neighbour[1]]
          ) {
            this.checkCell(this.cells[cell.row + neighbour[0]][cell.column + neighbour[1]]);
          }
        }
      }

      if (this.remainingCells-- <= 1) {
        return gameStatus.Win;
      }
      return null;
    }
  }
  revealAll() {
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.status === cellStatus.Unvisited) {
          cell.status = cellStatus.Visited;
        }
      }
    }
  }
}