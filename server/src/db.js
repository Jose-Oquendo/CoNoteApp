import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// // Initial seed data
// const getInitialData = () => {
//   const adminPasswordHash = bcrypt.hashSync('admin123', 10);
//   const userPasswordHash = bcrypt.hashSync('user123', 10);

//   return {
//     users: [
//       {
//         id: 'user-admin-1',
//         username: 'Admin',
//         name: 'Administrador Demo',
//         email: 'admin@example.com',
//         password: adminPasswordHash,
//         role: 'admin',
//         active: true,
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: 'user-normal-1',
//         username: 'User',
//         name: 'Usuario Demo',
//         email: 'user@example.com',
//         password: userPasswordHash,
//         role: 'user',
//         active: true,
//         createdAt: new Date().toISOString()
//       }
//     ],
//     notes: [
//       {
//         id: 'note-1',
//         title: 'Bienvenida a CoNote',
//         text: 'Tablero interactivo de notas post-it sin columnas. ¡Mueve las notas libremente!',
//         status: 'Pendiente',
//         x: 50,
//         y: 60,
//         color: '#fef08a',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       },
//       {
//         id: 'note-2',
//         title: 'Integración AWS SAM Local',
//         text: 'Cálculo de métricas mediante emulación local de AWS Lambda.',
//         status: 'En curso',
//         x: 380,
//         y: 70,
//         color: '#bae6fd',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       },
//       {
//         id: 'note-3',
//         title: 'Entorno Local Docker',
//         text: 'Contenedores Docker Compose para cliente y servidor Express.',
//         status: 'Hecho',
//         x: 710,
//         y: 80,
//         color: '#bbf7d0',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }
//     ]
//   };
// };

export const readDB = () => {
  try {
    // if (!fs.existsSync(DB_FILE)) {
    //   const initialData = getInitialData();
    //   fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    //   return initialData;
    // }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading db.json, returning default reset:", error);
    // const initialData = getInitialData();
    // fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    // return initialData;
  }
};

export const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to db.json:", error);
    throw error;
  }
};
