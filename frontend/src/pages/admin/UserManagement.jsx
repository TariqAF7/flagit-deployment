import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import UserModal from '../../components/admin/UserModal';
import { fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../api/admin';

const UserManagement = () => {
    const { adminUsers, setAdminUsers } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Load users from API on mount
    useEffect(() => {
        fetchAdminUsers()
            .then(data => {
                const users = data.users || data;
                if (Array.isArray(users)) {
                    setAdminUsers(users.map(u => ({
                        id: u._id,
                        name: u.name,
                        email: u.email,
                        role: u.role === 'ai_maintainer' ? 'AI Maintainer' : u.role.charAt(0).toUpperCase() + u.role.slice(1),
                        department: u.department,
                        status: u.status,
                    })));
                }
            })
            .catch(err => console.warn('Failed to load users:', err.message));
    }, []);

    // Derived simple stats
    const totalUsers = adminUsers.length;
    const activeUsers = adminUsers.filter(u => u.status === 'Active').length;

    const filteredUsers = adminUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (editingUser) {
                const updated = await updateAdminUser(editingUser.id, userData);
                const u = updated.user || updated;
                setAdminUsers(adminUsers.map(x => x.id === editingUser.id ? { ...x, ...userData } : x));
            } else {
                const created = await createAdminUser({ ...userData, password: 'FlagIt123' });
                const u = created.user || created;
                setAdminUsers([...adminUsers, { id: u._id, ...userData }]);
            }
        } catch (err) {
            console.warn('Save user API failed, using local fallback:', err.message);
            if (editingUser) {
                setAdminUsers(adminUsers.map(x => x.id === editingUser.id ? { ...userData, id: editingUser.id } : x));
            } else {
                setAdminUsers([...adminUsers, { ...userData, id: Date.now() }]);
            }
        }
        setIsModalOpen(false);
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Search users by name or email..."
                                        style={{ paddingLeft: '2.5rem', backgroundColor: '#f8fafc', border: 'none', borderRadius: '0.5rem' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select className="form-input" style={{ width: 'auto', backgroundColor: '#e2e8f0', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}><option>All Roles</option></select>
                                <select className="form-input" style={{ width: 'auto', backgroundColor: '#e2e8f0', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}><option>All Departments</option></select>
                                <select className="form-input" style={{ width: 'auto', backgroundColor: '#e2e8f0', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}><option>All Status</option></select>
                            </div>
                            <button className="btn btn-teal" onClick={handleAdd} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add New User
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <div>Showing {filteredUsers.length} of {totalUsers} users</div>
                            <div>Total Active: {activeUsers}</div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: 'var(--deep-navy)' }}>
                                        <th style={{ padding: '1rem 0', fontWeight: 'bold' }}>Name</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 'bold' }}>Email</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 'bold' }}>Role</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem 0', fontWeight: 'bold', color: 'var(--deep-navy)' }}>{user.name}</td>
                                            <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{user.email}</td>
                                            <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{user.role}</td>
                                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                                <button onClick={() => handleEdit(user)} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
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
        </div>
    );
};

export default UserManagement;
