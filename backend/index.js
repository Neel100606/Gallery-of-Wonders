import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import cors from 'cors';
import path from "path";

import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import collectionRoutes from "./routes/collectionRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
const port = process.env.PORT || 5000;
connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Attach the `io` instance to the request object BEFORE the routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/comments', commentRoutes);

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  socket.on('joinWorkRoom', (workId) => {
    socket.join(workId);
    console.log(`Socket ${socket.id} joined room for work: ${workId}`);
  });

  socket.on('leaveWorkRoom', (workId) => {
    socket.leave(workId);
    console.log(`Socket ${socket.id} left room for work: ${workId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Server startup
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});