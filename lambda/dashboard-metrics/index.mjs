import fs from 'fs';
import path from 'path';

/**
 * -----------------------------------------------------------------------------
 * FUNCIÓN AUXILIAR 1: Extraer notas desde el evento de API Gateway (Body o Query)
 * -----------------------------------------------------------------------------
 * @param {Object} event - Objeto de evento recibido por AWS Lambda
 * @returns {Array} Lista de notas si fueron enviadas en la petición, o array vacío
 */
function parseNotesFromEvent(event) {
  // A) Verificar si las notas fueron enviadas en el cuerpo (body) de la petición HTTP
  if (event && event.body) {
    try {
      const parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      if (Array.isArray(parsedBody.notes)) {
        return parsedBody.notes;
      }
    } catch (err) {
      console.warn("No se pudo procesar el body del evento:", err.message);
    }
  }

  // B) Verificar si las notas fueron enviadas como parámetro en la URL (?notes=[...])
  if (event && event.queryStringParameters && event.queryStringParameters.notes) {
    try {
      const parsedNotes = JSON.parse(event.queryStringParameters.notes);
      if (Array.isArray(parsedNotes)) {
        return parsedNotes;
      }
    } catch (err) {
      console.warn("No se pudo procesar queryStringParameters:", err.message);
    }
  }

  return [];
}

/**
 * -----------------------------------------------------------------------------
 * FUNCIÓN AUXILIAR 2: Cargar notas desde el archivo de Base de Datos (db.json)
 * -----------------------------------------------------------------------------
 * @returns {Array} Lista de notas leídas de la base de datos o datos de prueba fallback
 */
function loadNotesFromStorage() {
  // Lista de rutas posibles donde se encuentra la base de datos db.json
  const dbPaths = [
    process.env.DB_FILE_PATH,
    path.resolve(process.cwd(), '../../server/data/db.json'),
    path.resolve(process.cwd(), '../server/data/db.json'),
    '/app/server/data/db.json',
    '/tmp/db.json',
    './data/db.json'
  ].filter(Boolean);

  // Intentar leer el archivo en cada una de las rutas posibles
  for (const filePath of dbPaths) {
    if (fs.existsSync(filePath)) {
      try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        if (Array.isArray(data.notes)) {
          console.log(`[Lambda Storage] Notas cargadas correctamente desde: ${filePath}`);
          return data.notes;
        }
      } catch (readErr) {
        console.warn(`[Lambda Storage] Error al leer ${filePath}:`, readErr.message);
      }
    }
  }

  // Si la base de datos no existe o está vacía, retornar datos de pruebas por defecto
  console.log("[Lambda Storage] Usando notas de prueba por defecto (Mock Data).");
  return [
    { id: 'note-1', title: 'Bienvenida CoNote', text: 'Nota inicial de prueba', status: 'Pendiente' },
    { id: 'note-2', title: 'Emulación AWS SAM', text: 'Función Lambda activa', status: 'En curso' },
    { id: 'note-3', title: 'Contenedores Docker', text: 'Servicios conectados', status: 'Hecho' }
  ];
}

/**
 * -----------------------------------------------------------------------------
 * FUNCIÓN AUXILIAR 3: Calcular métricas y desgloses de estados
 * -----------------------------------------------------------------------------
 * @param {Array} notes - Lista de objetos de notas
 * @returns {Object} Objeto con contadores totales, desglose por estado y porcentajes
 */
function calculateMetrics(notes) {
  const totalNotes = notes.length;
  let pendingCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;

  // Clasificar cada nota según su campo status
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

  // Calcular porcentajes enteros para visualización gráfica
  const pendingPercent = totalNotes > 0 ? Math.round((pendingCount / totalNotes) * 100) : 0;
  const inProgressPercent = totalNotes > 0 ? Math.round((inProgressCount / totalNotes) * 100) : 0;
  const donePercent = totalNotes > 0 ? Math.round((doneCount / totalNotes) * 100) : 0;

  return {
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
  };
}

/**
 * -----------------------------------------------------------------------------
 * FUNCIÓN AUXILIAR 4: Construir respuesta HTTP compatible con API Gateway Proxy
 * -----------------------------------------------------------------------------
 * @param {number} statusCode - Código de estado HTTP (200, 500, etc.)
 * @param {Object} payload - Cuerpo de la respuesta a convertir a JSON
 * @returns {Object} Formato estándar de proxy de API Gateway
 */
function buildHttpResponse(statusCode, payload) {
  return {
    statusCode: Number(statusCode),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Requested-With",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    isBase64Encoded: false
  };
}

/**
 * =============================================================================
 * HANDLER PRINCIPAL DE LA FUNCIÓN AWS LAMBDA
 * =============================================================================
 * Punto de entrada invocado por AWS Lambda / AWS SAM Local
 *
 * @param {Object} event - Evento recibido (API Gateway HTTP Proxy Event)
 * @param {Object} context - Contexto de ejecución de AWS Lambda
 * @returns {Object} Respuesta HTTP formateada para API Gateway
 */
export const handler = async (event = {}, context = {}) => {
  console.log("=== INICIO DE EJECUCIÓN LAMBDA ===");
  console.log("Evento Recibido:", JSON.stringify(event, null, 2));

  try {
    // Step 1: Intentar extraer notas recibidas en el evento
    let notes = parseNotesFromEvent(event);

    // Step 2: Si no vinieron notas en el evento, cargarlas desde la base de datos db.json
    if (notes.length === 0) {
      notes = loadNotesFromStorage();
    }

    // Step 3: Calcular las métricas y porcentajes del tablero
    const calculatedMetrics = calculateMetrics(notes);

    // Step 4: Armar la estructura del payload de respuesta
    const responsePayload = {
      success: true,
      executor: "AWS Lambda (SAM Local)",
      service: "conote-dashboard-metrics-function",
      timestamp: new Date().toISOString(),
      testingMessage: "¡Métricas calculadas exitosamente por la Función AWS Lambda!",
      metrics: calculatedMetrics
    };

    console.log("Métricas Calculadas:", JSON.stringify(responsePayload, null, 2));
    console.log("=== FIN DE EJECUCIÓN LAMBDA ===");

    // Step 5: Retornar respuesta HTTP 200 OK
    return buildHttpResponse(200, responsePayload);

  } catch (error) {
    console.error("Error en la ejecución de la función Lambda:", error);

    const errorPayload = {
      success: false,
      executor: "AWS Lambda (SAM Local Error)",
      error: error.message
    };

    return buildHttpResponse(500, errorPayload);
  }
};
