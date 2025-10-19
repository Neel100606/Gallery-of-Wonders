// packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import cors from 'cors';
import { createServer } from 'http'; // 👈 Import Node's http module
import { Server } from 'socket.io'; // 👈 Import Socket.IO's Server class

// routes
import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import collectionRoutes from "./routes/collectionRoutes.js"; 
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();
const httpServer = createServer(app); // 👈 Create an HTTP server from your Express app

// 👇 Configure Socket.IO with CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// We need to pass the `io` instance to our controllers.
// The easiest way is to attach it to the request object.
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/comments', commentRoutes); 

// 👇 Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  // Logic for joining a room for a specific work
  socket.on('joinWorkRoom', (workId) => {
    socket.join(workId);
    console.log(`Socket ${socket.id} joined room for work: ${workId}`);
  });

  // Logic for leaving a room
  socket.on('leaveWorkRoom', (workId) => {
    socket.leave(workId);
    console.log(`Socket ${socket.id} left room for work: ${workId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});




// 👇 Change `app.listen` to `httpServer.listen`
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});