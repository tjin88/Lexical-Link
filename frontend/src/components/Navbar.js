import React, { useState } from 'react';
import HowToPlayModal from './HowToPlayModal';
import LeaderboardModal from './LeaderboardModal';
import './Navbar.css';

function Navbar() {
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    return (
        <div className="navbar">
            <h1>Word Weaver</h1>
            <div>
                <button onClick={() => setShowHowToPlay(true)}>How to Play</button>
                <button onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
            </div>
            {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
            {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
        </div>
    );
}

export default Navbar;