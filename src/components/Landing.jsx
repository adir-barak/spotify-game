import React from 'react';

const Landing = ({ onStartGame }) => (
  <div className="screen-container">
    <h1 className="title">🎶 Playlist Guesser 🎧</h1>
    <p className="description">
      Welcome to the Party Playlist Guessing Game! A song from the shared playlist will be shown, and you must guess which friend added it.
    </p>
    <ul className="rules-list">
      <li>✅ Correct first guess: +10 points</li>
      <li>🔁 Incorrect first guess: Song will appear again later</li>
      <li>✨ Correct repeat guess: +5 points</li>
      <li>❌ Incorrect repeat guess: Song is permanently removed (0 points)</li>
    </ul>
    <button className="start-button" onClick={onStartGame}>
      Start Game
    </button>
  </div>
);

export default Landing;