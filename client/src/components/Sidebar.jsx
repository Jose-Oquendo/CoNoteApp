import { useState } from 'react';

/**
 * Componente Sidebar - Columna izquierda del Dashboard principal.
 * Soporta colapso a solo iconos (72px) o vista expandida (280px).
 */
export default function Sidebar({
  user,
  onOpenAddModal,
  filterStatus,
  setpage,
  setFilterStatus,
  notesCount = 0,
  onLogout
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <section>
      <div className={`subSidebar ${isCollapsed ? 'collapsed' : ''}`}></div>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          {/* Cabecera con marca y botón toggle de colapso */}
          <div className="sidebar-brand-container">
            {!isCollapsed && (
              <div className="sidebar-brand">
                <h1 className="sidebar-title">CoNote</h1>
              </div>
            )}

            {isCollapsed && (
              <div className="sidebar-logo" style={{ margin: '0 auto' }}><i className="bi bi-stickies-fill"></i></div>
            )}

          </div>

          {/* Obtener metricas */}
          <button
            className="btn-sidebar-note"
            onClick={() => setpage('metricas')}
            title="Metricas"
          >
            <span><i className="bi bi-clipboard-data"></i></span>
            {!isCollapsed && <span>Metricas</span>}
          </button>

          {/* Botón principal: Agregar Nueva Nota */}
          <button type="button" 
            className="btn-sidebar-note"
            title="Agregar Nueva Nota"
            data-bs-toggle="modal" 
            data-bs-target="#noteModal"
            onClick={onOpenAddModal}
          >
            <span><i className="bi bi-plus-circle"></i></span>
            {!isCollapsed && <span>Agregar Nueva Nota</span>}
          </button>

          {/* Filtros del tablero */}
          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Filtros de Lienzo</div>

            <button
              className={`sidebar-item ${filterStatus === 'todos' ? 'active' : ''}`}
              onClick={() => { setFilterStatus('todos'); setpage('notas') }}
              title="Todas las notas"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span><i className="bi bi-stickies-fill"></i></span>
                {!isCollapsed && <span>Todas las Notas</span>}
              </div>
              {!isCollapsed && <span className="sidebar-item-badge">{notesCount}</span>}
            </button>

            <button
              className={`sidebar-item ${filterStatus === 'pendiente' ? 'active' : ''}`}
              onClick={() => { setFilterStatus('pendiente'); setpage('notas') }}
              title="Pendientes"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span><i className="bi bi-hourglass-split"></i></span>
                {!isCollapsed && <span>Pendientes</span>}
              </div>
            </button>

            <button
              className={`sidebar-item ${filterStatus === 'en curso' ? 'active' : ''}`}
              onClick={() => { setFilterStatus('en curso'); setpage('notas') }}
              title="En Curso"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span><i className="bi bi-play-circle"></i></span>
                {!isCollapsed && <span>En Curso</span>}
              </div>
            </button>

            <button
              className={`sidebar-item ${filterStatus === 'hecho' ? 'active' : ''}`}
              onClick={() => { setFilterStatus('hecho'); setpage('notas') }}
              title="Hechas / Completadas"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span><i className="bi bi-check-circle"></i></span>
                {!isCollapsed && <span>Completadas</span>}
              </div>
            </button>
          </nav>
        </div>

        <button
          className="btn-toggle-sidebar"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
        >
          {isCollapsed ? <i className="bi bi-arrow-right-circle"></i> : <i className="bi bi-arrow-left-circle"></i>}
        </button>

        {/* Perfil de usuario y botón de salir */}
        <div className="sidebar-bottom">
          <div className="user-profile-card" onClick={() => setpage('usuarios')} title="Perfil de Usuario">
            <div className="user-avatar"><i className="bi bi-person-circle"></i></div>
            {!isCollapsed && (
              <div className="user-info">
                <div className="user-name">{user?.name || 'Administrador'}</div>
                <div className="user-role">@{user?.username || 'admin'} ({user?.role || 'admin'})</div>
              </div>
            )}
          </div>

          <button className="btn-logout" onClick={onLogout} title="Cerrar Sesión">
            <span><i className="bi bi-box-arrow-left"></i></span>
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </section>
  );
}
