import React, { useState, useEffect, useMemo } from 'react';
import PartyPlaylistGame from '../GameLogic';
import playlistData from '../assets/data/playlistData.json';
import SongCard from './SongCard';

const Game = ({ onEndGame }) => {
    // Initialize game logic once
    const game = useMemo(() => new PartyPlaylistGame(
        playlistData.songs, 
        playlistData.metadata.players
    ), []);

    const [currentSong, setCurrentSong] = useState(null);
    const [gameState, setGameState] = useState(game.gameState);
    const [feedback, setFeedback] = useState(null); // { message, isCorrect }
    const [isGuessing, setIsGuessing] = useState(true);

    // Initial song selection on component mount
    useEffect(() => {
        nextRound();
    }, []);

    const nextRound = () => {
        const nextSong = game.selectSong();
        if (nextSong) {
            setCurrentSong(nextSong);
            setGameState(game.gameState);
            setFeedback(null);
            setIsGuessing(true);
        } else {
            // Game is over
            onEndGame({
                finalScore: game.gameState.score,
                history: game.gameHistory
            });
        }
    };

    const handleGuess = (guessedName) => {
        if (!isGuessing) return;

        setIsGuessing(false);
        
        const result = game.submitGuess(guessedName);
        
        setFeedback({ 
            message: result.message, 
            isCorrect: result.isCorrect 
        });
        
        // Update the full game state to refresh the score
        setGameState(game.gameState);
    };
    
    // Show loading while data loads or initial song is selected
    if (!currentSong && !gameState.gameOver) {
        return <div className="loading-screen">Loading Game...</div>;
    }

    if (gameState.gameOver) {
        // This is a safety check; should be handled by nextRound/onEndGame
        return <div>Game Over!</div>;
    }
    
    const { score, songsRemaining } = gameState;
    
    return (
        <div className="game-screen">
            <div className="score-header">
                <span className="current-score">Score: 🏆 {score}</span>
                <span className="songs-left">Songs Left: {songsRemaining}</span>
            </div>
            
            <SongCard 
                song={currentSong} 
                onGuess={handleGuess} 
                isGuessing={isGuessing} 
                feedback={feedback}
            />

            {!isGuessing && (
                <button className="next-button" onClick={nextRound}>
                    {gameState.songsRemaining === 0 ? "View Final Score" : "Next Song →"}
                </button>
            )}
        </div>
    );
};

export default Game;