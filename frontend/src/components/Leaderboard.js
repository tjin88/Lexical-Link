import React, { useState, useEffect } from 'react';

function Leaderboard() {
    const [leaders, setLeaders] = useState([]);

    // Fetch leaderboard data from the backend
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

    return (
        <div>
            <h1>Leaderboard</h1>
            {leaders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{leader.username}</td>
                                <td>{leader.score}</td>
                                <td>{new Date(leader.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

export default Leaderboard;