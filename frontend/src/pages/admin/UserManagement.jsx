import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import UserModal from '../../components/admin/UserModal';
import {
  fetchAdminUsers,
  fetchAdminDepartments,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../../api/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faFilter,
  faSearch,
  faPlus,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

// ── Role display helpers ─────────────────────────────────────────────────────
const ROLE_LABEL = {
  user:          'User',
  admin:         'Admin',
  ai_maintainer: 'AI Maintainer',
};

const ROLE_BADGE_STYLE = {
  user: {
    backgroundColor: '#1e3a5f',
    color: '#60a5fa',
  },
  admin: {
    backgroundColor: '#5f3a1e',
    color: '#fbbf24',
  },
  ai_maintainer: {
    backgroundColor: '#1e5f3a',
    color: '#4ade80',
  },
};

const STATUS_BADGE_STYLE = {
  Active: {
    backgroundColor: '#1e5f3a',
    color: '#4ade80',
    dot: '#4ade80',
  },
  Inactive: {
    backgroundColor: '#3a3a3a',
    color: '#94a3b8',
    dot: '#94a3b8',
  },
};

const RoleBadge = ({ rawRole }) => {
  const s = ROLE_BADGE_STYLE[rawRole] || ROLE_BADGE_STYLE.user;
  return (
    <span style={{
      ...s,
      padding: '0.2rem 0.65rem',
      borderRadius: '2rem',
      fontSize: '0.72rem',
      fontWeight: '600',
    }}>
      {ROLE_LABEL[rawRole] || rawRole}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const s = STATUS_BADGE_STYLE[status] || STATUS_BADGE_STYLE.Inactive;
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '0.3rem', 
      backgroundColor: s.backgroundColor,
      color: s.color,
      padding: '0.2rem 0.6rem', 
      borderRadius: '2rem', 
      fontSize: '0.72rem', 
      fontWeight: '600' 
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.dot }} />
      {status}
    </div>
  );
};

