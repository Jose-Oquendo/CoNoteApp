import express from 'express';
import bcrypt from 'bcryptjs';
import { readDB } from '../db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas'});
  }

  if (!user.active) {
    return res.status(403).json({ error: 'Esta cuenta se encuentra desactivada' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciales inválidas'});
  }

  const token = generateToken(user);
  
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Inicio de sesión exitoso',
    token,
    user: userWithoutPassword
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

export default router;
