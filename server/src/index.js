import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import notesRoutes from './routes/notes.js';
import dashboardRoutes from './routes/dashboard.js';
import { readDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize database seed on startup
readDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoNote API Server', timestamp: new Date().toISOString() });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`CoNote Server running on port ${PORT}`);
});
