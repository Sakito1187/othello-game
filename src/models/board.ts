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

  isValidMove(row: number, col: number, state: CellState): boolean {
    if (this.getCellState(row, col) !== CellState.Empty
      || !this.isAdjacentToOpponent(row, col, state)
      || !this.isLineOfOpponentFlipped(row, col, state)) {
      return false
    }
    return true
  }

  isAdjacentToOpponent(row: number, col: number, state: CellState): boolean {
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ]
    for (const { row: dr, col: dc } of directions) {
      const r = row + dr
      const c = col + dc
      if (r >= 0 && r < this.size && c >= 0 && c < this.size && this.getCellState(r, c) === (state === CellState.Black ? CellState.White : CellState.Black)) {
        return true
      }
    }
    return false
  }

  isLineOfOpponentFlipped(row: number, col: number, state: CellState): boolean {
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ]
    for (const { row: dr, col: dc } of directions) {
      let r = row + dr
      let c = col + dc
      let flipped = false
      while (r >= 0 && r < this.size && c >= 0 && c < this.size && this.getCellState(r, c) === (state === CellState.Black ? CellState.White : CellState.Black)) {
        flipped = true
        r += dr
        c += dc
      }
      if (flipped && r >= 0 && r < this.size && c >= 0 && c < this.size && this.getCellState(r, c) === state) {
        return true
      }
    }
    return false
  }
}
