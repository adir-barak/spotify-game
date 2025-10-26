import React from 'react';

const EndScreen = ({ finalData, onRestart }) => {
    const { finalScore, history } = finalData;

    // Separate correct and wrong guesses for easy review
    const wrongGuesses = history.filter(h => h.points === 0);
    const correctGuesses = history.filter(h => h.points > 0);

    return (
        <div className="screen-container end-screen">
            <h1 className="title">🎉 Game Over! 🎉</h1>
            <p className="final-score">Your Final Score: **{finalScore}** points</p>
            
            <button className="start-button" onClick={onRestart}>
                Play Again
            </button>

            <hr/>
            
            <h2>Incorrect Guesses Review ({wrongGuesses.length})</h2>
            <p className="small-text">Songs you missed, and who actually added them.</p>
            
            <ul className="wrong-guesses-list">
                {wrongGuesses.length === 0 ? (
                    <li>Perfect game! No missed songs.</li>
                ) : (
                    wrongGuesses.map((item, index) => (
                        <li key={index} className="review-item">
                            **{item.songTitle}** by {item.artists}
                            <br/>
                            Guessed: *{item.guessedName}* | Added By: **{item.correctName}**
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default EndScreen;