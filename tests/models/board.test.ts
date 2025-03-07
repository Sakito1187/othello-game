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
    // 白の有効手 (初期盤面では4箇所に置ける)
    expect(board.isValidMove(2, 4, CellState.White)).toBe(true)
    expect(board.isValidMove(3, 5, CellState.White)).toBe(true)
    expect(board.isValidMove(4, 2, CellState.White)).toBe(true)
    expect(board.isValidMove(5, 3, CellState.White)).toBe(true)
  })

  test('8方向の石の挟み方が判定できること', () => {
    const board = new Board()
    // カスタム盤面を作成して水平方向のテスト
    board.cells = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 2, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]
    // 白の石を挟んで(3,5)に黒を置ける
    expect(board.isValidMove(3, 5, CellState.Black)).toBe(true)

    // 垂直方向のテスト
    board.cells = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 2, 2, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]
    // 白の石を挟んで(5,4)に黒を置ける
    expect(board.isValidMove(5, 4, CellState.Black)).toBe(true)
  })

  test('複数方向同時に石を挟めること', () => {
    const board = new Board()
    // 複数方向に石を挟める盤面を作成
    board.cells = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 2, 2, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]

    // 2方向同時に挟める位置
    expect(board.isValidMove(5, 4, CellState.Black)).toBe(true)
  })
})

describe('石の反転', () => {
  test('水平方向の石が反転すること', () => {
    const board = new Board()
    board.cells[3][3] = CellState.White
    board.cells[3][4] = CellState.White
    board.cells[3][5] = CellState.Empty
    board.cells[3][2] = CellState.Black

    board.placeStone(3, 5, CellState.Black)

    expect(board.cells[3][3]).toBe(CellState.Black)
    expect(board.cells[3][4]).toBe(CellState.Black)
  })

  test('垂直方向の石が反転すること', () => {
    const board = new Board()
    board.cells[2][4] = CellState.Black
    board.cells[3][4] = CellState.White
    board.cells[4][4] = CellState.White
    board.cells[5][4] = CellState.Empty

    board.placeStone(5, 4, CellState.Black)

    expect(board.cells[3][4]).toBe(CellState.Black)
    expect(board.cells[4][4]).toBe(CellState.Black)
  })

  test('斜め方向の石が反転すること', () => {
    const board = new Board()
    board.cells[2][2] = CellState.Black
    board.cells[3][3] = CellState.White
    board.cells[4][4] = CellState.White
    board.cells[5][5] = CellState.Empty

    board.placeStone(5, 5, CellState.Black)

    expect(board.cells[3][3]).toBe(CellState.Black)
    expect(board.cells[4][4]).toBe(CellState.Black)
  })

  test('複数方向の石が同時に反転すること', () => {
    const board = new Board()
    /*
    Before
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    . . . B W B . .
    . . . W W W . .
    . . . B W o . .
    . . . . . . . .
    . . . . . . . .

    After
    . . . . . . . .
    . . . . . . . .
    . . . . . . . .
    . . . B W B . .
    . . . W B B . .
    . . . B B B . .
    . . . . . . . .
    . . . . . . . .
    */
    // 十字に白を配置
    board.cells[3][4] = CellState.White
    board.cells[4][3] = CellState.White
    board.cells[4][5] = CellState.White
    board.cells[5][4] = CellState.White
    // 端に黒を配置
    board.cells[3][3] = CellState.Black
    board.cells[3][5] = CellState.Black
    board.cells[5][3] = CellState.Black

    board.placeStone(5, 5, CellState.Black)

    expect(board.cells[3][4]).toBe(CellState.White)
    expect(board.cells[4][3]).toBe(CellState.White)
    expect(board.cells[4][4]).toBe(CellState.Black)
    expect(board.cells[4][5]).toBe(CellState.Black)
    expect(board.cells[5][4]).toBe(CellState.Black)
    expect(board.cells[5][5]).toBe(CellState.Black)
  })

  test('石を置けない位置に石を置くと例外が発生すること', () => {
    const board = new Board()
    expect(() => board.placeStone(3, 3, CellState.Black)).toThrow()
  })
})

describe('ゲーム終了判定', () => {
  test('両プレイヤーとも置けない場合、ゲーム終了となること', () => {
    const board = new Board()
    // 全て黒で埋める
    board.cells = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ]
    expect(board.isGameOver()).toBe(true)
  })

  test('片方のプレイヤーが置ける場合、ゲーム終了とならないこと', () => {
    const board = new Board()
    // 初期盤面では黒が置ける
    expect(board.isGameOver()).toBe(false)
  })

  test('空きマスがあっても両者置けない場合、ゲーム終了となること', () => {
    const board = new Board()
    board.cells = [
      [1, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 1, 2, 2, 2, 1],
      [2, 2, 2, 1, 2, 2, 2, 2],
      [2, 2, 2, 1, 2, 2, 2, 2],
      [2, 2, 2, 1, 2, 2, 2, 2],
    ]
    expect(board.isGameOver()).toBe(true)
  })

  test('勝者が正しく判定されること', () => {
    const board = new Board()
    // 上半分を黒、下半分を白で埋め、1マスだけ黒にする
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        if (i < 4) {
          board.cells[i][j] = CellState.Black
        } else {
          board.cells[i][j] = CellState.White
        }
      }
    }
    board.cells[4][0] = CellState.Black
    expect(board.getWinner()).toBe(CellState.Black)
  })
})


describe('AIの手の選択', () => {
  test('最も多く石を取れる手を選択する', () => {
    const board = new Board()
    board.cells = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 2, 2, 1, 0, 0],
      [0, 0, 0, 2, 2, 2, 0, 0],
      [0, 0, 0, 2, 0, 2, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const blackMove = board.getMaxFlippableMoves(CellState.Black)
    expect(blackMove).toMatchObject([{ row: 5, col: 3 }])

    const whiteMove = board.getMaxFlippableMoves(CellState.White)
    expect(whiteMove).toMatchObject([{ row: 0, col: 5 }])
  })

  test('最善手が複数ある場合', () => {
    const board = new Board()
    board.cells = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const blackMove = board.getMaxFlippableMoves(CellState.Black)
    expect(blackMove).toMatchObject([
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ])

    const whiteMove = board.getMaxFlippableMoves(CellState.White)
    expect(whiteMove).toMatchObject([
      { row: 2, col: 4 },
      { row: 3, col: 5 },
      { row: 4, col: 2 },
      { row: 5, col: 3 },
    ])
  })
})
