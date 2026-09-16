import { useState, useEffect } from 'react';

export default function UserModal({ idUser, dataUser, isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [status, setStatus] = useState(true);
  const [pass, setPass] = useState('');

  // Sincronizar los campos cuando cambia el usuario seleccionado o se abre el modal
  useEffect(() => {
    if (idUser && dataUser) {
      setName(dataUser.name || '');
      setUsername(dataUser.username || '');
      setEmail(dataUser.email || '');
      setRole(dataUser.role || 'user');
      setStatus(dataUser.active !== undefined ? Boolean(dataUser.active) : true);
      setPass('');
    } else {
      setName('');
      setUsername('');
      setEmail('');
      setRole('user');
      setStatus(true);
      setPass('');
    }
  }, [idUser, dataUser, isOpen]);

  // Listener para cuando el modal se cierra mediante Bootstrap (esc, clic fuera, botones dismiss)
  useEffect(() => {
    const modalEl = document.getElementById('userModal');
    if (!modalEl) return;

    const handleHidden = () => {
      onClose();
    };

    modalEl.addEventListener('hidden.bs.modal', handleHidden);
    return () => {
      modalEl.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [onClose]);

  const handleClose = () => {
    setName('');
    setUsername('');
    setEmail('');
    setRole('user');
    setPass('');
    setStatus(true);
    onClose();
  };

  const closeModalBootstrap = () => {
    const modalEl = document.getElementById('userModal');
    if (modalEl && window.bootstrap?.Modal) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance?.hide();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!email.trim()) return;

    // Al crear un usuario, la contraseña es obligatoria
    if (!idUser && !pass.trim()) {
      alert('La contraseña no puede estar vacía');
      return;
    }

    const userData = {
      name: name.trim(),
      username: username.trim() || name.trim(),
      email: email.trim(),
      role,
      active: status
    };

    // Si se ingresó contraseña (obligatoria al crear, opcional al editar)
    if (pass.trim()) {
      userData.password = pass.trim();
    }

    if (idUser) {
      userData.id = idUser;
    }

    onSave(userData);
    closeModalBootstrap();
    handleClose();
  };

  return (
    <div
      className="modal fade"
      id="userModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-theme="dark"
      tabIndex="-1"
      aria-labelledby="userModalUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="userModalUserLabel">
              {idUser ? (
                <>Editar usuario {dataUser?.name || ''}</>
              ) : (
                <>Crear nuevo usuario</>
              )}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form className="form-box" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre del trabajador</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Juan ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="@juan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="correo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  {idUser ? 'Contraseña (opcional para mantener actual)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={idUser ? 'Dejar en blanco para no cambiar' : '••••••••'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required={!idUser}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol del usuario</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Colaborador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={status ? 'true' : 'false'}
                  onChange={(e) => setStatus(e.target.value === 'true')}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
