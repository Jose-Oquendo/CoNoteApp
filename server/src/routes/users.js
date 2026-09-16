import express from 'express';
import bcrypt from 'bcryptjs';
import { readDB, writeDB } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/users - List all users
router.get('/', (req, res) => {
  const db = readDB();
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  const { name, email, password, role, username } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo electrónico y contraseña son obligatorios' });
  }

  const userRole = role === 'admin' ? 'admin' : 'user';

  const db = readDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUser) {
    return res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username: (username || name).trim(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: bcrypt.hashSync(password, 10),
    role: userRole,
    active: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// PUT /api/users/:id - Edit user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, active, username } = req.body;

  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const currentUser = db.users[userIndex];

  // Safeguard: Check admin count before deactivating or removing admin role
  const willBeActiveAdmin = (role !== undefined ? role : currentUser.role) === 'admin' && 
                           (active !== undefined ? active : currentUser.active) === true;

  if (currentUser.role === 'admin' && currentUser.active && !willBeActiveAdmin) {
    const activeAdminsCount = db.users.filter(u => u.role === 'admin' && u.active && u.id !== id).length;
    if (activeAdminsCount === 0) {
      return res.status(400).json({ 
        error: 'No se puede desactivar o cambiar el rol. Debe conservarse siempre al menos un administrador activo.' 
      });
    }
  }

  // Check email uniqueness if email is changed
  if (email && email.toLowerCase().trim() !== currentUser.email) {
    const emailExists = db.users.some(u => u.id !== id && u.email.toLowerCase() === email.toLowerCase().trim());
    if (emailExists) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso por otro usuario' });
    }
    currentUser.email = email.toLowerCase().trim();
  }

  if (name) currentUser.name = name.trim();
  if (username) currentUser.username = username.trim();
  if (role) currentUser.role = role === 'admin' ? 'admin' : 'user';
  if (active !== undefined) currentUser.active = Boolean(active);
  if (password && password.trim().length > 0) {
    currentUser.password = bcrypt.hashSync(password.trim(), 10);
  }

  currentUser.updatedAt = new Date().toISOString();
  db.users[userIndex] = currentUser;
  writeDB(db);

  const { password: _, ...safeUser } = currentUser;
  res.json(safeUser);
});

export default router;
