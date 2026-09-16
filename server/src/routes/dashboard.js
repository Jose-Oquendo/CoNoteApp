import express from 'express';
import { readDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/dashboard/metrics
router.get('/metrics', async (req, res) => {
  const samApiUrl = process.env.SAM_LOCAL_URL || 'http://localhost:3001/metrics';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const samResponse = await fetch(samApiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'aws-sam-cli-local-test',
            'authorization': req.headers['authorization'] || ''
        }
    });

    clearTimeout(timeoutId);

    if (samResponse.ok) {
        const samData = await samResponse.json();
        console.log("Respuesta SAM Local exitosa!");
        return res.json({
            ...samData,
            source: 'sam_local'
        });
    } else {
        const errorText = await samResponse.text();
        console.error(`SAM Local respondió con estado ${samResponse.status}:`, errorText);
    } 
  } catch (samError) {
    if (samError.name === 'AbortError') {
        //Por ajustar
        console.log('La petición fue abortada por tiempo de espera.');
    } else{
        console.log("Error general al ejecutar SAM Local");

    }
  }

  // Fallback: Calculate metrics from database
  
  try {
    const db = readDB();
    const notes = db.notes || [];

    const totalNotes = notes.length;
    let pendingCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;

    notes.forEach(note => {
      const status = (note.status || '').toLowerCase().trim();
      if (status === 'pendiente' || status === 'pending') {
        pendingCount++;
      } else if (status === 'en curso' || status === 'in_progress' || status === 'encurso') {
        inProgressCount++;
      } else if (status === 'hecho' || status === 'completed' || status === 'done') {
        doneCount++;
      } else {
        pendingCount++;
      }
    });

    const pendingPercent = totalNotes > 0 ? Math.round((pendingCount / totalNotes) * 100) : 0;
    const inProgressPercent = totalNotes > 0 ? Math.round((inProgressCount / totalNotes) * 100) : 0;
    const donePercent = totalNotes > 0 ? Math.round((doneCount / totalNotes) * 100) : 0;

    return res.json({
      success: true,
      executor: "API Local Backend",
      source: "express_local",
      timestamp: new Date().toISOString(),
      metrics: {
        totalNotes,
        byStatus: {
          pendiente: pendingCount,
          enCurso: inProgressCount,
          hecho: doneCount
        },
        percentages: {
          pendiente: pendingPercent,
          enCurso: inProgressPercent,
          hecho: donePercent
        }
      }
    });
  } catch (err) {
    console.error("Error calculating fallback dashboard metrics:", err);
    res.status(500).json({ error: "Error interno calculando las métricas del dashboard" });
  }
});

export default router;
