import React, { useState } from 'react'
import styled from 'styled-components'
import { Board, CellState } from '../models/board'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  // 追加
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #2c3e50;
`

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  background-color: #2c3e50;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);  // 追加：影をつけて立体感を出す
`

const Status = styled.div`
  font-size: 1.5rem;
  margin: 2rem 0;  // マージンを調整
  color: white;    // 背景色に合わせて文字色を白に
  text-align: center;
`

const Cell = styled.div<{ state: CellState }>`
  width: 50px;
  height: 50px;
  background-color: #27ae60;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props =>
      props.state === CellState.Black ? '#2c3e50' :
      props.state === CellState.White ? '#ecf0f1' :
      'transparent'
    };
  }
`

interface GameScreenProps {
  mode: 'pvp' | 'ai'
}

const RetryButton = styled.button`
  margin-top: 2rem
`

export const GameScreen: React.FC<GameScreenProps> = ({ mode }) => {
  const [board, setBoard] = useState(new Board())
  const [currentPlayer, setCurrentPlayer] = useState(CellState.Black)
  const [isThinking, setIsThinking] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const handleRetry = () => {
    setBoard(new Board())
    setCurrentPlayer(CellState.Black)
    setIsGameOver(false)
  }

  const checkGameOver = (currentBoard: Board) => {
    if (currentBoard.isGameOver()) {
      setIsGameOver(true)
    }
  }

  const switchToNextPlayer = (currentBoard: Board, currentState: CellState) => {
    const nextPlayer = currentState === CellState.Black ? CellState.White : CellState.Black

    // 次のプレイヤーに有効な手があるかチェック
    const validMoves = currentBoard.getValidMoves(nextPlayer)
    if (validMoves.length > 0) {
      setCurrentPlayer(nextPlayer)
      // AI対戦で白の番になった場合
      if (mode === 'ai' && nextPlayer === CellState.White) {
        handleAIMove(currentBoard)
      }
    } else {
      // 次のプレイヤーが置けない場合は、さらに次のプレイヤーへ
      const nextNextPlayer = nextPlayer === CellState.Black ? CellState.White : CellState.Black
      const nextNextValidMoves = currentBoard.getValidMoves(nextNextPlayer)
      if (nextNextValidMoves.length > 0) {
        setCurrentPlayer(nextNextPlayer)
      } else {
        // 両プレイヤーとも置けない場合はゲーム終了
        setIsGameOver(true)
      }
    }
  }

  const handleAIMove = (currentBoard: Board) => {
    setIsThinking(true)
    setTimeout(() => {
      try {
        const aiMove = currentBoard.selectAIMove(CellState.White)
        currentBoard.placeStone(aiMove.row, aiMove.col, CellState.White)
        setBoard(currentBoard)
        checkGameOver(currentBoard)
        switchToNextPlayer(currentBoard, CellState.White)
      } finally {
        setIsThinking(false)
      }
    }, 1000)
  }

  const handleCellClick = (row: number, col: number) => {
    if (isThinking || isGameOver) return
    if (board.isValidMove(row, col, currentPlayer)) {
      const newBoard = new Board()
      newBoard.cells = [...board.cells]
      newBoard.placeStone(row, col, currentPlayer)
      setBoard(newBoard)
      checkGameOver(newBoard)
      switchToNextPlayer(newBoard, currentPlayer)
    }
  }

  const getStatusMessage = () => {
    if (isGameOver) {
      const winner = board.getWinner()
      if (winner === CellState.Black) return '黒の勝ち！'
      if (winner === CellState.White) return '白の勝ち！'
      return '引き分け！'
    }
    if (isThinking) return 'AIが考え中...'
    return currentPlayer === CellState.Black ? '黒の番です' : '白の番です'
  }

  return (
    <Container>
      <Status>
        {mode === 'pvp' ? '2人対戦モード' : 'AI対戦モード'}
        <br />
        {getStatusMessage()}
      </Status>
      <GameBoard>
        {board.cells.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              state={cell}
              onClick={() => handleCellClick(i, j)}
            />
          ))
        )}
      </GameBoard>
      {isGameOver && (
        <RetryButton onClick={handleRetry}>もう一度プレイ</RetryButton>
      )}
    </Container>
  )
}
