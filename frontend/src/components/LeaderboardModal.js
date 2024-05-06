import React, { useEffect, useState } from 'react';
import './Modal.css';

function LeaderboardModal({ onClose }) {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const response = await fetch('http://localhost:3003/api/leaderboard');
                const data = await response.json();
                setLeaders(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard data:', error);
            }
        }
        
        fetchLeaderboard();
    }, []);

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleBackgroundClick}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Leaderboard</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{leader.username}</td>
                                <td>{leader.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaderboardModal;