import { useState } from 'react';

export default function NoteModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [color, setColor] = useState('var(--postit-yellow)');

  if (!isOpen) return null;

  const pastelColors = [
    { name: 'Amarillo Pastel', value: 'var(--postit-yellow)', hex: '#fef08a' },
    { name: 'Rosa Pastel', value: 'var(--postit-pink)', hex: '#fbcfe8' },
    { name: 'Azul Pastel', value: 'var(--postit-blue)', hex: '#bae6fd' },
    { name: 'Verde Pastel', value: 'var(--postit-green)', hex: '#bbf7d0' },
    { name: 'Púrpura Pastel', value: 'var(--postit-purple)', hex: '#e9d5ff' },
    { name: 'Naranja Pastel', value: 'var(--postit-orange)', hex: '#fed7aa' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSave({
      id: Date.now().toString(),
      title: title.trim() || 'Nota sin título',
      text: text.trim(),
      status,
      color,
      x: 60 + Math.floor(Math.random() * 150),
      y: 60 + Math.floor(Math.random() * 150),
      createdAt: new Date().toISOString()
    });

    // Reset y cerrar
    setTitle('');
    setText('');
    setStatus('Pendiente');
    setColor('var(--postit-yellow)');
    onClose();
  };

  return (
    <div className="modal fade" id="noteModal" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-theme="dark" tabindex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="noteModalLabel">Agregar Nueva Nota</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
               <div className="form-group">
                 <label className="form-label">Título de la Nota</label>
                 <input
                   type="text"
                   className="form-control"
                   placeholder="Ej: Idea de diseño..."
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   style={{ paddingLeft: '14px' }}
                 />
               </div>
               <div className="form-group">
                  <label className="form-label">Contenido / Texto</label>
                  <textarea
                    className="form-control"
                    placeholder="Detalles del recordatorio..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ paddingLeft: '14px', minHeight: '85px', resize: 'vertical' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado Inicial</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ paddingLeft: '14px', cursor: 'pointer' }}
                  >
                    <option value="Pendiente"><i className="bi bi-hourglass-split"></i> Pendiente</option>
                    <option value="En curso"><i className="bi bi-hourglass"></i> En curso</option>
                    <option value="Hecho"><i className="bi bi-check-circle"></i> Hecho</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div className="pastel-color-grid">
                    {pastelColors.map((c) => (
                      <button
                        type="button"
                        key={c.value}
                        className={`pastel-swatch ${color === c.value ? 'selected' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setColor(c.value)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
                    Cancelar
                  </button>
                  <button type="submit" data-bs-dismiss="modal" className="btn btn-primary" style={{ flex: 1 }}>
                    Guardar Nota
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
