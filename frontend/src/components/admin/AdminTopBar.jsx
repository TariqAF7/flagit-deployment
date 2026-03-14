import React from 'react';

const AdminTopBar = ({ title, subtitle, toggleSidebar }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    className="hamburger"
                    onClick={toggleSidebar}
                    style={{ background: 'var(--deep-navy)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '0.5rem', borderRadius: '0.25rem' }}
                    aria-label="Toggle menu"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--deep-navy)' }}>{title}</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>{subtitle}</p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '2rem', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', backgroundColor: 'white' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                    Live Monitoring
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Last Updated</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)' }}>6:29:56 PM</div>
                </div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .hamburger {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminTopBar;
