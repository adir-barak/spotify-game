// Default probability to draw from the repeat bucket
const P_REPEAT = 0.2;
const SCORE_FIRST_GUESS = 10;
const SCORE_REPEAT_GUESS = 5;

/**
 * Manages the game state, song selection, and scoring logic.
 * The core logic lives here, decoupled from the React UI.
 */
class PartyPlaylistGame {
  constructor(initialSongs, players) {
    // Full list of player names/IDs for guess buttons (FIXED ORDER)
    this.players = players.map((p) => p.name);

    // Use a Map for O(1) lookups and updates by trackId
    this.songs = new Map();
    initialSongs.forEach((song) => {
      this.songs.set(song.trackId, { ...song });
    });

    this.score = 0;
    this.newBucket = new Set(initialSongs.map((s) => s.trackId));
    this.repeatBucket = new Set();
    this.doneBucket = new Set();
    this.history = []; // Stores objects for the end screen: {song, guessedBy, correctBy, points}
    this.currentSong = null;
  }

  /**
   * Finds the song based on the game's selection logic (p_repeat).
   * @returns {Object|null} The song object for the round.
   */
  selectSong() {
    if (this.newBucket.size === 0 && this.repeatBucket.size === 0) {
      this.currentSong = null;
      return null; // Game over
    }

    let bucketToDrawFrom;
    const roll = Math.random();

    // Decide to draw from repeat (20% chance) or new (80% chance)
    if (roll < P_REPEAT && this.repeatBucket.size > 0) {
      bucketToDrawFrom = this.repeatBucket;
    } else {
      bucketToDrawFrom = this.newBucket;
      // Fallback: if newBucket is empty, force draw from repeatBucket (if possible)
      if (bucketToDrawFrom.size === 0 && this.repeatBucket.size > 0) {
        bucketToDrawFrom = this.repeatBucket;
      } else if (bucketToDrawFrom.size === 0) {
        this.currentSong = null;
        return null; // Should be caught by the first check, but for safety
      }
    }

    // Uniformly pick a song from the chosen bucket
    const trackIds = Array.from(bucketToDrawFrom);
    const randomTrackId = trackIds[Math.floor(Math.random() * trackIds.length)];

    const song = this.songs.get(randomTrackId);

    // Update song metadata
    song.timesShown += 1;
    song.firstSeenAt = song.firstSeenAt || Date.now();

    this.currentSong = song;
    return {
      ...song,
      isRepeat: bucketToDrawFrom === this.repeatBucket,
      // Use fixed order for guess options (FIXED: removed shuffle)
      guessOptions: this.players,
    };
  }

  /**
   * Processes a player's guess for the current song.
   * @param {string} guessedName - The player name guessed.
   * @returns {Object} {isCorrect, message, pointsAwarded}
   */
  submitGuess(guessedName) {
    if (!this.currentSong) {
      return { isCorrect: false, message: 'Error: No song selected.', pointsAwarded: 0 };
    }

    const song = this.currentSong;
    const isCorrect = guessedName === song.addedByName;
    const isRepeat = this.repeatBucket.has(song.trackId);
    let pointsAwarded = 0;
    let message = '';

    if (isCorrect) {
      // Correct guess: move to doneBucket, award points
      pointsAwarded = isRepeat ? SCORE_REPEAT_GUESS : SCORE_FIRST_GUESS;
      this.score += pointsAwarded;
      message = isRepeat
        ? `Correct! ${song.addedByName} added this. (+${pointsAwarded} points for a repeat guess)`
        : `Correct! ${song.addedByName} added this. (+${pointsAwarded} points)`;

      this.moveSongToBucket(song.trackId, 'done');
    } else {
      // Incorrect guess: update status/bucket
      if (isRepeat) {
        // Incorrect on repeat guess: remove permanently
        message = `Wrong guess again! The correct answer was ${song.addedByName}. This song is removed permanently. (0 points)`;
        this.moveSongToBucket(song.trackId, 'done');
      } else {
        // Incorrect on first guess: move to repeat bucket
        message = `Wrong! The correct answer was ${song.addedByName}. This song will appear later for a second chance.`;
        this.moveSongToBucket(song.trackId, 'repeat');
      }
    }

    // Record for the end-game summary
    this.history.push({
      songTitle: song.title,
      artists: song.artists.join(', '),
      guessedName,
      correctName: song.addedByName,
      points: pointsAwarded,
    });

    // Clear current song so a new one must be selected next round
    this.currentSong = null;

    return { isCorrect, message, pointsAwarded, guessedName }; // Include guessedName for UI
  }

  /**
   * Utility function to move a track ID between the three buckets and update song status.
   * @param {string} trackId
   * @param {string} targetStatus - "new", "repeat", or "done"
   */
  moveSongToBucket(trackId, targetStatus) {
    const song = this.songs.get(trackId);

    // Remove from current bucket
    if (song.status === 'new') this.newBucket.delete(trackId);
    if (song.status === 'repeat') this.repeatBucket.delete(trackId);

    // Add to new bucket and update status
    song.status = targetStatus;
    if (targetStatus === 'new') this.newBucket.add(trackId);
    if (targetStatus === 'repeat') this.repeatBucket.add(trackId);
    if (targetStatus === 'done') this.doneBucket.add(trackId);
  }

  /**
   * @returns {Object} Current game state summary.
   */
  get gameState() {
    return {
      score: this.score,
      totalSongs: this.songs.size,
      songsRemaining: this.newBucket.size + this.repeatBucket.size,
      newBucketSize: this.newBucket.size,
      repeatBucketSize: this.repeatBucket.size,
      doneBucketSize: this.doneBucket.size,
      gameOver: this.newBucket.size === 0 && this.repeatBucket.size === 0,
    };
  }

  /**
   * @returns {Array} The full history of guesses for the end screen.
   */
  get gameHistory() {
    return this.history;
  }
}

export default PartyPlaylistGame;
