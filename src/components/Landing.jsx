import React, { useState } from 'react';
import playlistData from '../assets/data/playlistData.json';

// Pre-populated options
const ROUND_OPTIONS = [10, 50, 100];

const Landing = ({ onStartGame }) => {
  const totalSongs = playlistData.songs.length;
  const [roundsLimit, setRoundsLimit] = useState(10); // Default to 10 rounds
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState('');

  const handleOptionChange = (limit) => {
    setRoundsLimit(limit);
    setCustomInput(''); // Clear custom input when a button is selected
    setError('');
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomInput(value);
    
    // Attempt to parse and set the rounds limit
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a number greater than 0.');
      setRoundsLimit(0);
    } else if (num > totalSongs) {
      setError(`Maximum songs available: ${totalSongs}.`);
      setRoundsLimit(totalSongs);
    } else {
      setError('');
      setRoundsLimit(num);
    }
  };

  const handleStartGame = () => {
    if (error || roundsLimit <= 0) {
        // Prevent start if there's an error or no valid limit is set
        if (!error) setError('Please select or enter a valid number of rounds.');
        return;
    }
    onStartGame(roundsLimit);
  };

  return (
    <div className="screen-container">
      <h1 className="title">🎶 Playlist Guesser 🎧</h1>
      <p className="description">
        Welcome! Guess which friend added the song. Total songs available: {totalSongs}.
      </p>
      <ul className="rules-list">
        <li>✅ Correct first guess: +10 points</li>
        <li>🔁 Incorrect first guess: Song moves to the Repeat Bucket</li>
      </ul>
      
      <div className="round-selection-container">
        <h2>Choose Game Length</h2>
        <div className="options-grid">
          {ROUND_OPTIONS.map((limit) => (
            <button
              key={limit}
              className={`option-button ${roundsLimit === limit && customInput === '' ? 'selected' : ''}`}
              onClick={() => handleOptionChange(limit)}
            >
              {limit} Rounds
            </button>
          ))}
          <button
            className={`option-button ${roundsLimit === totalSongs && customInput === '' ? 'selected' : ''}`}
            onClick={() => handleOptionChange(totalSongs)}
          >
            All ({totalSongs})
          </button>
        </div>

        <div className="custom-input-group">
            <label htmlFor="custom-rounds">Or set a custom number:</label>
            <input
                id="custom-rounds"
                type="number"
                min="1"
                max={totalSongs}
                placeholder="Custom Rounds"
                value={customInput}
                onChange={handleCustomInputChange}
                className="custom-input"
            />
        </div>

        {error && <p className="error-message">{error}</p>}
        <p className="current-limit">
            Playing for {roundsLimit} rounds.
        </p>
      </div>

      <button className="start-button" onClick={handleStartGame} disabled={!!error || roundsLimit <= 0}>
        Start Game
      </button>
    </div>
  );
};

export default Landing;