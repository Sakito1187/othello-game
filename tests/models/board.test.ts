import { describe, test, expect } from 'vitest'
import { Board, CellState } from '../../src/models/board'

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

describe('有効手の判定', () => {
  test('初期盤面での有効手が正しく判定されること', () => {
    const board = new Board()
    /*
    x . . . . . . .
    . . . . . . . .
    . . x o . . . .
    . . o W B . . .
    . . . B W o . .
    . . . . o . . .
    . . . . . . . .
    . . . . . . . .
    */
    // 黒の有効手 (初期盤面では4箇所に置ける)
    expect(board.isValidMove(3, 2, CellState.Black)).toBe(true)
    expect(board.isValidMove(2, 3, CellState.Black)).toBe(true)
    expect(board.isValidMove(5, 4, CellState.Black)).toBe(true)
    expect(board.isValidMove(4, 5, CellState.Black)).toBe(true)

    // 無効な手の例
    expect(board.isValidMove(0, 0, CellState.Black)).toBe(false)
    expect(board.isValidMove(3, 3, CellState.Black)).toBe(false) // すでに石がある
    expect(board.isValidMove(2, 2, CellState.Black)).toBe(false) // 石を挟めない
  })

  test('白の手番での有効手が正しく判定されること', () => {
    const board = new Board()
    /*
    . . . . . . . .
    . . . . . . . .
    . . . . o . . .
    . . . W B o . .
    . . o B W . . .
    . . . o . . . .
    . . . . . . . .
    . . . . . . . .
    */
    // 白の有効手 (初期盤面では4箇所に置ける)
    expect(board.isValidMove(2, 4, CellState.White)).toBe(true)
    expect(board.isValidMove(3, 5, CellState.White)).toBe(true)
    expect(board.isValidMove(4, 2, CellState.White)).toBe(true)
    expect(board.isValidMove(5, 3, CellState.White)).toBe(true)
  })

  test('8方向の石の挟み方が判定できること', () => {
    const board = new Board()
    // カスタム盤面を作成して水平方向のテスト
    board.cells[3][3] = CellState.White
    board.cells[3][4] = CellState.White
    board.cells[3][5] = CellState.Empty
    board.cells[3][2] = CellState.Black
    /*
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    . . B W W o . .
    . . . B W . . .
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    */
    // 白の石を挟んで(3,5)に黒を置ける
    expect(board.isValidMove(3, 5, CellState.Black)).toBe(true)

    // 垂直方向のテスト
    board.cells[2][4] = CellState.Black
    board.cells[3][4] = CellState.White
    board.cells[4][4] = CellState.White
    board.cells[5][4] = CellState.Empty
    /*
    . . . . . . . .
    . . . . . . . .
    . . . . B . . .
    . . . W W . . .
    . . . B W . . .
    . . . . o . . .
    . . . . . . . .
    . . . . . . . .
    */
    // 白の石を挟んで(5,4)に黒を置ける
    expect(board.isValidMove(5, 4, CellState.Black)).toBe(true)
    })

  test('複数方向同時に石を挟めること', () => {
    const board = new Board()
    /*
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    . . B . B . . .
    . . W W W . . .
    . . . . o . . .
    . . . . . . . .
    . . . . . . . .
    */
    // 複数方向に石を挟める盤面を作成
    board.cells[3][2] = CellState.Black
    board.cells[3][3] = CellState.Empty
    board.cells[3][4] = CellState.Black
    board.cells[4][2] = CellState.White
    board.cells[4][3] = CellState.White
    board.cells[4][4] = CellState.White

    // 2方向同時に挟める位置
    expect(board.isValidMove(5, 4, CellState.Black)).toBe(true)
  })
})
