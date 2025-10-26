import React, { useState, useEffect, useMemo } from 'react';
import PartyPlaylistGame from '../GameLogic';
import playlistData from '../assets/data/playlistData.json';
import SongCard from './SongCard';

const Game = ({ onEndGame, roundsLimit }) => {
    // Initialize game logic once
    const game = useMemo(() => new PartyPlaylistGame(
        playlistData.songs, 
        playlistData.metadata.players
    ), []);

    const [currentSong, setCurrentSong] = useState(null);
    const [gameState, setGameState] = useState(game.gameState);
    const [feedback, setFeedback] = useState(null); // { message, isCorrect, guessedName }
    const [isGuessing, setIsGuessing] = useState(true);
    const [currentRound, setCurrentRound] = useState(0);

    // Initial song selection on component mount
    useEffect(() => {
        nextRound();
    }, []);

    const checkGameOver = (nextRoundNumber) => {
        // End condition 1: All available songs are done
        const allSongsExhausted = game.gameState.songsRemaining === 0;
        
        // End condition 2: Reached the round limit
        const limitReached = roundsLimit > 0 && nextRoundNumber > roundsLimit;

        return allSongsExhausted || limitReached;
    }

    const nextRound = () => {
        const nextRoundNumber = currentRound + 1;
        
        if (checkGameOver(nextRoundNumber)) {
            // Game is over based on limit or exhausted songs
            onEndGame({
                finalScore: game.gameState.score,
                history: game.gameHistory,
                roundsPlayed: currentRound
            });
            return;
        }

        const nextSong = game.selectSong();
        if (nextSong) {
            setCurrentSong(nextSong);
            setGameState(game.gameState);
            setFeedback(null);
            setIsGuessing(true);
            setCurrentRound(nextRoundNumber);
        } else {
            // Game over due to running out of songs (safety check)
             onEndGame({
                finalScore: game.gameState.score,
                history: game.gameHistory,
                roundsPlayed: currentRound
            });
        }
    };

    const handleGuess = (guessedName) => {
        if (!isGuessing) return;

        setIsGuessing(false);
        
        const result = game.submitGuess(guessedName);
        
        setFeedback({ 
            message: result.message, 
            isCorrect: result.isCorrect,
            guessedName: result.guessedName
        });
        
        // Update the full game state to refresh the score
        setGameState(game.gameState);
    };
    
    // Show loading while data loads or initial song is selected
    if (!currentSong && currentRound === 0) {
        return <div className="loading-screen">Loading Game...</div>;
    }

    if (checkGameOver(currentRound)) {
        // Safety check: UI should transition to EndScreen immediately
        return null;
    }
    
    const { score, songsRemaining } = gameState;
    const isFinalRound = currentRound === roundsLimit;
    const buttonText = isFinalRound ? "View Final Score" : "Next Song →";
    
    return (
        <div className="game-screen">
            <div className="score-header">
                <span className="current-score">🏆 Score: {score}</span>
                <span className="round-counter">Round {currentRound} / {roundsLimit}</span>
                <span className="songs-left">Remaining: {songsRemaining}</span>
            </div>
            
            <SongCard 
                song={currentSong} 
                onGuess={handleGuess} 
                isGuessing={isGuessing} 
                feedback={feedback}
            />

            {!isGuessing && (
                <button className="next-button" onClick={nextRound}>
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default Game;