import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';

const AdminSettings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ backgroundColor: '#f1f5f9', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    <AdminTopBar
                        title="Platform Settings"
                        subtitle="Configure global system options"
                        toggleSidebar={() => setSidebarOpen(true)}
                    />

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '3rem 2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1.5rem auto', opacity: 0.5 }}>
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '0.5rem' }}>Settings (Coming Soon)</h2>
                        <p style={{ maxWidth: '400px', margin: '0 auto' }}>Advanced system configuration options are currently in development. They will be available in the next platform update.</p>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminSettings;
