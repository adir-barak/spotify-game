import { useState } from 'react';
import Landing from './components/Landing';
import Game from './components/Game';
import EndScreen from './components/EndScreen';
import './App.css'; // Minimal global styling

function App() {
  const [gameState, setGameState] = useState('landing'); // 'landing', 'playing', 'ended'
  const [gameData, setGameData] = useState(null); // Stores final score/history
  const [roundsLimit, setRoundsLimit] = useState(0); // New state for game length

  const startGame = (limit) => {
    setRoundsLimit(limit);
    setGameState('playing');
  };

  const endGame = (finalData) => {
    setGameData(finalData);
    setGameState('ended');
  };

  const resetGame = () => {
    setGameState('landing');
    setGameData(null);
    setRoundsLimit(0);
  }

  // A simple, mobile-friendly container
  return (
    <div className="app-container">
      {gameState === 'landing' && <Landing onStartGame={startGame} />}
      {gameState === 'playing' && <Game onEndGame={endGame} roundsLimit={roundsLimit} />}
      {gameState === 'ended' && <EndScreen finalData={gameData} onRestart={resetGame} />}
    </div>
  );
}

export default App;