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

  isGameOver(): boolean {
    return this.getValidMoves(CellState.Black).length === 0 &&
      this.getValidMoves(CellState.White).length === 0
  }

  private getValidMoves(state: CellState): { row: number, col: number }[] {
    const validMoves: { row: number, col: number }[] = []
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.isValidMove(row, col, state)) {
          validMoves.push({ row, col })
        }
      }
    }
    return validMoves
  }

  getWinner(): CellState | null {
    const blackCount = this.getStoneCount(CellState.Black)
    const whiteCount = this.getStoneCount(CellState.White)
    if (blackCount > whiteCount) {
      return CellState.Black
    } else if (whiteCount > blackCount) {
      return CellState.White
    } else {
      return null
    }
  }

  selectAIMove(cellState: CellState): { row: number, col: number } {
    const bestMoves = this.getMaxFlippableMoves(cellState)
    const randomIndex = Math.floor(Math.random() * bestMoves.length)
    return bestMoves[randomIndex]
  }

  getMaxFlippableMoves(cellState: CellState): { row: number, col: number }[] {
    const validMoves = this.getValidMoves(cellState)
    const bestMoves: { row: number, col: number }[] = []
    let maxFlips = 0

    validMoves.forEach(move => {
      const flipsCount = this.getFlippablePieces(move.row, move.col, cellState).length
      if (flipsCount > maxFlips) {
        maxFlips = flipsCount
        bestMoves.length = 0
        bestMoves.push(move)
      } else if (flipsCount === maxFlips) {
        bestMoves.push(move)
      }
    })
    return bestMoves
  }

  private getFlippablePieces(row: number, col: number, state: CellState): { row: number, col: number }[] {
    const flippablePieces: { row: number, col: number }[] = []
    this.directions.forEach(dir => {
      const flippedPieces = this.getFlippablePiecesInDirection(row, col, state, dir)
      flippablePieces.push(...flippedPieces)
    })
    return flippablePieces
  }

  private getFlippablePiecesInDirection(row: number, col: number, state: CellState, direction: { row: number, col: number }): { row: number, col: number }[] {
    const flippablePieces: { row: number, col: number }[] = []
    let currentRow = row + direction.row
    let currentCol = col + direction.col
    let hasOpponent = false
    while (this.isWithinBoard(currentRow, currentCol)) {
      const currentState = this.getCellState(currentRow, currentCol)
      if (currentState === this.getOpponentState(state)) {
        hasOpponent = true
      } else if (currentState === state && hasOpponent) {
        return flippablePieces
      } else {
        break
      }
      flippablePieces.push({ row: currentRow, col: currentCol })
      currentRow += direction.row
      currentCol += direction.col
    }
    return []
  }
}
