import jwt from 'jsonwebtoken';
import { readDB } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'conote-super-secret-jwt-key-2026';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.replace(/^"|"$/g, '');

  if (!token) {
    // Default guest fallback user for unauthenticated basic template requests
    req.user = { id: 'guest', name: 'Usuario Invitado', role: 'user', active: true };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      req.user = { id: 'guest', name: 'Usuario Invitado', role: 'user', active: true };
      return next();
    }

    const db = readDB();
    const currentUser = db.users.find(u => u.id === decodedUser.id);

    if (!currentUser || !currentUser.active) {
      return res.status(403).json({ error: 'Usuario inactivo o eliminado. Acceso revocado.' });
    }

    req.user = currentUser;
    next();
  });
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado: Requiere rol de Administrador' });
  }
};
