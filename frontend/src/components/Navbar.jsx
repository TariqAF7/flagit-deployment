import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const Navbar = ({ toggleSidebar }) => {
    const { user, isLoggedIn, logout } = useAppStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
        navigate('/login');
    };

    const menuItems = [

        { name: 'Help & Support', path: '/help-support', icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M12 16v.01 M12 13a2 2 0 0 0 2-2c0-1-1-2-2-2-1 0-2 1-2 2' },
        { name: 'Logout', action: handleLogout, icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <button
                    className="hamburger"
                    onClick={toggleSidebar}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                    aria-label="Toggle menu"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #F97316', 
                        borderRadius: '50%', 
                        width: '48px', 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
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
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.125rem', lineHeight: '1' }}>FlagIt</div>
                        <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Security Training</div>
                    </div>
                </div>
            </div>
            {isLoggedIn && (
                <div className="navbar-links">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                    <NavLink to="/simulations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Simulations</NavLink>
                    <NavLink to={useAppStore().getLastResult() ? (useAppStore().getLastResult().isCorrect ? '/results/success' : '/results/recap') : '/results/success'} className={({ isActive }) => `nav-link ${isActive || window.location.pathname.startsWith('/results') ? 'active' : ''}`}>Results</NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Analytics</NavLink>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }} ref={profileMenuRef}>
                {isLoggedIn ? (
                    <>
                        <div className="user-pill flex items-center gap-2">
                            <span style={{ fontSize: '0.875rem' }}>Welcome back, <span style={{ fontWeight: 'bold' }}>{user?.name?.split(' ')[0] || 'User'}!</span></span>
                            <div 
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    backgroundColor: '#F97316', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fb923c';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F97316';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>

                        {/* Profile Dropdown Menu */}
                        {profileMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '60px',
                                right: '0',
                                width: '240px',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                zIndex: 1000,
                                overflow: 'hidden'
                            }}>
                                {/* User info header */}
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#0f2a44',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user?.name || 'User'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email || 'user@example.com'}</div>
                                </div>

                                {/* Menu items */}
                                {menuItems.map((item, index) => (
                                    item.divider ? (
                                        <div key={index} style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.5rem 0' }} />
                                    ) : (
                                        <div
                                            key={item.name}
                                            onClick={() => {
                                                if (item.action) {
                                                    item.action();
                                                } else {
                                                    navigate(item.path);
                                                    setProfileMenuOpen(false);
                                                }
                                            }}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                                color: item.name === 'Logout' ? '#dc2626' : '#1e293b'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                {item.icon.split(' M').map((d, i) => <path key={i} d={i === 0 ? d : `M${d}`} />)}
                                            </svg>
                                            <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;