import { useState } from 'react'
import { NotesContext } from './GlobalContext'

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([])

  // 1. Lógica auxiliar / Funciones privadas (viven aquí, ordenadas)
  const validarNota = (title) => {
    if (!title.trim()) {
      alert('El título no puede estar vacío')
      return false
    }
    return true
  }

  const getNotes = async () => {
    // Implementation for fetching notes

    let res = await fetch('http://localhost:5000/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res = await res.json();

    console.log(res);
    let fecthnotes = []
    if(Array.isArray(res)) {
      fecthnotes = res
    }
    setNotes(fecthnotes);
  }

  // 2. Funciones principales del CRUD
  const addNote = async (nota) => {
    if (!validarNota(nota.title)) return // Usamos la función auxiliar
    // const newNote = { id: Date.now(), ...nota }
    // setNotes((prev) => [...prev, newNote])

    await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nota)
    }); 
    getNotes();
  }

  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    getNotes();
  }

  const clearNotes = () => {
    setNotes([]);
  }

  const updateNote = async (id, updatedData) => {
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });
    getNotes();
  }

  const saveNotePos = async (id, newX, newY) => {
    let res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ position: { x: newX, y: newY } })
    });
    res = await res.json();
    console.log(res);
    getNotes();
  };


  const updateNotePos = async (id, newX, newY) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, x: newX, y: newY } : note
      )
    );
  };

  const changeStatus = (id, newStatus) => {
    const noteToUpdate = notes.find((note) => note.id === id);
    if (noteToUpdate) {
      noteToUpdate.status = newStatus;
      updateNotePos(id, noteToUpdate.x, noteToUpdate.y); // Trigger re-render
    }
  }

  const changeText = (id, newText) => {
    const noteToUpdate = notes.find((note) => note.id === id);
    if (noteToUpdate) {
      noteToUpdate.text = newText;
      updateNotePos(id, noteToUpdate.x, noteToUpdate.y); // Trigger re-render
    }
  };

  const changeTitle = (id, newTitle) => {
    const noteToUpdate = notes.find((note) => note.id === id);
    if (noteToUpdate) {
      noteToUpdate.title = newTitle;
      updateNotePos(id, noteToUpdate.x, noteToUpdate.y); // Trigger re-render
    }
  };

  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const getMetrics = async () => {
    setLoadingMetrics(true);
    try {
      let res = await fetch('http://localhost:5000/api/dashboard/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'aws-sam-cli-local-test',
          'authorization': sessionStorage.getItem('conote_token_session') || ''
        }
      });
      const data = await res.json();
      setMetrics(data);
      return data;
    } catch (err) {
      console.error('Error al obtener métricas del dashboard:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // 3. El return SOLO agrupa lo que los componentes van a usar
  const value = {
    notes,
    getNotes,
    addNote,
    deleteNote,
    updateNote,
    updateNotePos,
    saveNotePos,
    changeTitle,
    changeText,
    changeStatus,
    clearNotes,
    metrics,
    getMetrics,
    loadingMetrics
  }

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}