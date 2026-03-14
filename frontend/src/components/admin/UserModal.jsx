import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'End User',
        department: 'IT',
        status: 'Active'
    });

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
        } else {
            setFormData({ name: '', email: '', role: 'End User', department: 'IT', status: 'Active' });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" style={{ zIndex: 100 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--deep-navy)' }}>
                        {user ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button type="button" onClick={onClose} style={{ padding: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Role</label>
                            <select className="form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <option>End User</option>
                                <option>Admin</option>
                                <option>AI Maintainer</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Department</label>
                            <select className="form-input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                <option>IT</option>
                                <option>HR</option>
                                <option>Finance</option>
                                <option>Operations</option>
                                <option>Engineering</option>
                                <option>Sales</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Account Status</label>
                        <select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-white" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-teal">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
