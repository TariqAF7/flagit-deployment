import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const Navbar = ({ toggleSidebar }) => {
    const { user, isLoggedIn, logout } = useAppStore();
    const [menuOpen, setMenuOpen] = useState(false);

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

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isLoggedIn ? (
                    <div className="user-pill flex items-center gap-2">
                        <span style={{ fontSize: '0.875rem' }}>Welcome back, <span style={{ fontWeight: 'bold' }}>{user.name.split(' ')[0]}!</span></span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user.name.charAt(0)}
                        </div>
                        <button onClick={logout} className="btn btn-white" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', marginLeft: '0.5rem', display: 'none' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;