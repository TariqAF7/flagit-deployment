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

// ── Role display helpers ─────────────────────────────────────────────────────
const ROLE_LABEL = {
  user:          'User',
  admin:         'Admin',
  ai_maintainer: 'AI Maintainer',
};

const ROLE_BADGE_STYLE = {
  user: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
  },
  admin: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  ai_maintainer: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
  },
};

const STATUS_BADGE_STYLE = {
  Active: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    dot: '#16a34a',
  },
  Inactive: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
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
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', ...s, padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: '600' }}>
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
          rawRole:    u.role,                         // backend enum: 'user'|'admin'|'ai_maintainer'
          role:       ROLE_LABEL[u.role] || u.role,   // display label
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
  useEffect(() => { loadUsers(); }, []);  // eslint-disable-line

  // ── Re-fetch when dropdown filters change ────────────────────
  useEffect(() => {
    loadUsers();
  }, [roleFilter, deptFilter, statusFilter]); // eslint-disable-line

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
      loadUsers();   // refresh table
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
    backgroundColor: '#e2e8f0',
    fontSize: '0.8rem',
    color: 'var(--deep-navy)',
    cursor: 'pointer',
    fontWeight: '500',
  };

  return (
    <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
      <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
        <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

        <main className="main-content" style={{ backgroundColor: '#f1f5f9', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

          <AdminTopBar
            title="User Management"
            subtitle="Manage user accounts, roles, and security training progress"
            toggleSidebar={() => setSidebarOpen(true)}
          />

          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>

            {/* ── Toolbar ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search name or email…"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={{
                      width: '100%', paddingLeft: '2.25rem', paddingRight: '0.875rem',
                      paddingTop: '0.5rem', paddingBottom: '0.5rem',
                      border: '1.5px solid #e2e8f0', borderRadius: '0.5rem',
                      fontSize: '0.8rem', outline: 'none', backgroundColor: '#f8fafc',
                      color: 'var(--deep-navy)', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Role filter */}
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={selectStyle}>
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="ai_maintainer">AI Maintainer</option>
                </select>

                {/* Department filter */}
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={selectStyle}>
                  <option value="all">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                {/* Status filter */}
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Add New User button */}
              <button
                onClick={handleAdd}
                style={{
                  padding: '0.55rem 1.1rem',
                  backgroundColor: 'var(--primary-teal)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add New User
              </button>
            </div>

            {/* ── Count row ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>
                {loading ? 'Loading…' : `Showing ${adminUsers.length} of ${total} results`}
              </span>
              <span>Active: <strong style={{ color: '#16a34a' }}>{activeCount}</strong></span>
            </div>

            {/* ── Table ── */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 0', fontWeight: '600', color: 'var(--deep-navy)', fontSize: '0.875rem' }}>
                        {user.name}
                      </td>
                      <td style={{ padding: '0.875rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '0.875rem 0' }}>
                        <RoleBadge rawRole={user.rawRole} />
                      </td>
                      <td style={{ padding: '0.875rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {user.department}
                      </td>
                      <td style={{ padding: '0.875rem 0' }}>
                        <StatusBadge status={user.status} />
                      </td>
                      <td style={{ padding: '0.875rem 0', textAlign: 'right' }}>
                        <button
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                          style={{ border: 'none', background: '#f1f5f9', color: 'var(--deep-navy)', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.4rem', display: 'inline-flex' }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && adminUsers.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem', opacity: 0.4 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <p style={{ margin: 0, fontWeight: '600' }}>No users match your filters.</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Try adjusting the search or filter options.</p>
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
