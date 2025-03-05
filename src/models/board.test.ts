import { describe, test, expect } from 'vitest'
import { Board, CellState } from './board'

describe('オセロ盤', () => {
  test('8x8の盤面が作成されること', () => {
    const board = new Board()
    expect(board.size).toBe(8)
    expect(board.cells.length).toBe(8)
    expect(board.cells[0].length).toBe(8)
  })

  test('初期配置が正しく配置されること', () => {
    const board = new Board()
    // 中央4マスの配置をチェック
    expect(board.cells[3][3]).toBe(CellState.White)
    expect(board.cells[3][4]).toBe(CellState.Black)
    expect(board.cells[4][3]).toBe(CellState.Black)
    expect(board.cells[4][4]).toBe(CellState.White)

    // その他のマスが空であることをチェック
    expect(board.cells[0][0]).toBe(CellState.Empty)
    expect(board.cells[7][7]).toBe(CellState.Empty)
  })

  test('石の数が正しくカウントできること', () => {
    const board = new Board()
    expect(board.getStoneCount(CellState.Black)).toBe(2)
    expect(board.getStoneCount(CellState.White)).toBe(2)
    expect(board.getStoneCount(CellState.Empty)).toBe(60)
  })

  test('指定位置の石の状態を取得できること', () => {
    const board = new Board()
    expect(board.getCellState(3, 3)).toBe(CellState.White)
    expect(board.getCellState(0, 0)).toBe(CellState.Empty)
  })

  test('盤面の範囲外を参照できないこと', () => {
    const board = new Board()
    expect(() => board.getCellState(-1, 0)).toThrow()
    expect(() => board.getCellState(8, 0)).toThrow()
    expect(() => board.getCellState(0, -1)).toThrow()
    expect(() => board.getCellState(0, 8)).toThrow()
  })
})
