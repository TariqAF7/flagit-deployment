import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import SvgLineChart from '../../components/admin/SvgLineChart';
import { fetchReportTrends } from '../../api/admin';

const AnalyticsReports = () => {
    const { reportTrends, setReportTrends } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Trends');
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchReportTrends()
            .then(data => { if (Array.isArray(data)) setReportTrends(data); })
            .catch(err => console.warn('Failed to fetch report trends:', err.message));
    }, []);

    const handleExport = () => {
        setToastMessage('Export started. Check your downloads.');
        setTimeout(() => setToastMessage(''), 3000);
    };

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ backgroundColor: '#f1f5f9', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    <AdminTopBar
                        title="Phishing Awareness Analytics"
                        subtitle="Comprehensive security training insights and threat detection metrics"
                        toggleSidebar={() => setSidebarOpen(true)}
                    />

                    {toastMessage && (
                        <div style={{ position: 'fixed', top: '1rem', right: '1rem', backgroundColor: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '0.5rem', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {toastMessage}
                        </div>
                    )}

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0', color: 'var(--deep-navy)' }}>Report Filters</h2>
                            <button className="btn btn-primary" onClick={handleExport} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#3b82f6', borderRadius: '0.5rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Export Report
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            <select className="form-input" style={{ width: '100%', backgroundColor: '#f1f5f9', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: 'var(--deep-navy)' }}><option>Last 30 Days</option></select>
                            <select className="form-input" style={{ width: '100%', backgroundColor: '#f1f5f9', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: 'var(--deep-navy)' }}><option>All Departments</option></select>
                            <select className="form-input" style={{ width: '100%', backgroundColor: '#f1f5f9', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: 'var(--deep-navy)' }}><option>All Types</option></select>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                            {['Trends', 'User Heatmap', 'Training Effectiveness'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        border: 'none', background: tab === activeTab ? '#3b82f6' : 'transparent', color: tab === activeTab ? 'white' : 'var(--text-muted)',
                                        padding: '0.5rem 1.5rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background-color 0.2s',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'Trends' && (
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--deep-navy)' }}>Phishing Incidents Over Time</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', position: 'relative' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Total Incidents</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>230</div>
                                        <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>+8.2% from last period</div>
                                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '4px', padding: '0.25rem' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                        </div>
                                    </div>

                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', position: 'relative' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Detected</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>193</div>
                                        <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>80.4% detection rate</div>
                                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#fef3c7', color: '#f59e0b', borderRadius: '4px', padding: '0.25rem' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    </div>

                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', position: 'relative' }}>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Reported</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.5rem' }}>171</div>
                                        <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>88.6% reporting rate</div>
                                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', backgroundColor: '#dcfce7', color: '#22c55e', borderRadius: '4px', padding: '0.25rem' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '2rem' }}>
                                    <SvgLineChart data={reportTrends} />
                                </div>
                            </div>
                        )}

                        {activeTab !== 'Trends' && (
                            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }}>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--deep-navy)' }}>{activeTab} Data Details</h3>
                                <p>Further data points for this view are being collected.</p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AnalyticsReports;