// ── Toast component (self-dismissing) ────────────────────────────────────────
const Toast = ({ message, type = 'success', onDismiss }) => {
  const bg = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#22c55e';
  return (
    <div style={{
      position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 500,
      backgroundColor: bg, color: 'white',
      padding: '0.85rem 1.25rem',
      borderRadius: '0.75rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      fontSize: '0.875rem', fontWeight: '600',
      maxWidth: '360px',
      animation: 'slideIn 0.25s ease',
    }}>
      {type === 'success' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {type === 'error' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )}
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0, opacity: 0.7 }}>✕</button>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const UserManagement = () => {
  const { adminUsers, setAdminUsers } = useAppStore();
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [editingUser,   setEditingUser]   = useState(null);

  // ── Filter state (server-side) ───────────────────────────────
  const [searchTerm,    setSearchTerm]    = useState('');
  const [roleFilter,    setRoleFilter]    = useState('all');
  const [deptFilter,    setDeptFilter]    = useState('all');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [departments,   setDepartments]   = useState([]);

  // ── Pagination ───────────────────────────────────────────────
  const [total, setTotal] = useState(0);

  // ── UI state ─────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null);   // { message, type }

  const searchDebounce = useRef(null);

  // ── Toast helper ─────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch departments once for dropdown ──────────────────────
  useEffect(() => {
    fetchAdminDepartments()
      .then(data => setDepartments(Array.isArray(data) ? data : []))
      .catch(() => {}); // non-critical
  }, []);

  // ── Core fetch with current filters ─────────────────────────
  const loadUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers({
        search:     searchTerm,
        role:       roleFilter,
        department: deptFilter,
        status:     statusFilter,
        ...params,
      });

      const rawUsers = data?.users || data || [];
      setTotal(data?.total ?? rawUsers.length);

      if (Array.isArray(rawUsers)) {
        setAdminUsers(rawUsers.map(u => ({
          id:         u._id,
          name:       u.name,
          email:      u.email,
          rawRole:    u.role,
          role:       ROLE_LABEL[u.role] || u.role,
          department: u.department || '—',
          status:     u.status,
        })));
      }
    } catch (err) {
      console.warn('Failed to load users:', err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, deptFilter, statusFilter, setAdminUsers]);

  // ── Initial load ─────────────────────────────────────────────
  useEffect(() => { loadUsers(); }, []);

  // ── Re-fetch when dropdown filters change ────────────────────
  useEffect(() => {
    loadUsers();
  }, [roleFilter, deptFilter, statusFilter]);

  // ── Debounced search ─────────────────────────────────────────
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      loadUsers({ search: value });
    }, 350);
  };

  // ── Modal handlers ───────────────────────────────────────────
  const handleEdit = (user) => { setEditingUser(user); setIsModalOpen(true); };
  const handleAdd  = ()     => { setEditingUser(null);  setIsModalOpen(true); };

  const handleSaveUser = async (payload) => {
    try {
      if (editingUser) {
        await updateAdminUser(editingUser.id, payload);
        showToast(`${payload.name} updated successfully.`);
      } else {
        await createAdminUser(payload);
        showToast(`${payload.name} created successfully.`);
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      const msg = err?.message || 'Something went wrong.';
      showToast(msg.includes('already registered') ? 'Email is already in use.' : msg, 'error');
    }
  };

  // ── Derived stats ────────────────────────────────────────────
  const activeCount = adminUsers.filter(u => u.status === 'Active').length;

  const selectStyle = {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#132B44',
    fontSize: '0.8rem',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '500',
  };

  return (
    <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
      <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
        <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

        <main className="main-content" style={{ 
          backgroundColor: '#167f94', 
          padding: '2rem', 
          flex: 1, 
          minHeight: '100vh', 
          overflowY: 'auto' 
        }}>

          {/* Custom Header with gradient lines and icon */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            width: '100%'
          }}>
            {/* Left spacer for centering */}
            <div style={{ width: '180px' }}></div>

            {/* Centered title section */}
            <div style={{ 
              textAlign: 'center',
              flex: 1
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '4px',
                  height: '32px',
                  background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                  borderRadius: '2px'
                }} />
                <FontAwesomeIcon icon={faUsers} style={{ color: '#F97316', fontSize: '2rem' }} />
                <h1 style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: '700', 
                  color: 'white',
                                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  User Management
                </h1>
                <div style={{
                  width: '4px',
                  height: '32px',
                  background: 'linear-gradient(180deg, #2DD4BF, #F97316)',
                  borderRadius: '2px'
                }} />
              </div>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '1rem',
                margin: 0
              }}>
                Manage user accounts, roles, and security training progress
              </p>
            </div>

            {/* Right side - Last Updated */}
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              width: '180px',
              textAlign: 'right'
            }}>
              <div style={{ fontWeight: '600', color: 'white' }}>Last Updated</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Today, 3:42 PM</div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#132B44',
            borderRadius: '1rem', 
            padding: '1.5rem', 
            borderTop: '1px solid #F97316',
            borderBottom: '1px solid #F97316',
            borderLeft: '4px solid #F97316',
            borderRight: 'none',
            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
          }}>

            {/* ── Toolbar ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    style={{ 
                      position: 'absolute', 
                      left: '0.85rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.8rem'
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Search name or email…"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={{
                      width: '100%', 
                      paddingLeft: '2.25rem', 
                      paddingRight: '0.875rem',
                      paddingTop: '0.5rem', 
                      paddingBottom: '0.5rem',
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem', 
                      outline: 'none', 
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Role filter */}
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={selectStyle}>
                  <option value="all" style={{ backgroundColor: '#132B44' }}>All Roles</option>
                  <option value="user" style={{ backgroundColor: '#132B44' }}>User</option>
                  <option value="admin" style={{ backgroundColor: '#132B44' }}>Admin</option>
                  <option value="ai_maintainer" style={{ backgroundColor: '#132B44' }}>AI Maintainer</option>
                </select>

                {/* Department filter */}
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={selectStyle}>
                  <option value="all" style={{ backgroundColor: '#132B44' }}>All Departments</option>
                  {departments.map(d => <option key={d} value={d} style={{ backgroundColor: '#132B44' }}>{d}</option>)}
                </select>

                {/* Status filter */}
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                  <option value="all" style={{ backgroundColor: '#132B44' }}>All Status</option>
                  <option value="Active" style={{ backgroundColor: '#132B44' }}>Active</option>
                  <option value="Inactive" style={{ backgroundColor: '#132B44' }}>Inactive</option>
                </select>
              </div>

              {/* Add New User button */}
              <button
                onClick={handleAdd}
                style={{
                  padding: '0.55rem 1.1rem',
                  backgroundColor: '#F97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.8rem' }} />
                Add New User
              </button>
            </div>

            {/* ── Count row ── */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '1rem', 
              fontSize: '0.75rem', 
              color: 'rgba(255,255,255,0.8)' 
            }}>
              <span>
                {loading ? 'Loading…' : `Showing ${adminUsers.length} of ${total} results`}
              </span>
              <span>Active: <strong style={{ color: '#4ade80' }}>{activeCount}</strong></span>
            </div>

            {/* ── Table ── */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.75rem 0', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: '600' }}>Role</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: '600' }}>Department</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(user => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 0', fontWeight: '600', color: 'white', fontSize: '0.875rem' }}>
                        {user.name}
                      </td>
                      <td style={{ padding: '0.875rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '0.875rem 0' }}>
                        <RoleBadge rawRole={user.rawRole} />
                      </td>
                      <td style={{ padding: '0.875rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                        {user.department}
                      </td>
                      <td style={{ padding: '0.875rem 0' }}>
                        <StatusBadge status={user.status} />
                      </td>
                      <td style={{ padding: '0.875rem 0', textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                          style={{ 
                            border: 'none', 
                            background: 'rgba(249,115,22,0.15)', 
                            color: '#F97316', 
                            cursor: 'pointer', 
                            padding: '0.4rem', 
                            borderRadius: '0.4rem', 
                            display: 'inline-flex',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.15)';
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.9rem' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && adminUsers.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: '600', color: 'white' }}>No users match your filters.</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Try adjusting the search or filter options.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(1rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (min-width: 768px) { .hamburger { display: none !important; } }
      `}</style>
    </div>
  );
};

export default UserManagement;