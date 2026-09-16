import express from 'express';
import { readDB, writeDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/notes - List all notes
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.notes || []);
});

// POST /api/notes - Create note
router.post('/', (req, res) => {
  const { title, text, status, position, color } = req.body;

  const validStatuses = ['Pendiente', 'En curso', 'Hecho'];
  const noteStatus = validStatuses.includes(status) ? status : 'Pendiente';

  const defaultColors = ['#fef08a', '#bae6fd', '#bbf7d0', '#fbcfe8', '#fed7aa'];
  const noteColor = color || defaultColors[Math.floor(Math.random() * defaultColors.length)];

  const db = readDB();
  const newNote = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: title ? title.trim() : 'Nueva Nota',
    text: text ? text.trim() : '',
    status: noteStatus,
    x: position && typeof position.x === 'number' ? position.x : 50 + Math.floor(Math.random() * 200),
    y: position && typeof position.y === 'number' ? position.y : 50 + Math.floor(Math.random() * 150),
    color: noteColor,
    createdBy: req.user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.notes.push(newNote);
  writeDB(db);

  res.status(201).json(newNote);
});

// PUT /api/notes/:id - Update note (content, status, or position coordinates)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, text, status, position, color } = req.body;

  const db = readDB();
  const noteIndex = db.notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  const currentNote = db.notes[noteIndex];

  if (title !== undefined) currentNote.title = title.trim();
  if (text !== undefined) currentNote.text = text.trim();
  if (status !== undefined) {
    const validStatuses = ['Pendiente', 'En curso', 'Hecho'];
    if (validStatuses.includes(status)) {
      currentNote.status = status;
    }
  }
  if (position && typeof position.x === 'number' && typeof position.y === 'number') {
    currentNote.x = Math.max(0, Math.round(position.x));
    currentNote.y = Math.max(0, Math.round(position.y));
  }
  if (color) currentNote.color = color;

  currentNote.updatedAt = new Date().toISOString();
  db.notes[noteIndex] = currentNote;
  writeDB(db);

  res.json(currentNote);
});

// DELETE /api/notes/:id - Delete note
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const db = readDB();
  const initialLength = db.notes.length;
  db.notes = db.notes.filter(n => n.id !== id);

  if (db.notes.length === initialLength) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  writeDB(db);
  res.json({ message: 'Nota eliminada correctamente', id });
});

export default router;
