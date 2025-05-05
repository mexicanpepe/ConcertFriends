// backend/app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import festivalRoutes from './routes/festivals.js';
import groupRoutes from './routes/groups.js';
import spotifyRoutes from './routes/spotify.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/festivals', festivalRoutes);
app.use('/groups', groupRoutes);
app.use('/spotify', spotifyRoutes);

export default app;

