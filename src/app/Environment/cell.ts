import { cellStatus } from "../Enums/cellStatus";

export class Cell {
    status: cellStatus.Unvisited | cellStatus.Visited | cellStatus.Flagged = cellStatus.Unvisited;
    mine = false;
    estimateMines = 0;
  
    constructor(public row: number, public column: number) {}
  }