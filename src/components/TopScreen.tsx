import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
`
const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
`

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  margin: 1rem;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 160px;
  height: 64px;

  &:hover {
    background-color: #2980b9;
  }
`

interface TopScreenProps {
  onModeSelect: (mode: 'pvp' | 'ai') => void
}

export const TopScreen: React.FC<TopScreenProps> = ({ onModeSelect }) => {
  return (
    <Container>
      <Title>オセロゲーム</Title>
      <Button onClick={() => onModeSelect('pvp')}>2人対戦</Button>
      <Button onClick={() => onModeSelect('ai')}>AI対戦</Button>
    </Container>
  )
}
