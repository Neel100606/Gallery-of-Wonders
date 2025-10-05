// packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import cors from 'cors';

// routes
import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import collectionRoutes from "./routes/collectionRoutes.js"; 
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/comments', commentRoutes); 

// Server startup
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});