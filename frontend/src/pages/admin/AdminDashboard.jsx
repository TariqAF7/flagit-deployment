import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProgressRing from '../../components/ProgressRing';
import { fetchAdminStats } from '../../api/admin';

const AdminDashboard = () => {
    const { adminStats, setAdminStats, logout } = useAppStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchAdminStats()
            .then(data => {
                // ── UI DIAGNOSTIC LOG (remove after verification) ──────────
                console.log('[DIAG] /api/admin/stats raw response:', JSON.stringify(data, null, 2));
                console.log('[DIAG] orgResilienceScore being set to:', data?.orgResilienceScore ?? 'MISSING — will default to 0');
                // ──────────────────────────────────────────────────────────
                setAdminStats(data);
            })
            .catch(err => console.warn('Failed to fetch admin stats:', err.message));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ── Dynamic Resilience Profile ────────────────────────────────────────
    const getResilienceProfile = (s) => {
        if (s <= 40) return {
            label: 'Critical',
            color: '#ef4444',
            ringColor: '#ef4444',
            title: 'High Vulnerability',
            message: 'Immediate training intervention required. Your organization is at high risk of a breach.',
        };
        if (s <= 70) return {
            label: 'Moderate Risk',
            color: '#f97316',
            ringColor: '#f97316',
            title: 'Moderate Risk',
            message: 'Awareness is improving, but reporting rates remain low. Targeted simulations recommended.',
        };
        if (s <= 90) return {
            label: 'Good',
            color: 'var(--primary-teal)',
            ringColor: '#0d9488',
            title: 'Strong Resilience',
            message: 'Most users are identifying threats. Focus on maintaining consistency across departments.',
        };
        return {
            label: 'Excellent',
            color: '#22c55e',
            ringColor: '#22c55e',
            title: 'Cyber-Resilient',
            message: 'Your organization shows elite-level detection and reporting habits.',
        };
    };

    const score = adminStats.orgResilienceScore ?? 0;
    const profile = getResilienceProfile(score);
    const CIRCUMFERENCE = 2 * Math.PI * 90; // ≈ 565.48
    const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100;

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

               <main className="main-content" style={{ 
    marginLeft: '280px',  // ← ADD THIS
    backgroundColor: '#167f94', 
    padding: '2rem', 
    flex: 1, 
    minHeight: '100vh', 
    overflowY: 'auto' 
}}>

                    {/* Header with centered title and right-aligned welcome card */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '2rem',
                        width: '100%'
                    }}>
                        {/* Left spacer for centering */}
                        <div style={{ width: '200px' }}></div>

                        {/* Centered title section - like Analytics */}
                        <div style={{ 
                            textAlign: 'center',
                            flex: 1
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    width: '4px',
                                    height: '32px',
                                    background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                                    borderRadius: '2px'
                                }} />
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                                    <path d="M8 10h8"></path>
                                    <path d="M8 14h4"></path>
                                </svg>
                                <h1 style={{ 
                                    fontSize: '2.2rem', 
                                    fontWeight: '700', 
                                    color: 'white',
                                    margin: 0,
                                    letterSpacing: '-0.02em'
                                }}>
                                    Admin Dashboard
                                </h1>
                                <div style={{
                                    width: '4px',
                                    height: '32px',
                                    background: 'linear-gradient(180deg, #2DD4BF, #F97316)',
                                    borderRadius: '2px'
                                }} />
                            </div>
                            <p style={{ 
                                color: 'rgba(255,255,255,0.7)', 
                                fontSize: '1rem',
                                margin: 0
                            }}>
                                Monitor your organization's security posture
                            </p>
                        </div>

                        {/* Right side - Welcome card - FIXED: now fits on one line */}
                        <div style={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '2rem',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            width: 'auto',
                            minWidth: '180px',
                            textAlign: 'right',
                            whiteSpace: 'nowrap'
                        }}>
                            <div style={{ fontWeight: '600', color: 'white', display: 'inline-block' }}>
                                Welcome back, <span style={{ fontWeight: '700' }}>Sarah!</span>
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Administrator</div>
                        </div>
                    </div>

                    {/* Hamburger button for mobile */}
                    <button 
                        className="hamburger" 
                        onClick={() => setSidebarOpen(true)} 
                        style={{ 
                            background: 'white', 
                            color: '#167f94', 
                            border: 'none', 
                            padding: '0.5rem', 
                            borderRadius: '0.5rem',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginBottom: '1rem'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    {/* Main Metrics Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1.2fr 1.8fr', 
                        gap: '1.5rem', 
                        marginBottom: '2.5rem' 
                    }}>

                        {/* Resilience Score Ring */}
                        <div style={{ 
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                            height: 'fit-content'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem', 
                                marginBottom: '2rem',
                                alignSelf: 'flex-start'
                            }}>
                                <div style={{
                                    width: '4px',
                                    height: '24px',
                                    background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                                    borderRadius: '2px'
                                }} />
                                <span style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase'
                                }}>
                                    Organizational Resilience
                                </span>
                            </div>

                            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                    <circle
                                        cx="100" cy="100" r="90" fill="none"
                                        stroke={profile.ringColor}
                                        strokeWidth="12"
                                        strokeDasharray={CIRCUMFERENCE}
                                        strokeDashoffset={strokeDashoffset}
                                        style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <div style={{ 
                                        fontSize: '3rem', 
                                        fontWeight: '700', 
                                        lineHeight: 1, 
                                        color: 'white'
                                    }}>{score}</div>
                                    <div style={{ 
                                        fontSize: '0.875rem', 
                                        color: 'rgba(255,255,255,0.5)' 
                                    }}>/ 100</div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <div style={{
                                    display: 'inline-block',
                                    backgroundColor: profile.color + '20',
                                    color: profile.color,
                                    borderRadius: '2rem',
                                    padding: '0.25rem 1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    marginBottom: '1rem',
                                }}>{profile.label}</div>
                                
                                <h2 style={{ 
                                    fontSize: '1.25rem', 
                                    fontWeight: '700', 
                                    color: 'white', 
                                    marginBottom: '0.75rem' 
                                }}>{profile.title}</h2>
                                
                                <p style={{ 
                                    fontSize: '0.85rem', 
                                    color: 'rgba(255,255,255,0.7)', 
                                    maxWidth: '280px', 
                                    margin: '0 auto 1.5rem auto', 
                                    lineHeight: '1.6' 
                                }}>{profile.message}</p>
                                
                                {/* Sub-metrics */}
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '2rem', 
                                    justifyContent: 'center', 
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ 
                                            fontSize: '1.3rem', 
                                            fontWeight: '700', 
                                            color: 'white' 
                                        }}>{adminStats.detectionRate ?? adminStats.avgDetectionRate ?? 0}%</div>
                                        <div style={{ 
                                            fontSize: '0.7rem', 
                                            color: 'rgba(255,255,255,0.5)',
                                            marginTop: '0.25rem' 
                                        }}>Detection Rate</div>
                                    </div>
                                    <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ 
                                            fontSize: '1.3rem', 
                                            fontWeight: '700', 
                                            color: 'white' 
                                        }}>{adminStats.reportingRate ?? 0}%</div>
                                        <div style={{ 
                                            fontSize: '0.7rem', 
                                            color: 'rgba(255,255,255,0.5)',
                                            marginTop: '0.25rem' 
                                        }}>Reporting Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid - 2x2 layout */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '1.5rem',
                            height: 'fit-content'
                        }}>
                            <div style={{ 
                                backgroundColor: '#132B44',
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                position: 'relative',
                                height: 'fit-content'
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Total Users</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{(adminStats.totalUsers ?? 0).toLocaleString()}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>All registered platform accounts</div>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '1.5rem', 
                                    right: '1.5rem', 
                                    width: '36px', 
                                    height: '36px', 
                                    backgroundColor: 'rgba(59, 130, 246, 0.15)', 
                                    color: '#3b82f6', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                            </div>

                            <div style={{ 
                                backgroundColor: '#132B44',
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                position: 'relative',
                                height: 'fit-content'
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Active Users</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{(adminStats.activeUsers ?? 0).toLocaleString()}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                    <span style={{ color: '#16a34a', fontWeight: '600' }}>
                                        {adminStats.totalUsers ? Math.round(((adminStats.activeUsers ?? 0) / adminStats.totalUsers) * 100) : 0}%
                                    </span> of total users
                                </div>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '1.5rem', 
                                    right: '1.5rem', 
                                    width: '36px', 
                                    height: '36px', 
                                    backgroundColor: 'rgba(22, 163, 74, 0.15)', 
                                    color: '#16a34a', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                            </div>

                            <div style={{ 
                                backgroundColor: '#132B44',
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                position: 'relative',
                                height: 'fit-content'
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Avg Detection Rate</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{adminStats.avgDetectionRate ?? 0}%</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Correct identifications / total simulations</div>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '1.5rem', 
                                    right: '1.5rem', 
                                    width: '36px', 
                                    height: '36px', 
                                    backgroundColor: 'rgba(249, 115, 22, 0.15)', 
                                    color: '#F97316', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                            </div>

                            <div style={{ 
                                backgroundColor: '#132B44',
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                position: 'relative',
                                height: 'fit-content'
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Incidents Reported</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{adminStats.incidentsReported ?? 0}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Times FlagIT button was pressed</div>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '1.5rem', 
                                    right: '1.5rem', 
                                    width: '36px', 
                                    height: '36px', 
                                    backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                                    color: '#ef4444', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ADMINISTRATIVE TOOLS SECTION - REDESIGNED */}
                    <div style={{ 
                        marginTop: '2rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                width: '4px',
                                height: '32px',
                                background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                                borderRadius: '2px'
                            }} />
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(249,115,22,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#F97316'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <h2 style={{ 
                                    fontSize: '1.3rem', 
                                    fontWeight: '600', 
                                    color: 'white',
                                    margin: 0,
                                    lineHeight: 1.2
                                }}>
                                    Administrative Tools
                                </h2>
                                <p style={{ 
                                    color: 'rgba(255,255,255,0.6)', 
                                    fontSize: '0.875rem',
                                    margin: '0.25rem 0 0 0'
                                }}>
                                    Manage your organization's security training
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Tools Cards */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '1.5rem',
                        marginBottom: '2.5rem'
                    }}>
                        <div 
                            onClick={() => navigate('/admin/users')} 
                            style={{ 
                                backgroundColor: '#132B44',
                                borderRadius: '1rem',
                                padding: '2rem 1.5rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(249,115,22,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0, 0, 0, 0.4)';
                            }}
                        >
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                backgroundColor: 'rgba(249,115,22,0.15)', 
                                color: '#F97316',
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                marginBottom: '1.5rem' 
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '600', 
                                color: 'white', 
                                marginBottom: '0.75rem' 
                            }}>User Management</h3>
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: 'rgba(255,255,255,0.6)', 
                                lineHeight: '1.5',
                                margin: 0,
                                flex: 1
                            }}>
                                Manage user accounts, permissions, and access levels across your organization
                            </p>
                        </div>

                        <div 
                            onClick={() => navigate('/admin/simulations')} 
                            style={{ 
                                backgroundColor: '#132B44',
                                borderRadius: '1rem',
                                padding: '2rem 1.5rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(249,115,22,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0, 0, 0, 0.4)';
                            }}
                        >
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                backgroundColor: 'rgba(249,115,22,0.15)', 
                                color: '#F97316',
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                marginBottom: '1.5rem' 
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                            </div>
                            <h3 style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '600', 
                                color: 'white', 
                                marginBottom: '0.75rem' 
                            }}>Training Simulations</h3>
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: 'rgba(255,255,255,0.6)', 
                                lineHeight: '1.5',
                                margin: 0,
                                flex: 1
                            }}>
                                Create and deploy phishing simulations and security awareness training
                            </p>
                        </div>

                        <div 
                            onClick={() => navigate('/admin/reports')} 
                            style={{ 
                                backgroundColor: '#132B44',
                                borderRadius: '1rem',
                                padding: '2rem 1.5rem',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(249,115,22,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0, 0, 0, 0.4)';
                            }}
                        >
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                backgroundColor: 'rgba(249,115,22,0.15)', 
                                color: '#F97316',
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                marginBottom: '1.5rem' 
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                                </svg>
                            </div>
                            <h3 style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '600', 
                                color: 'white', 
                                marginBottom: '0.75rem' 
                            }}>Analytics & Reporting</h3>
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: 'rgba(255,255,255,0.6)', 
                                lineHeight: '1.5',
                                margin: 0,
                                flex: 1
                            }}>
                                View detailed analytics, generate reports, and track security awareness progress
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem'
                    }}>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                padding: '0.75rem 2rem',
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid rgba(249,115,22,0.3)',
                                borderRadius: '2rem',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </button>
                    </div>
                </main>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .hamburger { display: none !important; }
                }
                @media (max-width: 767px) {
                    .hamburger { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;