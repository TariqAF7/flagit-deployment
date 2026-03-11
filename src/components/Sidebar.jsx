import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const Sidebar = ({ isOpen, close }) => {
    const { logout, stats, getLastResult } = useAppStore();
    const location = useLocation();

    const lastResult = getLastResult();
    const resultsPath = lastResult ? (lastResult.isCorrect ? '/results/success' : '/results/recap') : '/results/success';

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            close();
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
        { name: 'Simulations', path: '/simulations', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01' },
        { name: 'Results', path: resultsPath, base: '/results', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
        { name: 'Analytics', path: '/analytics', base: '/analytics', icon: 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z' },
    ];

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`} style={{ backgroundColor: 'var(--primary-teal)' }}>
                
                <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 1rem' }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #F97316', 
                        borderRadius: '50%', 
                        width: '48px', 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: '12px'
                    }}>
                        <img 
                            src="/icons/flagit-logo.png" 
                            alt="FlagIt" 
                            style={{ 
                                width: '42px', 
                                height: '42px',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                transform: 'translate(0px, 5.5px)',
                                display: 'block'
                            }} 
                        />
                    </div>
                    <div className="sidebar-brand-text">
                        <div className="brand-title" style={{ fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1.2' }}>FlagIt</div>
                        <div className="brand-subtitle" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Security Training</div>
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1 }}>
                    {menuItems.map((item) => (
                        item.disabled ? (
                            <div key={item.name} className="sidebar-link" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {item.icon.split(' M').map((d, i) => <path key={i} d={i === 0 ? d : `M${d}`} />)}
                                </svg>
                                {item.name}
                            </div>
                        ) : (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={`sidebar-link ${(location.pathname === item.path || (item.base && location.pathname.startsWith(item.base))) ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {item.icon.split(' M').map((d, i) => <path key={i} d={i === 0 ? d : `M${d}`} />)}
                                </svg>
                                <span className="sidebar-text">{item.name}</span>
                            </NavLink>
                        )
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        type="button"
                        onClick={() => { logout(); handleLinkClick(); }}
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '1.5rem', backgroundColor: '#3b82f6', color: 'white' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <div className="flex items-center gap-2 text-sm text-white mb-2" style={{ fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                            <span>Training Progress</span>
                        </div>
                        <div className="flex justify-between text-xs text-white mb-1" style={{ opacity: 0.8 }}>
                            <span>Email Security:</span>
                            <span>78%</span>
                        </div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && window.innerWidth < 768 && (
                <div
                    className="modal-overlay"
                    style={{ zIndex: 30 }}
                    onClick={close}
                ></div>
            )}
        </>
    );
};

export default Sidebar;