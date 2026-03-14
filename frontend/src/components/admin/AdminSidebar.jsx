import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const AdminSidebar = ({ isOpen, close }) => {
    const { logout, user } = useAppStore();
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            close();
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', exact: true, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
        { name: 'User Management', path: '/admin/users', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
        { name: 'Training Campaigns', path: '/admin/campaigns', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
        { name: 'Analytics & Reports', path: '/admin/reports', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
        { name: 'Settings', path: '/admin/settings', icon: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    ];

    const isActiveCheck = (itemPath, exact) => {
        if (exact) return location.pathname === itemPath;
        return location.pathname.startsWith(itemPath);
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ backgroundColor: 'var(--primary-teal)' }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '0.25rem' }}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="var(--deep-navy)" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <circle cx="12" cy="10" r="3" fill="var(--primary-teal)" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: '1', color: 'white' }}>FlagIt</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Admin Sidebar</div>
                    </div>
                </div>

                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 'bold', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            SM
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'white' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{user.roleLabel}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.1rem' }}>Last login: 6:46:01 PM</div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1 }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`sidebar-link ${isActiveCheck(item.path, item.exact) ? 'active' : ''}`}
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
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '1.25rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <div className="flex items-center gap-2 text-sm text-white mb-3" style={{ fontWeight: 'bold', color: 'var(--accent-orange)', fontSize: '0.875rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <span>System Status</span>
                        </div>
                        <div className="flex justify-between text-xs text-white mb-2" style={{ opacity: 0.8 }}>
                            <span>Platform Health</span>
                            <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
                                Operational
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-white" style={{ opacity: 0.8 }}>
                            <span>Email Processing</span>
                            <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
                                Active
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => { logout(); handleLinkClick(); }}
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
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

export default AdminSidebar;
