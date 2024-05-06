import React, { useState, useEffect } from 'react';
import CompletionModal from './CompletionModal';
import Advertisement from './Advertisement';
import './Game.css';

function Game() {
    const [currentWord, setCurrentWord] = useState('');
    const [wordChain, setWordChain] = useState([]);
    const [error, setError] = useState('');
    const [startWord, setStartWord] = useState('');
    const [targetWord, setTargetWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [completed, setCompleted] = useState(false);
    const [showCompletion, setShowCompletion] = useState(true);

    useEffect(() => {
        const fetchDailyChallenge = async () => {
            try {
                const response = await fetch('http://localhost:3003/api/challenges/today');
                const { startWord, targetWord } = await response.json();
                setStartWord(startWord);
                setTargetWord(targetWord);
                setWordChain([startWord]);
            } catch (error) {
                console.error('Failed to fetch the daily challenge:', error);
            }
        };
        
        fetchDailyChallenge();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft > 0 && !completed) {
                setTimeLeft(timeLeft => timeLeft - 1);
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [completed, timeLeft]);

    const handleInputChange = (event) => {
        setCurrentWord(event.target.value);
    };

    const validateWord = async () => {
        if (!currentWord) {
            setError('Please enter a word before submitting.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3003/api/validate-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: currentWord }),
            });
            const data = await response.json();
            if (data.isValid) {
                const lastWord = wordChain[wordChain.length - 1];
                if (currentWord[0] === lastWord[lastWord.length - 1]) {
                    updateWordChain(currentWord);
                    setCurrentWord('');
                    setError('');

                    if (currentWord[currentWord.length - 1] === targetWord[0]) setCompleted(true);
                } else {
                    setError('This word does not fit the chain.');
                }
            } else {
                setError('This word is invalid.');
            }
        } catch (error) {
            setError('Failed to validate the word. Please try again.');
        }
    };

    const updateWordChain = (word) => {
        setWordChain([...wordChain, word]);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            validateWord();
        }
    };

    return (
        <div className="game">
            <h1>Word Weaver</h1>
            <p>Start: {startWord} - Target: {targetWord}</p>
            <p>Time left: {timeLeft} seconds</p>
            <input
                type="text"
                value={currentWord}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your next word"
            />
            <button onClick={validateWord}>Submit</button>
            {error && <p className="error">{error}</p>}
            <div className="word-chain">
                {wordChain.map((word, index) => (
                    <span key={index}>{word} </span>
                ))}
            </div>
            {completed && showCompletion && <CompletionModal wordChain={wordChain} timeLeft={timeLeft} onClose={() => setShowCompletion(false)} />}
            {/* TODO: Waiting to get approved by Google AdSense ... */}
            {/* {completed && <Advertisement />} */}
        </div>
    );
}

export default Game;