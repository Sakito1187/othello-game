import React, { useState } from 'react'
import { TopScreen } from './components/TopScreen'
import { GameScreen } from './components/GameScreen'

type GameMode = 'top' | 'pvp' | 'ai'

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('top')

  const handleModeSelect = (mode: 'pvp' | 'ai') => {
    setCurrentMode(mode)
  }

  return (
    <div>
      {currentMode === 'top' && <TopScreen onModeSelect={handleModeSelect} />}
      {currentMode === 'pvp' && <GameScreen mode="pvp" />}
      {currentMode === 'ai' && <GameScreen mode="ai" />}
    </div>
  )
}

export default App