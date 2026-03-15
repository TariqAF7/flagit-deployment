import React, { useState, useEffect } from 'react';

const DEPARTMENTS = ['Engineering', 'Finance', 'HR', 'IT', 'Marketing', 'Operations', 'Sales'];

const ROLE_OPTIONS = [
  { label: 'User',          value: 'user' },
  { label: 'Admin',         value: 'admin' },
  { label: 'AI Maintainer', value: 'ai_maintainer' },
];

const DEFAULT_FORM = {
  name:       '',
  email:      '',
  password:   '',
  role:       'user',
  department: 'IT',
  status:     'Active',
};

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    if (user) {
      // Editing: map display role back to backend enum if needed
      setFormData({
        name:       user.name       || '',
        email:      user.email      || '',
        password:   '',             // never pre-fill password
        role:       user.rawRole    || user.role || 'user',
        department: user.department || 'IT',
        status:     user.status     || 'Active',
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name  = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    if (!user && !formData.password.trim()) e.password = 'Password is required for new users';
    if (!user && formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...formData };
      // For edits, omit password if left blank
      if (user && !payload.password) delete payload.password;
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.6rem 0.875rem',
    border: `1.5px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: 'var(--deep-navy)',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--deep-navy)',
    marginBottom: '0.35rem',
    letterSpacing: '0.02em',
  };

  const errStyle = { color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.2rem', color: 'var(--deep-navy)' }}>
              {user ? 'Edit User' : 'Add New User'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {user ? 'Update account details below.' : 'Fill in the fields to create a new account.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: '#f1f5f9', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={formData.name} onChange={set('name')} style={inputStyle('name')} placeholder="e.g. Jane Doe" />
            {errors.name && <p style={errStyle}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" value={formData.email} onChange={set('email')} style={inputStyle('email')} placeholder="user@company.com" />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>

          {/* Password (always shown for Add, optional for Edit) */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>
              Password {user && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={set('password')}
              style={inputStyle('password')}
              placeholder={user ? '••••••••' : 'Min. 6 characters'}
              autoComplete="new-password"
            />
            {errors.password && <p style={errStyle}>{errors.password}</p>}
          </div>

          {/* Role + Department row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={formData.role} onChange={set('role')} style={inputStyle('role')}>
                {ROLE_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <select value={formData.department} onChange={set('department')} style={inputStyle('department')}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={labelStyle}>Account Status</label>
            <select value={formData.status} onChange={set('status')} style={inputStyle('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.25rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', color: 'var(--deep-navy)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', background: saving ? '#94a3b8' : 'var(--primary-teal)', color: 'white', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {saving ? 'Saving…' : user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
