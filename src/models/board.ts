export enum CellState {
  Empty,
  Black,
  White
}

export class Board {
  readonly size: number = 8
  cells: CellState[][]
  private readonly directions = [
    { row: -1, col: 0 },  // 上
    { row: 1, col: 0 },   // 下
    { row: 0, col: -1 },  // 左
    { row: 0, col: 1 },   // 右
    { row: -1, col: -1 }, // 左上
    { row: -1, col: 1 },  // 右上
    { row: 1, col: -1 },  // 左下
    { row: 1, col: 1 }    // 右下
  ]

  constructor() {
    this.cells = Array.from({ length: this.size }, () => Array(this.size).fill(CellState.Empty))
    this.initializeBoard()
  }

  private initializeBoard(): void {
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

  private getOpponentState(state: CellState): CellState {
    return state === CellState.Black ? CellState.White : CellState.Black
  }

  private isWithinBoard(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size
  }

  getStoneCount(state: CellState): number {
    return this.cells.flat().filter(cell => cell === state).length
  }

  getCellState(row: number, col: number): CellState {
    if (!this.isWithinBoard(row, col)) {
      throw new Error('Invalid cell position')
    }
    return this.cells[row][col]
  }

  isValidMove(row: number, col: number, state: CellState): boolean {
    if (!this.isWithinBoard(row, col) ||
      this.getCellState(row, col) !== CellState.Empty) {
      return false
    }
    return this.directions.some(dir => this.canFlipInDirection(row, col, state, dir))
  }

  private canFlipInDirection(row: number, col: number, state: CellState, direction: { row: number, col: number }): boolean {
    let currentRow = row + direction.row
    let currentCol = col + direction.col
    let hasOpponent = false

    while (this.isWithinBoard(currentRow, currentCol)) {
      const currentState = this.getCellState(currentRow, currentCol)
      if (currentState === this.getOpponentState(state)) {
        hasOpponent = true
      } else if (currentState === state && hasOpponent) {
        return true
      } else {
        break
      }
      currentRow += direction.row
      currentCol += direction.col
    }
    return false
  }

  placeStone(row: number, col: number, state: CellState): void {
    if (!this.isValidMove(row, col, state)) {
      throw new Error('Invalid move')
    }

    this.cells[row][col] = state
    this.directions.forEach(dir => {
      if (this.canFlipInDirection(row, col, state, dir)) {
        this.flipStonesInDirection(row, col, state, dir)
      }
    })
  }

  private flipStonesInDirection(row: number, col: number, state: CellState, direction: { row: number, col: number }): void {
    let currentRow = row + direction.row
    let currentCol = col + direction.col

    while (this.isWithinBoard(currentRow, currentCol) &&
      this.getCellState(currentRow, currentCol) === this.getOpponentState(state)) {
      this.cells[currentRow][currentCol] = state
      currentRow += direction.row
      currentCol += direction.col
    }
  }
}
