const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Connect to database
connectDB();

const checkOrigin = (origin, callback) => {
    // allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);

    const isLocal = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
    const isVercel = origin.endsWith('.vercel.app');
    const isRender = origin.endsWith('.onrender.com');
    const frontendUrl = process.env.FRONTEND_URL;
    const isConfigured = frontendUrl && (origin === frontendUrl || origin.startsWith(frontendUrl));

    if (isLocal || isVercel || isRender || isConfigured) {
        return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
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

// Simple root route for health checks and browsers
app.get('/', (req, res) => {
    res.send('API is running');
});

// Socket.io logic
require('./socketHandler')(io);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
