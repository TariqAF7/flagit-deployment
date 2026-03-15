import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved,
  faUsers,
  faBullhorn,
  faChartLine,
  faCog,
  faSignOutAlt,
  faCircle,
  faTachometerAlt,
  faHeartbeat
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ isOpen, close }) => {
    const { logout, user } = useAppStore();
    const location = useLocation();

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            close();
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', exact: true, icon: faTachometerAlt },
        { name: 'User Management', path: '/admin/users', icon: faUsers },
        { name: 'Training Campaigns', path: '/admin/campaigns', icon: faBullhorn },
        { name: 'Analytics & Reports', path: '/admin/reports', icon: faChartLine },
        { name: 'Settings', path: '/admin/settings', icon: faCog },
    ];

    const isActiveCheck = (itemPath, exact) => {
        if (exact) return location.pathname === itemPath;
        return location.pathname.startsWith(itemPath);
    };

    return (
        <>
            <div
                className={`sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    backgroundColor: '#132B44',
                    width: '280px',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 30
                }}
            >

                {/* Logo */}
                <div style={{ padding: '2rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            backgroundColor: 'white',
                            border: '2px solid #F97316',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(249,115,22,0.2)',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/icons/flagit-logo.png"
                                alt="FlagIt"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    objectFit: 'contain',
                                    transform: 'translate(0, 5.5px)'
                                }}
                            />
                        </div>

                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.3rem', color: 'white' }}>FlagIt</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                                Admin Portal
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile */}
                <div style={{ padding: '1.5rem' }}>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{
                            backgroundColor: '#F97316',
                            color: 'white',
                            fontWeight: 700,
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {user?.name?.charAt(0) || 'A'}
                        </div>

                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>
                                {user?.name || 'Admin User'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                                {user?.roleLabel || 'Administrator'}
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
                                Last login: 6:46 PM
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0 1.5rem', overflowY: 'auto' }}>
                    {menuItems.map(item => {
                        const isActive = isActiveCheck(item.path, item.exact);

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={handleLinkClick}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.85rem 1rem',
                                    marginBottom: '0.5rem',
                                    borderRadius: '0.75rem',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                    backgroundColor: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
                                    borderLeft: isActive ? '3px solid #F97316' : '3px solid transparent'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    style={{
                                        fontSize: '1.1rem',
                                        color: isActive ? '#F97316' : 'rgba(255,255,255,0.4)'
                                    }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {/* System Status - with heartbeat icon */}
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ color: '#F97316', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FontAwesomeIcon icon={faHeartbeat} />
                            <span>System Status</span>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.5rem' }} />
                            <span>Operational</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => { logout(); handleLinkClick(); }}
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid rgba(249,115,22,0.3)',
                            borderRadius: '0.75rem',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(249,115,22,0.1)';
                            e.target.style.borderColor = '#F97316';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.borderColor = 'rgba(249,115,22,0.3)';
                        }}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Logout
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    onClick={close}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 20,
                        display: window.innerWidth < 768 ? 'block' : 'none'
                    }}
                />
            )}
        </>
    );
};

export default AdminSidebar;