import React from 'react';

const SongCard = ({ song, onGuess, isGuessing, feedback }) => {
  // Use a class for different UI states (e.g., green for correct, red for wrong)
  const getButtonClass = (name) => {
    if (isGuessing) return 'guess-button';
    
    // After guess, highlight correct and the player's guess
    const isCorrect = name === song.addedByName;
    const wasGuessed = feedback && name === feedback.guessedName; // Use guessedName from feedback object
    
    if (isCorrect) return 'guess-button correct-answer';
    if (wasGuessed && !isCorrect) return 'guess-button incorrect-guess';
    
    return 'guess-button disabled-button';
  };

  return (
    <div className="song-card">
        {/* Repeat Cue */}
        {song.isRepeat && (
            <div className="repeat-ribbon">
                <span role="img" aria-label="repeat">✨ Repeat — Second Chance! ✨</span>
            </div>
        )}
        
        <img 
            src={song.albumArtUrl} 
            alt={`Album art for ${song.album}`} 
            className="album-art" 
        />
        
        <h2 className="song-title">{song.title}</h2>
        <p className="song-artist-album">{song.artists.join(', ')} | {song.album}</p>

        {/* Audio Preview - Keep it minimal */}
        {song.previewUrl && (
            <div className="audio-preview">
                <audio controls src={song.previewUrl} className="audio-control">
                    Your browser does not support the audio element.
                </audio>
                <small>30-Second Preview</small>
            </div>
        )}
        
        <div className="guess-buttons-container">
            {/* The guessOptions array is now fixed order: [Yuval, Dean, Zack, Adir] */}
            {song.guessOptions.map((name) => (
                <button 
                    key={name}
                    className={getButtonClass(name)}
                    onClick={() => onGuess(name)}
                    disabled={!isGuessing}
                >
                    {name}
                </button>
            ))}
        </div>
        
        {/* Feedback/Toast */}
        {feedback && (
            <div className={`feedback-toast ${feedback.isCorrect ? 'toast-correct' : 'toast-wrong'}`}>
                {feedback.message}
            </div>
        )}
    </div>
  );
};

export default SongCard;