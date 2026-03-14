import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FlagCard from '../components/FlagCard';
import { useAppStore } from '../store/useAppStore';

const ResultsRecap = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { getLastResult } = useAppStore();
    const lastResult = getLastResult();
    const simId = lastResult?.simulationId || 1;

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#fcfcfc' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                    <div className="card text-center flex-col justify-center items-center" style={{
                        border: '2px solid #ef4444',
                        backgroundColor: '#fef2f2',
                        padding: '2.5rem',
                        marginBottom: '2rem',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#2563eb', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                                Dashboard
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate(`/simulations/${simId}`)} style={{ backgroundColor: '#3b82f6', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                                Try Again!
                            </button>
                        </div>

                        <div style={{ backgroundColor: '#dc2626', color: 'white', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </div>
                        <h1 style={{ color: '#dc2626', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Not Quite! Let us Recap
                        </h1>
                        <p style={{ color: '#991b1b', fontSize: '0.875rem', opacity: 0.9 }}>
                            {lastResult ? `Last Attempt: Simulation #${simId} — Marked as ${lastResult.choice === 'phish' ? 'Phishing' : 'Legit'}` : ''}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 12 12 14 14"></polyline></svg>
                                    Technical Red Flags
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <FlagCard
                                    type="technical"
                                    title="Suspicious Domain"
                                    description={`The sender domain "microsft-security.com" is missing the 'o' in Microsoft. Legitimate Microsoft emails come from @microsoft.com domains.`}
                                />
                                <FlagCard
                                    type="technical"
                                    title="External Sender Warning"
                                    description={`The email was flagged as "External" indicating it came from outside your organization, yet claims to be from Microsoft Security.`}
                                />
                                <FlagCard
                                    type="technical"
                                    title="Suspicious Links"
                                    description={`The verification link points to "microsoft-security-verification.com" - not a legitimate Microsoft domain. Always hover over links to check destinations.`}
                                />
                                <FlagCard
                                    type="technical"
                                    title="Suspicious Attachments"
                                    description={`Unexpected PDF attachments in security alerts are often malicious. Legitimate security notifications rarely include attachments.`}
                                />
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ backgroundColor: '#ea580c', color: 'white', padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    Psychological Manipulation
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <FlagCard
                                    type="psychological"
                                    title="Urgency & Time Pressure"
                                    description={`The email creates false urgency with "24 hours" deadline and "IMMEDIATE ACTION REQUIRED" to pressure quick decisions without careful thought.`}
                                />
                                <FlagCard
                                    type="psychological"
                                    title="Authority Impersonation"
                                    description={`Pretends to be from "Microsoft Security Team" to leverage trust in a well-known technology company and create perceived legitimacy.`}
                                />
                                <FlagCard
                                    type="psychological"
                                    title="Fear & Consequences"
                                    description={`Threatens account suspension and loss of access to important services (Office 365, OneDrive, Teams) to create fear and motivate immediate action.`}
                                />
                                <FlagCard
                                    type="psychological"
                                    title="Social Engineering"
                                    description={`Uses specific details like "Moscow, Russia" and "Unknown Windows PC" to make the threat seem more credible and personalized.`}
                                />
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default ResultsRecap;
