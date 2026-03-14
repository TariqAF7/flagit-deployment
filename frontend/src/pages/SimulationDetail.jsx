import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const SimulationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { simulations, reportSimulation } = useAppStore();

    const simulation = simulations.find(s => s.id === parseInt(id, 10)) || simulations[0];

    const [timeLeft, setTimeLeft] = useState(17 * 60 + 46); // 17:46 in seconds
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChoice = (choice) => {
        const isCorrect = reportSimulation(simulation.id, choice);
        if (isCorrect) {
            navigate('/results/success');
        } else {
            navigate('/results/recap');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#fcfcfc' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Phishing Simulation #{id}</h1>
                            <span className="pill-warning" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>Active Simulation</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scenario Timer</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--deep-navy)', lineHeight: 1 }}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--accent-orange)', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="email-container">
                        <div className="email-header">
                            <div className="email-avatar">M</div>
                            <div style={{ flex: 1 }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--deep-navy)' }}>Microsoft Security Team</div>
                                    <span className="pill-danger">External</span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    security-alerts@microsft-security.com
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    Today, 2:47 PM
                                </div>
                            </div>
                            <button className="btn btn-white" style={{ border: 'none', background: 'transparent', padding: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafaf9' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <span style={{ color: 'var(--danger)' }}>🚨</span>
                                URGENT: Suspicious Activity Detected on Your Account
                            </h2>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                To: <span style={{ color: '#0369a1' }}>alex.johnson@company.com</span> • High Priority
                            </div>
                        </div>

                        <div className="email-body">
                            <p style={{ marginBottom: '1rem' }}>Dear Valued Customer,</p>
                            <p style={{ marginBottom: '1.5rem' }}>
                                We have detected <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>SUSPICIOUS LOGIN ATTEMPTS</span> on your Microsoft account from an unrecognized device in Russia. Your account security may be compromised.
                            </p>

                            <div className="alert-box">
                                <div style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                    IMMEDIATE ACTION REQUIRED
                                </div>
                                You have <b>24 hours</b> to verify your account or it will be temporarily suspended for security purposes.
                            </div>

                            <p style={{ marginBottom: '1.5rem' }}>Please click the link below to secure your account immediately:</p>

                            <button
                                type="button"
                                className="btn btn-danger"
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.25rem', fontSize: '1rem', marginBottom: '0.5rem' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChoice('legit'); // Clicking link means they failed (marked as legit)
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                VERIFY ACCOUNT NOW
                            </button>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
                                https://microsoft-security-verification.com/urgent-verify
                            </div>

                            <p style={{ marginBottom: '1rem' }}>If you do not take action within 24 hours, your account will be locked and you may lose access to:</p>
                            <ul style={{ paddingLeft: '2rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                                <li>Microsoft Office 365</li>
                                <li>OneDrive files and documents</li>
                                <li>Outlook email access</li>
                                <li>Teams and collaboration tools</li>
                            </ul>

                            <p style={{ marginBottom: '2rem' }}>For your security, please do not share this email with anyone.</p>

                            <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '0.5rem' }}>Suspicious Activity Details:</div>
                                <div style={{ color: 'var(--text-muted)' }}>Location: Moscow, Russia</div>
                                <div style={{ color: 'var(--text-muted)' }}>Device: Unknown Windows PC</div>
                                <div style={{ color: 'var(--text-muted)' }}>Time: Today, 1:23 AM</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center mt-8 mb-8 flex-wrap">
                        <button
                            onClick={() => handleChoice('phish')}
                            className="btn btn-teal"
                            style={{ padding: '1rem 2rem' }}
                        >
                            Report as Phishing
                        </button>
                        <button
                            onClick={() => handleChoice('legit')}
                            className="btn btn-white"
                            style={{ color: 'var(--text-muted)', padding: '1rem 2rem' }}
                        >
                            Mark as Legit
                        </button>
                    </div>
                </main>
            </div>


            <Footer />
        </div>
    );
};

export default SimulationDetail;
