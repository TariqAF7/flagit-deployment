import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import SimulationModal from '../../components/admin/SimulationModal';
import {
  fetchSimulations,
  createSimulation,
  updateSimulation,
  deleteSimulation,
  toggleSimulationPause,
  patchSimulationStatus,
  endSimulation,
} from '../../api/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullhorn,
  faPlus,
  faEdit,
  faPause,
  faPlay,
  faTrash,
  faEye,
  faEllipsisV,
  faShieldHalved,
  faBookOpen,
  faStopCircle,
  faRedo,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

// ─── sub-components ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    Active:    { bg: '#064e3b', color: '#34d399', dot: '#34d399' },
    Pending:   { bg: '#1e3a5f', color: '#60a5fa', dot: '#60a5fa' },
    Paused:    { bg: '#78350f', color: '#fbbf24', dot: '#fbbf24' },
    Completed: { bg: '#334155', color: '#94a3b8', dot: '#94a3b8' },
  };
  const s = map[status] || map.Completed;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      backgroundColor: s.bg, color: s.color,
      padding: '0.25rem 0.7rem', borderRadius: '1rem',
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.02em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: s.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
};

const ProgressBar = ({ value = 0 }) => {
  const pct = Math.min(100, Math.max(0, value));
  const gradient = pct === 100
    ? 'linear-gradient(90deg, #4ade80, #22c55e)'
    : 'linear-gradient(90deg, #F97316, #2DD4BF)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: 72, height: 6, backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{ width: `${pct}%`, height: '100%', background: gradient, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white', minWidth: 30 }}>{pct}%</span>
    </div>
  );
};

const CategoryTag = ({ category }) => {
  const isPhishing = category !== 'Normal';
  const label = category === 'Normal' ? 'Legitimate' : 'Phishing';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em',
      color: isPhishing ? '#f87171' : '#60a5fa', textTransform: 'uppercase',
      backgroundColor: isPhishing ? 'rgba(248,113,113,0.1)' : 'rgba(96,165,250,0.1)',
      padding: '0.15rem 0.5rem', borderRadius: '0.4rem',
    }}>
      <FontAwesomeIcon icon={isPhishing ? faShieldHalved : faCircleCheck} style={{ fontSize: '0.7rem' }} />
      {label}
    </span>
  );
};

// ─── Toast ──────────────────────────────────────────────────────────────────

