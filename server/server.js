// Package Imports
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import checkWord from 'check-word';
import { generate, count } from "random-words";
import Redis from 'redis';

// Schema Imports
import DailyChallenge from './schemas/DailyChallengeSchema.js';
import UserProgress from './schemas/UserProgressSchema.js';

// Environment Variables
dotenv.config();
const PORT = process.env.PORT || 3003;
const words = checkWord('en');

// Redis Setup
const redisClient = Redis.createClient({
    url: 'redis://localhost:6379' // Update this if once Redis is hosted elsewhere
});
redisClient.connect();

// NODE JS SERVER SETUP
const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3003', 'https://word-weaver.web.app'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            console.error('Origin not allowed:', origin);
            return callback(new Error('The CORS policy for this site does not allow access from the specified origin.'), false);
        }
        return callback(null, true);
    }
}));

// Connect to MongoDB
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB successfully");
});

// HELPER FUNCTIONS
async function acquireLock(lockKey, timeout = 5000) {
    const lock = await redisClient.set(lockKey, 'locked', {
        NX: true,
        PX: timeout
    });
    return lock === 'OK';
}

async function releaseLock(lockKey) {
    await redisClient.del(lockKey);
}

function randomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}

function calculateScore(wordsUsed, hintsUsed) {
    let score = 1000;
    const penaltyPerHint = 100;
    const penaltyPerWord = 50;

    score -= hintsUsed * penaltyPerHint;
    score -= (wordsUsed.length - 3) * penaltyPerWord;

    wordsUsed.forEach(word => {
        if (word.length > 5) score += 10;
    });

    return Math.max(score, 0);
}

// ROUTES
app.get('/', (req, res) => {
    res.send('Yup, we are up and running :)');
});

app.get('/api/challenges/today', async (req, res) => {
    const today = new Date().setHours(0, 0, 0, 0);
    let challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
        const lockAcquired = await acquireLock('challengeLock');

        if (lockAcquired) {
            challenge = await DailyChallenge.findOne({ date: today });
            if (!challenge) {
                const startWord = generate({ minLength: 5 });
                let targetWord = generate({ minLength: 5 });
                while (startWord === targetWord) {
                    targetWord = generate({ minLength: 5 });
                }

                console.log('Creating new daily challenge with start word:', startWord, 'and target word:', targetWord)
                challenge = new DailyChallenge({
                    date: today,
                    startWord,
                    targetWord,
                    hints: []
                });
                try {
                    await challenge.save();
                    console.log('Challenge saved successfully:', challenge);
                } catch (error) {
                    console.error('Failed to save the challenge:', error);
                }
            }
            await releaseLock('challengeLock');
        } else {
            console.log('Lock not acquired. Waiting for the challenge to be generated...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for lock release
            challenge = await DailyChallenge.findOne({ date: today });
        }
    }

    res.json(challenge);
});

app.post('/api/challenges', async (req, res) => {
    const { date, startWord, targetWord, hints } = req.body;
    try {
        const challenge = await DailyChallenge.findOneAndUpdate({ date }, {
            date,
            startWord,
            targetWord,
            hints
        }, { new: true, upsert: true });
        res.json(challenge);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/validate-word', async (req, res) => {
    const { word } = req.body;
    try {
        const isValid = words.check(word.toLowerCase());
        res.json({ isValid });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/api/user-progress', async (req, res) => {
    const { userId, date, wordsUsed, hintsUsed } = req.body;
    try {
        const score = calculateScore(wordsUsed, hintsUsed);
        const progress = new UserProgress({
            userId,
            date,
            wordsUsed,
            score,
            hintsUsed
        });
        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.get('/api/user-progress/:userId', async (req, res) => {
    const { userId } = req.params;
    const { date } = req.query;
    try {
        const progress = await UserProgress.findOne({ userId, date });
        if (!progress) return res.status(404).send('No progress found for this user on this date.');
        res.json(progress);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});