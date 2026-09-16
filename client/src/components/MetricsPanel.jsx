import { useEffect } from 'react';
import { useNotes } from '../hooks/useGlobalState';

export default function MetricsPanel({ user, onGoToNotes }) {
  const { metrics, getMetrics, loadingMetrics } = useNotes();

  useEffect(() => {
    getMetrics();
  }, []);

  const total = metrics?.metrics?.totalNotes || 0;
  const pendientes = metrics?.metrics?.byStatus?.pendiente || 0;
  const enCurso = metrics?.metrics?.byStatus?.enCurso || 0;
  const hechos = metrics?.metrics?.byStatus?.hecho || 0;

  const pctPendiente = metrics?.metrics?.percentages?.pendiente || 0;
  const pctEnCurso = metrics?.metrics?.percentages?.enCurso || 0;
  const pctHecho = metrics?.metrics?.percentages?.hecho || 0;

  const isSamLocal = metrics?.source === 'sam_local';

  return (
    <div className="container py-4">
      <div className="container-grid-bg"></div>

      {/* Cabecera Principal */}
      <header className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-1">
              <i className="bi bi-speedometer2 me-1"></i> Dashboard Analytics
            </span>
            {metrics?.source && (
              <span className={`badge rounded-pill px-3 py-1 ${isSamLocal ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25' : 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'}`}>
                <i className={`bi ${isSamLocal ? 'bi-lightning-charge-fill' : 'bi-hdd-network'} me-1`}></i>
                {isSamLocal ? 'AWS SAM Local (Lambda)' : 'Backend Express Local'}
              </span>
            )}
          </div>
          <h2 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
            <span>Métricas del Tablero</span>
          </h2>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-muted btn-sm d-flex align-items-center gap-2 px-3 py-2"
            onClick={() => getMetrics()}
            disabled={loadingMetrics}
            title="Refrescar métricas"
          >
            <i className={`bi bi-arrow-clockwise ${loadingMetrics ? 'spin-anim' : ''}`}></i>
            <span>{loadingMetrics ? 'Actualizando...' : 'Actualizar'}</span>
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

      {/* Tarjetas KPI Superiores */}
      <div className="row g-3 mb-4">
        {/* Total Notas */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(145deg, rgba(28,32,38,0.9), rgba(18,20,24,0.95))', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-secondary small text-uppercase fw-semibold tracking-wider">Total de Notas</span>
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '44px', height: '44px', background: 'rgba(51, 162, 192, 0.15)', color: '#33a2c0' }}>
                  <i className="bi bi-stickies-fill fs-5"></i>
                </div>
              </div>
              <h2 className="display-6 fw-bold mb-1">{total}</h2>
              <div className="text-secondary small">Notas creadas en el lienzo</div>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(145deg, rgba(28,32,38,0.9), rgba(18,20,24,0.95))', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(254, 240, 138, 0.2)' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-secondary small text-uppercase fw-semibold tracking-wider">Pendientes</span>
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '44px', height: '44px', background: 'rgba(254, 240, 138, 0.15)', color: '#fef08a' }}>
                  <i className="bi bi-hourglass-split fs-5"></i>
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <h2 className="display-6 fw-bold mb-0 text-warning">{pendientes}</h2>
                <span className="badge bg-warning bg-opacity-25 text-warning fw-semibold">{pctPendiente}%</span>
              </div>
              <div className="text-secondary small">Por iniciar o en espera</div>
            </div>
          </div>
        </div>

        {/* En Curso */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(145deg, rgba(28,32,38,0.9), rgba(18,20,24,0.95))', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-secondary small text-uppercase fw-semibold tracking-wider">En Curso</span>
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '44px', height: '44px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <i className="bi bi-play-circle-fill fs-5"></i>
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <h2 className="display-6 fw-bold mb-0" style={{ color: '#38bdf8' }}>{enCurso}</h2>
                <span className="badge fw-semibold" style={{ background: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8' }}>{pctEnCurso}%</span>
              </div>
              <div className="text-secondary small">En progreso activo</div>
            </div>
          </div>
        </div>

        {/* Completadas / Hechas */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(145deg, rgba(28,32,38,0.9), rgba(18,20,24,0.95))', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-secondary small text-uppercase fw-semibold tracking-wider">Completadas</span>
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '44px', height: '44px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                  <i className="bi bi-check-circle-fill fs-5"></i>
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <h2 className="display-6 fw-bold mb-0 text-success">{hechos}</h2>
                <span className="badge bg-success bg-opacity-25 text-success fw-semibold">{pctHecho}%</span>
              </div>
              <div className="text-secondary small">Finalizadas exitosamente</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Distribución Visual */}
      <div className="card border-0 mb-4 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
            <h5 className="fw-bold mb-0">Distribución de Estados en el Lienzo</h5>
            <div className="d-flex align-items-center gap-3 small text-secondary">
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', background: '#fef08a' }}></span> Pendiente ({pendientes})
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', background: '#38bdf8' }}></span> En Curso ({enCurso})
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle d-inline-block" style={{ width: '10px', height: '10px', background: '#34d399' }}></span> Hecho ({hechos})
              </span>
            </div>
          </div>

          <div className="progress" style={{ height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${pctPendiente}%`, background: '#fef08a', color: '#1c1917', fontWeight: 'bold' }}
              aria-valuenow={pctPendiente}
              aria-valuemin="0"
              aria-valuemax="100"
              title={`Pendientes: ${pctPendiente}%`}
            >
              {pctPendiente > 8 && `${pctPendiente}%`}
            </div>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${pctEnCurso}%`, background: '#38bdf8', color: '#0f172a', fontWeight: 'bold' }}
              aria-valuenow={pctEnCurso}
              aria-valuemin="0"
              aria-valuemax="100"
              title={`En curso: ${pctEnCurso}%`}
            >
              {pctEnCurso > 8 && `${pctEnCurso}%`}
            </div>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${pctHecho}%`, background: '#34d399', color: '#064e3b', fontWeight: 'bold' }}
              aria-valuenow={pctHecho}
              aria-valuemin="0"
              aria-valuemax="100"
              title={`Hechas: ${pctHecho}%`}
            >
              {pctHecho > 8 && `${pctHecho}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Grilla Inferior: Productividad y Detalles del Servicio */}
      <div className="row g-4">
        {/* Tasa de Éxito / Productividad */}
        <div className="col-12 col-lg-7">
          <div className="card h-100 border-0 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                  <i className="bi bi-pie-chart-fill text-info"></i> Progreso de Cumplimiento
                </h5>
                <p className="text-secondary small mb-4">
                  Porcentaje de tareas completadas sobre el volumen total asignado.
                </p>

                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '110px', height: '110px', borderRadius: '50%', background: `conic-gradient(#34d399 ${pctHecho * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
                    <div className="d-flex flex-column align-items-center justify-content-center rounded-circle" style={{ width: '84px', height: '84px', background: '#181b1d' }}>
                      <span className="fs-4 fw-bold text-white">{pctHecho}%</span>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>Completado</span>
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Pendientes vs Completadas</span>
                        <span>{hechos} de {total}</span>
                      </div>
                      <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                        <div className="progress-bar bg-success" style={{ width: `${pctHecho}%` }}></div>
                      </div>
                    </div>

                    <div className="text-secondary small">
                      {total === 0 ? (
                        'No hay notas en el tablero aún.'
                      ) : pctHecho >= 70 ? (
                        '🔥 ¡Excelente ritmo! La gran mayoría de las tareas están completadas.'
                      ) : pctHecho >= 30 ? (
                        '⚡ Buen avance. Hay notas en curso listas para cerrar.'
                      ) : (
                        '📌 Buen momento para comenzar a priorizar y avanzar en las notas pendientes.'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {onGoToNotes && (
                <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-end">
                  <button type="button" className="btn btn-primary btn-sm px-3" onClick={onGoToNotes}>
                    <i className="bi bi-stickies me-1"></i> Ir al Lienzo de Notas
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información del Motor y Arquitectura */}
        <div className="col-12 col-lg-5">
          <div className="card h-100 border-0 text-white shadow-sm" style={{ background: 'rgba(24, 27, 29, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-cpu-fill text-warning"></i> Diagnóstico del Servicio
              </h5>
              <p className="text-secondary small mb-3">
                Detalles del cómputo y sincronización.
              </p>

              <div className="d-flex flex-column gap-3 mb-3">
                <div className="d-flex justify-content-between align-items-center p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="small text-secondary">Última actualización</span>
                  <span className="small text-light">
                    {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleTimeString() : 'En espera...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
