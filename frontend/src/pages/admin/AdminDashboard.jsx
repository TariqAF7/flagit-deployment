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
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ backgroundColor: 'var(--primary-teal)', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    {/* Header specific to Admin Dashboard root */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button className="hamburger" onClick={() => setSidebarOpen(true)} style={{ background: 'white', color: 'var(--primary-teal)', border: 'none', padding: '0.5rem', borderRadius: '0.25rem' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '0.25rem', display: 'inline-flex' }}>
                                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="var(--deep-navy)" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="10" r="3" fill="var(--primary-teal)" /></svg>
                                    </div>
                                    FlagIt Admin
                                </h1>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>Phishing Detection Platform</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold' }}>Welcome back, Sarah!</div>
                            <div style={{ opacity: 0.8, fontSize: '0.75rem' }}>Monitor your organization's security posture</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', marginBottom: '2.5rem' }}>

                        {/* Resilience Score Ring */}
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="100" cy="100" r="90" fill="none" stroke="#f1f5f9" strokeWidth="12" />
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
                                <div style={{ position: 'absolute', textAlign: 'center', color: 'var(--deep-navy)' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, color: profile.ringColor, transition: 'color 0.5s ease' }}>{score}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ 100</div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <div style={{
                                    display: 'inline-block',
                                    backgroundColor: profile.color + '20',
                                    color: profile.color,
                                    borderRadius: '2rem',
                                    padding: '0.2rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.06em',
                                    marginBottom: '0.75rem',
                                    textTransform: 'uppercase',
                                }}>{profile.label}</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>ORGANIZATIONAL RESILIENCE SCORE</div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '0.5rem' }}>{profile.title}</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '250px', margin: '0 auto', lineHeight: '1.5' }}>{profile.message}</p>
                                {/* Sub-metrics */}
                                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--deep-navy)' }}>{adminStats.detectionRate ?? adminStats.avgDetectionRate ?? 0}%</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Detection Rate</div>
                                    </div>
                                    <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--deep-navy)' }}>{adminStats.reportingRate ?? 0}%</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Reporting Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4 Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignContent: 'start' }}>
                            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '1rem' }}>Total Users</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>{adminStats.totalUsers.toLocaleString()}</div>
                                <div style={{ fontSize: '0.75rem', color: '#16a34a' }}><span style={{ fontWeight: 'bold' }}>+12.5%</span> from last month</div>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '32px', height: '32px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '1rem' }}>Active Users</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>{adminStats.activeUsers.toLocaleString()}</div>
                                <div style={{ fontSize: '0.75rem', color: '#16a34a' }}><span style={{ fontWeight: 'bold' }}>87.3%</span> engagement rate</div>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '32px', height: '32px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '1rem' }}>Avg Detection Rate</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>{adminStats.avgDetectionRate}%</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)' }}><span style={{ fontWeight: 'bold' }}>+5.2%</span> improvement</div>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '32px', height: '32px', backgroundColor: '#fef3c7', color: 'var(--accent-orange)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '1rem' }}>Incidents Reported</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>{adminStats.incidentsReported}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phishing Incidents Reported</div>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '32px', height: '32px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                            </div>

                            <button onClick={handleLogout} style={{ gridColumn: '1 / -1', padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '150px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    <div style={{ color: 'white', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.25rem 0' }}>Administrative Tools</h2>
                        <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Manage your organization's security training</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>

                        <div onClick={() => navigate('/admin/users')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '2rem', borderRadius: '1rem', color: 'white', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>User Management</h3>
                            <p style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.5 }}>Manage user accounts, permissions, and access levels across your organization</p>
                        </div>

                        <div onClick={() => navigate('/admin/campaigns')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '2rem', borderRadius: '1rem', color: 'white', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Training Campaigns</h3>
                            <p style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.5 }}>Create and deploy phishing simulation campaigns and security awareness training</p>
                        </div>

                        <div onClick={() => navigate('/admin/reports')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '2rem', borderRadius: '1rem', color: 'white', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Analytics & Reporting</h3>
                            <p style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.5 }}>View detailed analytics, generate reports, and track security awareness progress</p>
                        </div>

                    </div>
                </main>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .hamburger { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
