import { useState } from 'react'
import { useNotes } from '../hooks/useGlobalState';

export default function Nota({
  note,
  posX,
  posY,
  isDragging,
  handleMouseDown
}) {
  const { getNotes, updateNote, deleteNote, changeStatus, changeText, changeTitle } = useNotes();
  const [change, setChange] = useState(false);
  
  return (
    <div
      key={note.id}
      className={`postit-note ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        backgroundColor: note.color || 'var(--postit-yellow)'
      }}
    >
      <div className="postit-header">
        <div className="postit-title">
          <input value={note.title} onChange={(e) => { changeTitle(note.id, e.target.value); setChange(true); } } placeholder="Título" />
        </div>
        <span className="postit-drag-handle" onMouseDown={(e) => handleMouseDown(e, note)} title="Mantén presionado para arrastrar">
          <i className="bi bi-arrows-move"></i>
        </span>
      </div>

      <div className="postit-body">
        <textarea
          value={note.text}
          onChange={(e) => { changeText(note.id, e.target.value); setChange(true); }}
        />
      </div>

      <div className="postit-footer">
        <span className="postit-status-pill">
          <select value={note.status || 'Pendiente'} 
            onChange={(e) => { changeStatus(note.id, e.target.value); setChange(true); }}>
            <option value="Pendiente">Pendiente</option>
            <option value="En curso">En curso</option>
            <option value="Hecho">Hecho</option>
          </select>
        </span>
        {change ? (
          <>
            <button
              className="btn-postit-delete"
              onClick={() => {getNotes(); setChange(false);}}
              title="Cancelar cambios"
            >
              <i className="bi bi-x"></i>
            </button>
            <button
              className="btn-postit-delete"
              onClick={() => {updateNote(note.id, note); setChange(false);}}
              title="Guardar cambios"
            >
              <i className="bi bi-check"></i>
            </button>
          </>
        ) : (
          <button
            className="btn-postit-delete"
            onClick={() => deleteNote(note.id)}
            title="Eliminar esta nota"
          >
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
};
