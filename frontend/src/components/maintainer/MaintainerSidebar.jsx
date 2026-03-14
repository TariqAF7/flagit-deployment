import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const MaintainerSidebar = ({ isOpen, close, currentStatusLabel }) => {
    const { logout } = useAppStore();
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            close();
        }
    };

    const menuItems = [
        { name: 'AI Model Management', path: '/maintainer/models', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5' },
        { name: 'Dataset Management', path: '/maintainer/datasets', icon: 'M4 6h16M4 12h16M4 18h16' },
        { name: 'Sample Generator', path: '/maintainer/generator', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    ];

    const isActiveCheck = (itemPath) => location.pathname.startsWith(itemPath);

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ backgroundColor: 'var(--primary-teal)' }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '0.25rem' }}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="var(--deep-navy)" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <circle cx="12" cy="10" r="3" fill="var(--primary-teal)" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: '1', color: 'white' }}>FlagIt AI</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Model Management</div>
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1 }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`sidebar-link ${isActiveCheck(item.path) ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {item.icon.split(' M').map((d, i) => <path key={i} d={i === 0 ? d : `M${d}`} />)}
                            </svg>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        type="button"
                        onClick={() => { logout(); handleLinkClick(); }}
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <div className="flex items-center gap-2 text-sm text-white mb-2" style={{ fontWeight: 'bold', color: 'var(--accent-orange)', fontSize: '0.875rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <span>System Status</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                            {currentStatusLabel}
                        </div>
                        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '85%', height: '100%', backgroundColor: '#4ade80' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="modal-overlay"
                    style={{ zIndex: 30 }}
                    onClick={close}
                    aria-hidden="true"
                ></div>
            )}
        </>
    );
};

export default MaintainerSidebar;
