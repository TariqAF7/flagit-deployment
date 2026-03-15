import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { fetchSimulationBySlug } from '../api/simulations';
import { startSimulation } from '../api/simulations';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const SimulationDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { reportSimulation, setCurrentSimulation } = useAppStore();

    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const startTimeRef = useRef(null);

    // Fetch simulation data by slug
    useEffect(() => {
        const load = async () => {
            try {
                const sim = await fetchSimulationBySlug(slug);
                setSimulation(sim);
                setCurrentSimulation(sim);
                setTimeLeft(sim.timeLimit || 900);
                startTimeRef.current = Date.now();
                // Increment play count
                try { await startSimulation(sim._id); } catch {}
            } catch (err) {
                console.error('Failed to load simulation:', err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    // Countdown timer
    useEffect(() => {
        if (!simulation || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-submit as legit (user failed to act in time)
                    handleChoice('legit');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [simulation]);

    const handleChoice = async (choice) => {
        if (submitting) return;
        setSubmitting(true);
        const responseTime = startTimeRef.current
            ? Math.round((Date.now() - startTimeRef.current) / 1000)
            : 0;
        const flagged = choice === 'phish';
        try {
            const isCorrect = await reportSimulation(simulation._id, choice, responseTime, flagged);
            if (isCorrect) {
                navigate('/results/success');
            } else {
                navigate('/results/recap');
            }
        } catch {
            navigate('/results/recap');
        }
    };

    // Intercept clicks on links inside the email body
    const handleEmailBodyClick = (e) => {
        const anchor = e.target.closest('a');
        if (anchor) {
            e.preventDefault();
            handleChoice('legit');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="dashboard-layout" style={{ backgroundColor: '#fcfcfc' }}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="dashboard-content">
                    <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
                    <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center', paddingTop: '4rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Loading simulation...</p>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    if (!simulation) {
        return (
            <div className="dashboard-layout" style={{ backgroundColor: '#fcfcfc' }}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="dashboard-content">
                    <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
                    <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center', paddingTop: '4rem' }}>
                        <h2>Simulation not found</h2>
                        <button className="btn btn-primary" onClick={() => navigate('/simulations')}>Back to Simulations</button>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    const email = simulation.emailContent || {};
    const senderInitial = (email.senderName || 'S').charAt(0).toUpperCase();

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#fcfcfc' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{simulation.title}</h1>
                            <span className="pill-warning" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>Active Simulation</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scenario Timer</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: timeLeft <= 60 ? 'var(--danger)' : 'var(--deep-navy)', lineHeight: 1 }}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div style={{ backgroundColor: timeLeft <= 60 ? 'var(--danger)' : 'var(--accent-orange)', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="email-container">
                        <div className="email-header">
                            <div className="email-avatar">{senderInitial}</div>
                            <div style={{ flex: 1 }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--deep-navy)' }}>{email.senderName}</div>
                                    <span className="pill-danger">External</span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {email.senderEmail}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    Today, 2:47 PM
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafaf9' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <span style={{ color: 'var(--danger)' }}>🚨</span>
                                {email.subject}
                            </h2>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                To: <span style={{ color: '#0369a1' }}>alex.johnson@company.com</span> • High Priority
                            </div>
                        </div>

                        <div
                            className="email-body"
                            onClick={handleEmailBodyClick}
                            dangerouslySetInnerHTML={{ __html: email.body }}
                        />
                    </div>

                    <div className="flex gap-4 justify-center mt-8 mb-8 flex-wrap">
                        <button
                            onClick={() => handleChoice('phish')}
                            className="btn btn-teal"
                            style={{ padding: '1rem 2rem' }}
                            disabled={submitting}
                        >
                            Report as Phishing
                        </button>
                        <button
                            onClick={() => handleChoice('legit')}
                            className="btn btn-white"
                            style={{ color: 'var(--text-muted)', padding: '1rem 2rem' }}
                            disabled={submitting}
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
