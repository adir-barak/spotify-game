import { useState } from 'react';
import Landing from './components/Landing';
import Game from './components/Game';
import EndScreen from './components/EndScreen';
import './App.css'; // Minimal global styling

function App() {
  const [gameState, setGameState] = useState('landing'); // 'landing', 'playing', 'ended'
  const [gameData, setGameData] = useState(null); // Stores final score/history

  const startGame = () => {
    setGameState('playing');
  };

  const endGame = (finalData) => {
    setGameData(finalData);
    setGameState('ended');
  };

  const resetGame = () => {
    setGameState('landing');
    setGameData(null);
  }

  // A simple, mobile-friendly container
  return (
    <div className="app-container">
      {gameState === 'landing' && <Landing onStartGame={startGame} />}
      {gameState === 'playing' && <Game onEndGame={endGame} />}
      {gameState === 'ended' && <EndScreen finalData={gameData} onRestart={resetGame} />}
    </div>
  );
}

export default App;