const Toast = ({ message, type = 'success', onDismiss }) => {
  const bg = { error: '#ef4444', warning: '#f59e0b', info: '#3b82f6', success: '#22c55e' }[type] || '#22c55e';
  return (
    <div style={{
      position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 500,
      backgroundColor: bg, color: 'white',
      padding: '0.85rem 1.25rem', borderRadius: '0.75rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      fontSize: '0.875rem', fontWeight: 600, maxWidth: 380,
      animation: 'slideIn 0.25s ease',
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}>✕</button>
    </div>
  );
};

// ─── date formatter ─────────────────────────────────────────────────────────

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ═════════════════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════════════════

const TrainingSimulations = () => {
  const {
    adminActiveSimulations, setAdminActiveSimulations,
    adminPastSimulations, setAdminPastSimulations,
  } = useAppStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSimulation, setEditingSimulation] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch from API on mount ──────────────────────────────────────────
  const loadSimulations = () => {
    fetchSimulations()
      .then((data) => {
        if (data.active)
          setAdminActiveSimulations(
            data.active.map((s) => ({ ...s, id: s._id, name: s.title || s.name }))
          );
        if (data.past)
          setAdminPastSimulations(
            data.past.map((s) => ({ ...s, id: s._id, name: s.title || s.name }))
          );
      })
      .catch((err) => console.warn('Failed to load simulations:', err.message));
  };

  useEffect(loadSimulations, []);

  // ── CRUD handlers ────────────────────────────────────────────────────
  const handleAdd = () => {
    setEditingSimulation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sim) => {
    setEditingSimulation(sim);
    setIsModalOpen(true);
    setActionMenuId(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingSimulation) {
        // If it's a re-run (has no id yet because it's a "fresh" copy but pre-filled)
        // actually handleRerun sets editingSimulation with NO _id, so we use createSimulation
        if (editingSimulation._id || editingSimulation.id) {
          await updateSimulation(editingSimulation.id || editingSimulation._id, formData);
          showToast(`Simulation "${formData.name}" updated.`);
        } else {
          await createSimulation(formData);
          showToast(`Simulation "${formData.name}" started.`);
        }
      } else {
        await createSimulation(formData);
        showToast(`Simulation "${formData.name}" created.`);
      }
    } catch (err) {
      showToast(`Save failed: ${err.message}`, 'error');
    }
    setIsModalOpen(false);
    loadSimulations();
  };

  const handleDelete = async (id) => {
    setActionMenuId(null);
    if (!window.confirm('Are you sure you want to delete this simulation? All results will be lost.')) return;
    try {
      await deleteSimulation(id);
      showToast('Simulation deleted.');
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
    loadSimulations();
  };

  const handleTogglePause = async (sim) => {
    setActionMenuId(null);
    const newStatus = sim.status === 'Active' ? 'Paused' : 'Active';
    try {
      await patchSimulationStatus(sim.id || sim._id, newStatus);
      showToast(`Simulation ${newStatus === 'Paused' ? 'paused' : 'resumed'}.`, 'info');
    } catch (err) {
      showToast(`Status change failed: ${err.message}`, 'error');
    }
    loadSimulations();
  };

  const handleEndSimulation = async (sim) => {
    setActionMenuId(null);
    if (!window.confirm(`Are you sure you want to end "${sim.name || sim.title}"? This will move it to Past Simulations and save final metrics.`)) return;
    try {
      await endSimulation(sim.id || sim._id);
      showToast('Simulation completed and metrics saved.');
    } catch (err) {
      showToast(`Failed to end simulation: ${err.message}`, 'error');
    }
    loadSimulations();
  };

  const handleRerun = (sim) => {
    // Re-run opens modal pre-filled but with NO ID (so it creates a new one)
    const clone = {
      name: `Re-run: ${sim.name || sim.title}`,
      targetGroup: sim.targetGroup,
      category: sim.category || 'Phishing',
      description: sim.description || '',
      scenarioType: sim.tags ? sim.tags[0] : (sim.category === 'Normal' ? 'Normal Awareness' : 'Spear Phishing'),
      status: 'Pending',
      schedule: new Date().toISOString().slice(0, 16) // Default to now
    };
    setEditingSimulation(clone);
    setIsModalOpen(true);
    setActionMenuId(null);
  };

  // ── Shared table styles ──────────────────────────────────────────────
  const thStyle = { padding: '1.2rem 1rem', fontWeight: 600, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' };
  const tdStyle = { padding: '1.2rem 1rem', verticalAlign: 'middle' };
  const menuBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '0.7rem', width: '100%',
    padding: '0.75rem 1.25rem', border: 'none', background: 'transparent',
    cursor: 'pointer', fontSize: '0.85rem', color: 'white', fontWeight: 600,
    textAlign: 'left', transition: 'background 0.15s',
  };
  const hoverIn  = (e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)');
  const hoverOut = (e) => (e.currentTarget.style.backgroundColor = 'transparent');

  // ═════════════════════════════════════════════════════════════════════
  // JSX helpers
  // ═════════════════════════════════════════════════════════════════════

  return (
    <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
      <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
        <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

        <main className="main-content" style={{
          marginLeft: '280px', backgroundColor: '#167f94',
          padding: '2.5rem', flex: 1, minHeight: '100vh', overflowY: 'auto',
        }}>

          {/* ─────── Header ─────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
             <div style={{ width: 180 }} />
             <div style={{ textAlign: 'center', flex: 1 }}>
               <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
                 <div style={{ width: 4, height: 40, background: 'linear-gradient(180deg,#F97316,#2DD4BF)', borderRadius: 2 }} />
                 <FontAwesomeIcon icon={faBullhorn} style={{ color: '#F97316', fontSize: '2.4rem' }} />
                 <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.03em' }}>
                   Training Simulations
                 </h1>
                 <div style={{ width: 4, height: 40, background: 'linear-gradient(180deg,#2DD4BF,#F97316)', borderRadius: 2 }} />
               </div>
               <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>
                 Orchestrate high-fidelity security simulations and monitor resilience metrics.
               </p>
             </div>
             <div style={{
               backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.85rem 1.75rem', borderRadius: '1.25rem',
               backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', width: 220, textAlign: 'right',
             }}>
               <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>System Health</div>
               <div style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
                 <span style={{ display: 'inline-block', width: 8, height: 8, background: '#34d399', borderRadius: '50%', marginRight: 6 }} />
                 All nodes operational
               </div>
             </div>
          </div>

          {/* ─────── Create New ─────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
            <button
              onClick={handleAdd}
              style={{
                padding: '0.85rem 2rem', backgroundColor: '#F97316', color: 'white',
                border: 'none', borderRadius: '2.5rem', fontSize: '1rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fb923c'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(249,115,22,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F97316'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.3)'; }}
            >
              <FontAwesomeIcon icon={faPlus} />
              Launch New Simulation
            </button>
          </div>

          {/* =================================================================== */}
          {/* Active Simulations Section                                         */}
          {/* =================================================================== */}
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0 }}>Active Management</h2>
              <div style={{ padding: '0.3rem 0.8rem', background: '#F97316', borderRadius: '2rem', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
                {adminActiveSimulations.length} Running
              </div>
            </div>

            <div style={{
              backgroundColor: '#132B44', borderRadius: '1.25rem', padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1000 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={thStyle}>Simulation Name / Category</th>
                    <th style={thStyle}>Target Group</th>
                    <th style={thStyle}>Schedule</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Live Progress</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  {adminActiveSimulations.map((s) => (
                    <tr
                      key={s.id || s._id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{s.name || s.title}</div>
                        <CategoryTag category={s.category} />
                      </td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500 }}>{s.targetGroup}</td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{fmtDate(s.schedule)}</td>
                      <td style={tdStyle}><StatusBadge status={s.status} /></td>
                      <td style={tdStyle}><ProgressBar value={s.progress} /></td>
                      <td style={{ ...tdStyle, textAlign: 'right', position: 'relative' }}>
                        <button
                          onClick={() => setActionMenuId(actionMenuId === (s.id || s._id) ? null : (s.id || s._id))}
                          style={{
                            border: 'none', background: 'rgba(255,255,255,0.08)',
                            color: 'white', padding: '0.6rem 0.9rem',
                            borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {actionMenuId === (s.id || s._id) && (
                          <div style={{
                            position: 'absolute', right: 0, top: '100%', zIndex: 100,
                            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.75rem', overflow: 'hidden', minWidth: 180,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginTop: '0.5rem'
                          }}>
                            <button onClick={() => handleEdit(s)} style={menuBtnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                              <FontAwesomeIcon icon={faEdit} style={{ color: '#F97316', width: 16 }} /> Edit Properties
                            </button>
                            {(s.status === 'Active' || s.status === 'Paused') && (
                              <button onClick={() => handleTogglePause(s)} style={menuBtnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                                <FontAwesomeIcon icon={s.status === 'Active' ? faPause : faPlay} style={{ color: '#fbbf24', width: 16 }} /> {s.status === 'Active' ? 'Pause Stream' : 'Resume Stream'}
                              </button>
                            )}
                            {(s.status === 'Active' || s.status === 'Paused') && (
                              <button onClick={() => handleEndSimulation(s)} style={menuBtnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                                <FontAwesomeIcon icon={faStopCircle} style={{ color: '#f87171', width: 16 }} /> End Simulation
                              </button>
                            )}
                            <button onClick={() => handleDelete(s.id || s._id)} style={{ ...menuBtnStyle, color: '#f87171' }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                              <FontAwesomeIcon icon={faTrash} style={{ width: 16 }} /> Permanently Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {adminActiveSimulations.length === 0 && (
                <div style={{ padding: '5rem 0', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: '3.5rem', opacity: 0.2, marginBottom: '1.5rem' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Zero active simulations</div>
                  <div style={{ fontSize: '0.9rem' }}>Deploy a new campaign to begin organizational testing.</div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================== */}
          {/* Past Simulations Section                                           */}
          {/* =================================================================== */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0 }}>Historical Forensics</h2>
              <div style={{ padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '2rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 700 }}>
                {adminPastSimulations.length} Records
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(19, 43, 68, 0.6)', borderRadius: '1.25rem', padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto',
              backdropFilter: 'blur(10px)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1000 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={thStyle}>Archived Simulation</th>
                    <th style={thStyle}>Completion Date</th>
                    <th style={thStyle}>Total Participants</th>
                    <th style={thStyle}>Final Detection</th>
                    <th style={thStyle}>Final Reporting</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPastSimulations.map((s) => (
                    <tr
                      key={s.id || s._id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                    >
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{s.name || s.title}</div>
                        <CategoryTag category={s.category} />
                      </td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{fmtDate(s.completionDate || s.updatedAt)}</td>
                      <td style={{ ...tdStyle, color: 'white', fontWeight: 700 }}>{s.totalParticipants || 0} users</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: 800, color: (s.finalDetectionRate || 0) >= 70 ? '#34d399' : '#F97316' }}>{s.finalDetectionRate || 0}%</span>
                          <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <div style={{ width: `${s.finalDetectionRate || 0}%`, height: '100%', background: (s.finalDetectionRate || 0) >= 70 ? '#34d399' : '#F97316', borderRadius: 2 }} />
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: 800, color: (s.finalReportingRate || 0) >= 50 ? '#6366f1' : '#94a3b8' }}>{s.finalReportingRate || 0}%</span>
                          <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <div style={{ width: `${s.finalReportingRate || 0}%`, height: '100%', background: (s.finalReportingRate || 0) >= 50 ? '#6366f1' : '#94a3b8', borderRadius: 2 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button
                          onClick={() => handleRerun(s)}
                          style={{
                            border: '1px solid rgba(45, 212, 191, 0.3)', background: 'rgba(45, 212, 191, 0.05)',
                            color: '#2DD4BF', padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 212, 191, 0.15)'; e.currentTarget.style.borderColor = '#2DD4BF'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45, 212, 191, 0.05)'; e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.3)'; }}
                        >
                          <FontAwesomeIcon icon={faRedo} /> Rerun Engine
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {adminPastSimulations.length === 0 && (
                <div style={{ padding: '3rem 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                  No historical data found in the vault.
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* ─────── Components ──────────────────────────────────── */}
      <SimulationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        simulation={editingSimulation}
      />
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(2rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
        main::-webkit-scrollbar { width: 8px; }
        main::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 4px; }
        main::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default TrainingSimulations;