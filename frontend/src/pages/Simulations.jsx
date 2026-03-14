import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import SimulationCard from '../components/SimulationCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Simulations = () => {
    const { simulations } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'white' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ backgroundColor: '#fcfcfc', flex: 1 }}>
                    
                    {/* Completed Training Modules Card - Moved from Analytics */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            marginBottom: '1.5rem',
                            color: 'var(--deep-navy)'
                        }}>
                            Completed Training Modules
                        </h2>

                        {/* Warning Card */}
                        <div style={{
                            backgroundColor: '#fef3c7',
                            border: '1px solid #fde68a',
                            borderRadius: '0.5rem',
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ color: '#d97706', flexShrink: 0 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <div style={{ color: '#92400e', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                    Recommended: Complete "Urgency Tactics" module
                                </div>
                                <div style={{ color: '#b45309', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
                                    This will help improve your resistance to time-pressure attacks
                                </div>
                            </div>
                        </div>

                        {/* Success Card 1 */}
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '0.5rem',
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1rem',
                            alignItems: 'center'
                        }}>
                            <div style={{ 
                                color: 'white', 
                                backgroundColor: '#16a34a', 
                                borderRadius: '4px', 
                                padding: '0.25rem', 
                                flexShrink: 0, 
                                display: 'flex' 
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <div>
                                <div style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                    Above Team Average!
                                </div>
                                <div style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
                                    You're performing 10 points above your team's average score
                                </div>
                            </div>
                        </div>

                        {/* Success Card 2 */}
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '0.5rem',
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center'
                        }}>
                            <div style={{ 
                                color: 'white', 
                                backgroundColor: '#16a34a', 
                                borderRadius: '4px', 
                                padding: '0.25rem', 
                                flexShrink: 0, 
                                display: 'flex' 
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <div>
                                <div style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                    Above Team Average!
                                </div>
                                <div style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
                                    Consistent performance in Deceptive Link Detection
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Original Header */}
                    <div className="flex justify-between items-start mb-8 block-mobile">
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '0.25rem' }}>Simulations</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Navigate the Digital Landscape with Confidence</p>
                        </div>
                        <div className="flex gap-4 items-center mt-mobile">
                            <select className="form-input" style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem' }}>
                                <option>Last 2 weeks</option>
                                <option>Last month</option>
                            </select>
                            <div className="text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                                <div>Last Updated</div>
                                <div style={{ fontWeight: 'bold' }}>Today, 3:42 PM</div>
                            </div>
                        </div>
                    </div>

                    <div className="simulations-grid">
                        {simulations.map(sim => (
                            <SimulationCard key={sim.id} {...sim} />
                        ))}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Simulations;