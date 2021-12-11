import { Component, Input } from '@angular/core';
import { cellStatus } from './Enums/cellStatus';
import { gameStatus } from './Enums/gameStatus';
import { Board } from './Environment/board';
import { Cell } from './Environment/cell';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})

export class AppComponent {
  title = 'MineSweeper';
  board: Board;
  cellStatus = cellStatus;
  width = 10;
  height = 10;
  amountMines = 20;

  constructor() {          
    this.board = new Board(this.width, this.height, this.amountMines);
} 

  checkCell(cell: Cell) {
    const result = this.board.checkCell(cell);
    if (result === gameStatus.GameOver) {
      alert('Leider verloren');
    } else if (result === gameStatus.Win) {
      alert('Gewonnen!');
    }
  }
  
  flagCell(cell: Cell) {
    if (cell.status === cellStatus.Flagged) {
      cell.status = cellStatus.Unvisited;
    } else {
      cell.status = cellStatus.Flagged;
    }
  }
  
  onStart(width: number, height: number, amountMines: number) {  
    this.board = new Board(width, height, amountMines)  
  }
}
