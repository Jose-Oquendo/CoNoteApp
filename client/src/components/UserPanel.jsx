import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useGlobalState';
import UserModal from './UserModal';

export default function UserPanel({ user }) {
  const { users, getUsers, addUser, updateNote } = useUser();

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEdit, setUserEdit] = useState(null);
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const handleSave = async (data) => {
    if (userId) {
      await updateNote(userId, data);
    } else {
      await addUser(data);
    }
    clearData();
  };

  const clearData = () => {
    setOpen(false);
    setUserEdit(null);
    setUserId(null);
  };

  const handleUserCreate = () => {
    clearData();
    setOpen(true);
  };

  const handleUserEdit = (us) => {
    setUserId(us.id);
    setUserEdit(us);
    setOpen(true);
  };

  const resetFilters = () => {
    setText('');
    setEmail('');
    setRole('');
    setStatusFilter('');
  };

  const filteredUsers = users.filter((u) => {
    const uUsername = (u.username || '').toLowerCase();
    const uName = (u.name || '').toLowerCase();
    const uEmail = (u.email || '').toLowerCase();
    const uRole = (u.role || '').toLowerCase();

    const matchesName = text === '' || uUsername.includes(text.toLowerCase()) || uName.includes(text.toLowerCase());
    const matchesEmail = email === '' || uEmail.includes(email.toLowerCase());
    const matchesRol = role === '' || uRole === role.toLowerCase();
    const matchesStatus = statusFilter === '' || (statusFilter === 'active' ? u.active : !u.active);

    return matchesName && matchesEmail && matchesRol && matchesStatus;
  });

  // Métricas rápidas de usuarios
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;
  const activeCount = users.filter((u) => u.active).length;

  return (
    <div className="container py-4">
      <div className="container-grid-bg"></div>

      {/* Cabecera Principal */}
      <header className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-1">
              <i className="bi bi-people-fill me-1"></i> Gestión de Equipo
            </span>
          </div>
          <h2 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
            Panel de Usuarios
          </h2>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 fw-semibold shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            onClick={handleUserCreate}
            style={{ borderRadius: '10px' }}
          >
            <i className="bi bi-person-plus-fill fs-5"></i>
            <span>Crear Usuario</span>
          </button>

          <div className="user-profile-card py-1 px-3 d-none d-md-flex align-items-center" title="Usuario activo">
            <div className="user-avatar"><i className="bi bi-person-circle"></i></div>
            <div className="user-info text-start">
              <div className="user-name">{user?.name || 'Administrador'}</div>
              <div className="user-role">@{user?.username || 'admin'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tarjetas KPI de Usuarios */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'rgba(51, 162, 192, 0.15)', color: '#33a2c0' }}>
                <i className="bi bi-people fs-5"></i>
              </div>
              <div>
                <div className="text-secondary small fw-medium">Total Usuarios</div>
                <div className="fs-4 fw-bold text-white">{totalUsers}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                <i className="bi bi-shield-lock fs-5"></i>
              </div>
              <div>
                <div className="text-secondary small fw-medium">Administradores</div>
                <div className="fs-4 fw-bold text-white">{adminCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <i className="bi bi-person-badge fs-5"></i>
              </div>
              <div>
                <div className="text-secondary small fw-medium">Colaboradores</div>
                <div className="fs-4 fw-bold text-white">{userCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-3 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                <i className="bi bi-check-circle fs-5"></i>
              </div>
              <div>
                <div className="text-secondary small fw-medium">Cuentas Activas</div>
                <div className="fs-4 fw-bold text-success">{activeCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros & Búsqueda */}
      <div className="card border-0 mb-4 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            {/* Input de Búsqueda */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary border-opacity-50"
                  placeholder="Buscar por nombre o @usuario..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            {/* Input Correo */}
            <div className="col-12 col-sm-6 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary border-opacity-50"
                  placeholder="Filtrar por correo..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Selector de Rol */}
            <div className="col-6 col-sm-3 col-md-2">
              <select
                className="form-select bg-dark text-white border-secondary border-opacity-50"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="user">Colaboradores</option>
              </select>
            </div>

            {/* Selector de Estado */}
            <div className="col-6 col-sm-3 col-md-2">
              <select
                className="form-select bg-dark text-white border-secondary border-opacity-50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="active">Solo Activos</option>
                <option value="inactive">Solo Inactivos</option>
              </select>
            </div>

            {/* Botón Limpiar */}
            <div className="col-12 col-md-1 text-end">
              {(text || email || role || statusFilter) && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={resetFilters}
                  title="Limpiar filtros"
                >
                  <i className="bi bi-x-circle me-1"></i> Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card border-0 text-white shadow-sm overflow-hidden" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 18, 20, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th scope="col" className="py-3 px-4 text-secondary small text-uppercase">#</th>
                <th scope="col" className="py-3 text-secondary small text-uppercase">Usuario</th>
                <th scope="col" className="py-3 text-secondary small text-uppercase">Correo</th>
                <th scope="col" className="py-3 text-secondary small text-uppercase">Rol</th>
                <th scope="col" className="py-3 text-secondary small text-uppercase">Estado</th>
                <th scope="col" className="py-3 text-end px-4 text-secondary small text-uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center text-secondary py-3">
                      <i className="bi bi-person-x fs-1 mb-2 text-secondary text-opacity-50"></i>
                      <h6 className="fw-semibold text-light mb-1">No se encontraron usuarios</h6>
                      <p className="small mb-0">Prueba ajustando los criterios de búsqueda o crea un nuevo usuario.</p>
                      {(text || email || role || statusFilter) && (
                        <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={resetFilters}>
                          Restablecer filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => {
                  const isAdmin = u.role === 'admin';
                  const initials = (u.name || u.username || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={u.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-3 px-4 text-secondary small">{index + 1}</td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm flex-shrink-0"
                            style={{
                              width: '38px',
                              height: '38px',
                              fontSize: '13px',
                              background: isAdmin
                                ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                                : 'linear-gradient(135deg, #0284c7, #06b6d4)'
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="fw-semibold text-white">{u.name || 'Sin nombre'}</div>
                            <div className="text-secondary small">@{u.username || 'usuario'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-light text-opacity-90 small">
                          <i className="bi bi-envelope text-secondary me-1"></i>
                          {u.email}
                        </span>
                      </td>
                      <td className="py-3">
                        {isAdmin ? (
                          <span className="badge rounded-pill px-3 py-1 fw-medium" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                            <i className="bi bi-shield-check me-1"></i> Administrador
                          </span>
                        ) : (
                          <span className="badge rounded-pill px-3 py-1 fw-medium" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                            <i className="bi bi-person me-1"></i> Colaborador
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {u.active ? (
                          <span className="badge rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center gap-1" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                            <span className="rounded-circle d-inline-block" style={{ width: '6px', height: '6px', background: '#34d399' }}></span>
                            Activo
                          </span>
                        ) : (
                          <span className="badge rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center gap-1" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <span className="rounded-circle d-inline-block" style={{ width: '6px', height: '6px', background: '#f87171' }}></span>
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1 px-3 py-1"
                          title="Editar usuario"
                          data-bs-toggle="modal"
                          data-bs-target="#userModal"
                          onClick={() => handleUserEdit(u)}
                          style={{ borderRadius: '8px', fontSize: '13px' }}
                        >
                          <i className="bi bi-pencil-square text-info"></i>
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla con contador */}
        <div className="d-flex justify-content-between align-items-center p-3 text-secondary small border-top border-secondary border-opacity-10" style={{ background: 'rgba(15, 18, 20, 0.5)' }}>
          <span>Mostrando <strong>{filteredUsers.length}</strong> de <strong>{totalUsers}</strong> usuarios registrados</span>
          {(text || email || role || statusFilter) && (
            <span className="badge bg-secondary bg-opacity-25 text-light">Filtros aplicados</span>
          )}
        </div>
      </div>

      {/* Modal Reutilizable para Crear y Editar */}
      <UserModal
        idUser={userId}
        dataUser={userEdit}
        onSave={handleSave}
        isOpen={open}
        onClose={clearData}
      />
    </div>
  );
}