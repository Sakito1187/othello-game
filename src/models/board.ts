export enum CellState {
  Empty,
  Black,
  White
}

export class Board {
  readonly size: number = 8
  cells: CellState[][]

  constructor() {
    this.cells = Array.from({ length: this.size }, () => Array(this.size).fill(CellState.Empty))
    const initialSetup = [
      { row: 3, col: 3, state: CellState.White },
      { row: 3, col: 4, state: CellState.Black },
      { row: 4, col: 3, state: CellState.Black },
      { row: 4, col: 4, state: CellState.White }
    ]
    initialSetup.forEach(({ row, col, state }) => {
      this.cells[row][col] = state
    })
  }

  getStoneCount(state: CellState): number {
    return this.cells.flat().filter(cell => cell === state).length
  }

  getCellState(row: number, col: number): CellState {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      throw new Error('Invalid cell position')
    }
    return this.cells[row][col]
  }
}