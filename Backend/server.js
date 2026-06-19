const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
consconst { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Connect to database
connectDB();

const checkOrigin = (origin, callback) => {
    if (!origin) return callback(null, true);
    const isLocal = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
    const isVercel = origin.endsWith('.vercel.app');
    const isConfigured = origin === process.env.FRONTEND_URL;

    if (isLocal || isVercel || isConfigured) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: checkOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
});

// Middleware
app.use(cors({
    origin: checkOrigin,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/docs', require('./routes/docRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Socket.io logic
require('./socketHandler')(io);

// Error Handler
app.use(errorHandler);
 {
    console.log(`Server running on port ${PORT}`);
});
