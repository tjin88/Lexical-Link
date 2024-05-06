import React from 'react';
import './Modal.css';
import './CompletionModal.css';

function CompletionModal({ wordChain, timeLeft, onClose }) {
    const wordsUsed = wordChain.length;
    const score = calculateScore(wordsUsed, timeLeft); 

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleBackgroundClick}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="completion-display">
                    <div className="congrats-animation">
                        🎉 Congratulations! 🎉
                    </div>
                    <div className="game-stats">
                        <p>You completed the challenge with {wordsUsed} words!</p>
                        <p>Time remaining: {timeLeft} seconds</p>
                        <p>Your score: {score}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function calculateScore(wordsUsed, timeLeft) {
    return 1000 - (wordsUsed - 2) * 100 + timeLeft * 5;
}

export default CompletionModal;