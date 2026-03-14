import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

const MaintainerDashboard = () => {
    const { logout } = useAppStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '1rem' }}>AI Maintainer Hub</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>This portal is under construction for model fine-tuning and system maintenance.</p>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default MaintainerDashboard;
