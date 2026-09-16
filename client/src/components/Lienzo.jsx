import { useState, useRef } from 'react';
import { useNotes } from '../hooks/useGlobalState';
import Nota from './Nota';

export default function Lienzo({
  onOpenAddModal,
  filterStatus
}) {
  const { notes, updateNotePos, clearNotes, saveNotePos } = useNotes();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeDragId, setActiveDragId] = useState(null);

  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const onClearLienzo = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todas las notas del lienzo?')) {
      clearNotes();
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (filterStatus === 'todos') return true;
    return (note.status || '').toLowerCase() === filterStatus.toLowerCase();
  });

  const handleMouseDown = (e, note) => {
    if (e.target.closest('.btn-postit-delete')) return;

    setActiveDragId(note.id);

    const initialX = note.x ?? 40;
    const initialY = note.y ?? 40;

    dragOffsetRef.current = {
      x: e.clientX - initialX,
      y: e.clientY - initialY
    };

    const handleMouseMove = (moveEvent) => {
      const newX = Math.max(40, moveEvent.clientX - dragOffsetRef.current.x);
      const newY = Math.max(40, moveEvent.clientY - dragOffsetRef.current.y);

      console.log("posicion: ", newX, newY);
      updateNotePos(note.id, newX, newY);
    };

    const handleMouseUp = (moveEvent) => {
      const newX = Math.max(40, moveEvent.clientX - dragOffsetRef.current.x);
      const newY = Math.max(40, moveEvent.clientY - dragOffsetRef.current.y);
      console.log("guardar: ", newX, newY);
      saveNotePos(note.id, newX, newY);

      setActiveDragId(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 140));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));
  const resetZoom = () => setZoomLevel(100);

  return (
    <section className="lienzo-container">
      <div className="lienzo-grid-bg" />
      <div
        className="lienzo-canvas-area"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top left',
          transition: activeDragId ? 'none' : 'transform 0.2s ease'
        }}
      >
        {filteredNotes.length === 0 ? (
          <div className="lienzo-empty-state">
            <h3 className="empty-title">Lienzo Principal Vacío</h3>
            <p className="empty-description">
              No hay notas en el lienzo. Presiona <strong>"Agregar Nueva Nota"</strong> en el menú lateral para colocar tu primer Post-it arrastrable.
            </p>
            <button className="btn-add-note" onClick={onOpenAddModal} style={{ width: 'auto', padding: '12px 24px' }}>
              <span><i class="bi bi-plus"></i></span>
              <span>Agregar Nueva Nota</span>
            </button>
          </div>
        ) : (
          filteredNotes.map((note, index) => {
            const posX = note.x ?? 40 + (index % 4) * 290;
            const posY = note.y ?? 40 + Math.floor(index / 4) * 240;
            const isDragging = activeDragId === note.id;
      
            return (
              <Nota
                note={note}
                posX={posX}
                posY={posY}
                isDragging={isDragging}
                handleMouseDown={handleMouseDown}
              />
            );
          })
        )}
      </div>
      <div className="lienzo-subbar">
        <div className="lienzo-bar-area">
          <span className="sidebar-item-badge" style={{ background: 'var(--cherry-red)', color: '#ffffff' }}>
            {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>

        <div className="lienzo-controls">
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(22, 22, 22, 0.8)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '2px' }}>
            <button className="control-btn" onClick={zoomOut} style={{ border: 'none', padding: '6px 10px' }} title="Alejar"><i class="bi bi-zoom-out"></i> -</button>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '0 6px', fontWeight: 600 }}>{zoomLevel}%</span>
            <button className="control-btn" onClick={zoomIn} style={{ border: 'none', padding: '6px 10px' }} title="Acercar"><i class="bi bi-zoom-in"></i> +</button>
            {zoomLevel !== 100 && (
              <button className="control-btn" onClick={resetZoom} style={{ border: 'none', padding: '6px 8px', fontSize: '11px' }}>100%</button>
            )}
          </div>

          {notes.length > 0 && (
            <button
              className="control-btn"
              onClick={onClearLienzo}
              style={{ color: 'var(--text-light-conote)', borderColor: 'var(--border-focus)' }}
              title="Vaciar lienzo"
            >
              <span><i className='bi bi-trash-fill'></i></span>
              <span>Limpiar Lienzo</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
