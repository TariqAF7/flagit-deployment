import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ProgressRing from '../components/ProgressRing';
import LineChart from '../components/LineChart';
import RadarChart from '../components/RadarChart';
import { useAppStore } from '../store/useAppStore';

const Analytics = () => {
    const { resilienceScore } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#fcfcfc' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    <div className="flex justify-between items-start mb-8 flex-wrap" style={{ gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '0.25rem' }}>Analytics Dashboard</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Track your phishing awareness progress and identify areas for improvement</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <select className="form-input" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem' }}>
                                <option>Last 7 Weeks</option>
                                <option>Last Month</option>
                            </select>
                            <div className="text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                                <div>Last Updated</div>
                                <div style={{ fontWeight: 'bold' }}>Today, 3:42 PM</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                        {/* Card 1: Overall Resilience Score */}
                        <div className="card text-center flex-col items-center" style={{ backgroundColor: 'white', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Overall Resilience Score</h2>
                            <ProgressRing
    radius={80}
    stroke={10}
    progress={resilienceScore}
    label="Resilience"
    textColor="var(--deep-navy)"  // or "#132B44" or any dark color
/>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.125rem' }}>+12%</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>vs Last Month</div>
                                </div>
                                <div style={{ width: '1px', backgroundColor: '#e5e7eb' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: 'var(--primary-teal)', fontWeight: 'bold', fontSize: '1.125rem' }}>Top 25%</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Team Ranking</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Progress Over Time */}
                        <div className="card" style={{ backgroundColor: 'white', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Progress Over Time</h2>
                            <LineChart />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    Steady improvement over the past 7 weeks
                                </div>
                                <div style={{ color: 'var(--primary-teal)', fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 18 6 11 6"></polyline><line x1="6" y1="18" x2="18" y2="6"></line></svg>
                                    +33 points
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                        {/* Card 3: Vulnerability Assessment */}
                        <div className="card flex-col items-center" style={{ backgroundColor: 'white', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Vulnerability Assessment</h2>
                            <div style={{ padding: '2rem 1rem' }}>
                                <RadarChart />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.5rem', lineHeight: 1 }}>65%</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Urgency Susceptible</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.5rem', lineHeight: 1 }}>82%</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>URL Detection</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Completed Training Modules */}
                        <div className="card" style={{ backgroundColor: 'white', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Completed Training Modules</h2>

                            <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.5rem', padding: '1.25rem', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ color: '#d97706', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <div>
                                    <div style={{ color: '#92400e', fontWeight: 'bold', fontSize: '0.875rem' }}>Recommended: Complete "Urgency Tactics" module</div>
                                    <div style={{ color: '#b45309', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: '1.4' }}>This will help improve your resistance to time-pressure attacks</div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1.25rem', display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                <div style={{ color: 'white', backgroundColor: '#16a34a', borderRadius: '4px', padding: '0.25rem', flexShrink: 0, display: 'flex' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.875rem' }}>Above Team Average!</div>
                                    <div style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: '1.4' }}>You're performing 10 points above your team's average score</div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ color: 'white', backgroundColor: '#16a34a', borderRadius: '4px', padding: '0.25rem', flexShrink: 0, display: 'flex' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.875rem' }}>Above Team Average!</div>
                                    <div style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: '1.4' }}>Consistent performance in Deceptive Link Detection</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Analytics;
