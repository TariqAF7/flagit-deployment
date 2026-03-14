import React from 'react';

const MaintainerTopBar = ({ title, activeCount, activeLabel, lastUpdatedText, toggleSidebar }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
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
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--deep-navy)' }}>{title}</h1>
                    <div style={{ display: 'inline-flex', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.2rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {activeCount} {activeLabel}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Last Updated</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)' }}>{lastUpdatedText}</div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
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

export default MaintainerTopBar;
