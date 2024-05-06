import React from 'react';
import './Modal.css';

function HowToPlayModal({ onClose }) {
    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleBackgroundClick}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>How to Play</h2>
                <p>Welcome to Word Weaver! Here's how to play:</p>
                <ul>
                    <li>Start with the given starting word.</li>
                    <li>Each new word must start with the last letter of the previous word.</li>
                    <li>Try to reach the target word with as few words as possible.</li>
                    <li>Use hints if you get stuck, but beware of score penalties!</li>
                </ul>
            </div>
        </div>
    );
}

export default HowToPlayModal;