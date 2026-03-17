import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import ModuleCard from '../components/ModuleCard';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { fetchSimulations, fetchUserStats } from '../api/simulations';
import { filterSimulations } from '../utils/simulationFilters';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldHalved, 
    faTrophy, 
    faChartLine, 
    faBullseye, 
    faSeedling,
    faStar,
    faGraduationCap,
    faArrowRight,
    faBrain
} from '@fortawesome/free-solid-svg-icons';

const getResilienceMessage = (score) => {
    if (score >= 90) {
        return {
            title: "Elite Security Champion!",
            message: "Exceptional phishing detection skills. You're a cybersecurity role model!",
            icon: faTrophy,
            iconColor: "#FFD700",
            badge: "🏆 Top Performer",
            badgeColor: "#f0fdf4",
            badgeTextColor: "#166534"
        };
    } else if (score >= 75) {
        return {
            title: "Excellent Security Awareness!",
            message: "You're demonstrating strong phishing detection skills. Keep up the great work!",
            icon: faShieldHalved,
            iconColor: "#F97316",
            badge: "🛡️ Strong Defender",
            badgeColor: "#f0fdf4",
            badgeTextColor: "#166534"
        };
    } else if (score >= 60) {
        return {
            title: "Good Progress!",
            message: "You're building solid detection habits. A few more simulations will boost your score.",
            icon: faChartLine,
            iconColor: "#2DD4BF",
            badge: "📈 On Track",
            badgeColor: "#fef3c7",
            badgeTextColor: "#92400e"
        };
    } else if (score >= 40) {
        return {
            title: "Getting There!",
            message: "You're learning to spot threats. Complete more training simulations to improve.",
            icon: faBullseye,
            iconColor: "#2DD4BF",
            badge: "🎯 In Progress",
            badgeColor: "#fef3c7",
            badgeTextColor: "#92400e"
        };
    } else {
        return {
            title: "Ready to Learn!",
            message: "Everyone starts somewhere. Try our training simulations to build your skills.",
            icon: faSeedling,
            iconColor: "#2DD4BF",
            badge: "🌱 Beginner",
            badgeColor: "#fef3c7",
            badgeTextColor: "#92400e"
        };
    }
};

const Dashboard = () => {
    const { resilienceScore, stats, modules, resultsHistory } = useAppStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userStats, setUserStats] = useState(null);
    const [simulationData, setSimulationData] = useState([]);
    const [dashboardFilter, setDashboardFilter] = useState('all');

    const dashboardFilterMap = [
        { label: 'All Simulations', value: 'all' },
        { label: 'Newly Added', value: 'new' },
        { label: 'Popular', value: 'popular' },
        { label: 'Recommended', value: 'recommended' }
    ];

    const fallbackRequiredSimulations = [
        {
            title: 'Psychological Tactics',
            description: 'Analyze this email and decide: Is it a legitimate request or a manipulation attempt?',
            slug: 'psychological-tactics'
        },
        {
            title: 'Vishing Tactics',
            description: 'Listen to this voicemail. Would you call back?',
            slug: 'vishing-tactics'
        },
        {
            title: 'BiTB Awareness',
            description: 'Examine this browser window. Can you spot anything unusual?',
            slug: 'bitb-awareness'
        }
    ];

    const toSlug = (text = '') =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    const resolveRequiredSimulation = (slug) => {
        const fromApi = simulationData.find((sim) => sim.slug === slug);
        if (fromApi) {
            return fromApi;
        }
        return fallbackRequiredSimulations.find((sim) => sim.slug === slug);
    };

    const requiredCards = [
        resolveRequiredSimulation('psychological-tactics'),
        resolveRequiredSimulation('vishing-tactics'),
        resolveRequiredSimulation('bitb-awareness')
    ].filter(Boolean);

    const unchangedFourthCard = modules[3]
        ? {
              ...modules[3],
              slug:
                  simulationData.find((sim) => sim.title === modules[3].title)?.slug ||
                  toSlug(modules[3].title)
          }
        : null;

    const dashboardCards = [...requiredCards, unchangedFourthCard].filter(Boolean).slice(0, 4);

    const filteredDashboardCards = filterSimulations({
        simulationData: dashboardCards,
        filter: dashboardFilter,
        timeRange: 'all',
        resultsHistory
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsResp, simsResp] = await Promise.all([
                    fetchUserStats(),
                    fetchSimulations()
                ]);

                if (statsResp) {
                    setUserStats(statsResp);
                }

                if (Array.isArray(simsResp)) {
                    setSimulationData(simsResp);
                }
            } catch (err) {
                console.warn('Failed to load dashboard data:', err.message);
            }
        };

        loadDashboardData();
    }, []);
    
    const resilienceMessage = getResilienceMessage(resilienceScore);

    return (
        <div className="dashboard-layout">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content">
                    <div className="dashboard-main-grid">
                        {/* Current Status Card - Option 3 Style with orange borders on top, bottom, and left */}
                        <div className="card" style={{ 
                            backgroundColor: '#132B44',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            minHeight: '500px',
                            borderRadius: '1rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '1.5rem'
                            }}>
                                <FontAwesomeIcon 
                                    icon={resilienceMessage.icon} 
                                    style={{ 
                                        color: resilienceMessage.iconColor,
                                        fontSize: '2rem'
                                    }} 
                                />
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: '0.5px'
                                }}>
                                    CURRENT STATUS
                                </span>
                            </div>

                            <div style={{
                                width: '220px',
                                height: '220px',
                                margin: '0 auto 1.5rem auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ProgressRing
                                    radius={90}
                                    stroke={12}
                                    progress={resilienceScore}
                                    label=""
                                    textColor="white"
                                />
                            </div>

                            <div style={{
                                fontSize: '3rem',
                                fontWeight: '700',
                                color: 'white',
                                lineHeight: '1',
                                marginBottom: '1rem'
                            }}>
                                {resilienceScore}
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                    color: 'rgba(255,255,255,0.5)',
                                    marginLeft: '4px'
                                }}>
                                    /100
                                </span>
                            </div>

                            <h2 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: '700', 
                                marginBottom: '0.75rem',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                {resilienceMessage.title}
                            </h2>
                            
                            <p style={{ 
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                textAlign: 'center',
                                maxWidth: '280px',
                                margin: '0 auto 1.5rem auto'
                            }}>
                                {resilienceMessage.message}
                            </p>

                            <div style={{
                                padding: '0.5rem 1.25rem',
                                backgroundColor: resilienceMessage.badgeColor,
                                borderRadius: '2rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: resilienceMessage.badgeTextColor,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.75rem' }} />
                                {resilienceMessage.badge}
                            </div>
                        </div>

                        {/* Stat Cards - Will use Option 3 from StatCard component */}
                        <div className="stats-grid">
                            <StatCard
                                title="Simulations Completed"
                                value={stats.simulationsCompleted}
                                icon={<FontAwesomeIcon icon={faGraduationCap} />}
                            />
                            <StatCard
                                title="Phish Detected"
                                value={stats.phishDetected}
                                icon={<FontAwesomeIcon icon={faShieldHalved} />}
                            />
                            <StatCard
                                title="Avg. Score"
                                value={`${userStats?.avgScore ?? 0}%`}
                                icon={<FontAwesomeIcon icon={faChartLine} />}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 flex-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <button
                            onClick={() => navigate('/simulations')}
                            className="btn btn-orange btn-full"
                            style={{ padding: '1.25rem' }}
                        >
                            <FontAwesomeIcon icon={faShieldHalved} style={{ marginRight: '0.5rem' }} />
                            Launch New Simulation
                        </button>
                        <button
                            onClick={() => navigate('/analytics')}
                            className="btn btn-white btn-full"
                            style={{ padding: '1.25rem', fontWeight: 'bold' }}
                        >
                            <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '0.5rem', color: '#F97316' }} />
                            View Detailed Progress
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <h2 style={{ 
                                    fontSize: '1.75rem', 
                                    fontWeight: '700', 
                                    color: 'white',
                                    marginBottom: '0.25rem',
                                    letterSpacing: '-0.02em'
                                }}>
                                    <FontAwesomeIcon icon={faBrain} style={{ color: '#F97316', marginRight: '0.75rem' }} />
                                    Simulations
                                </h2>
                                <p style={{ 
                                    color: 'rgba(255,255,255,0.6)', 
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#F97316' }} />
                                    Enhance your security knowledge with our curated simulations
                                </p>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '0.25rem',
                                borderRadius: '2rem',
                                backdropFilter: 'blur(10px)'
                            }}>
                                {dashboardFilterMap.map((tab) => {
                                    const isActive = dashboardFilter === tab.value;
                                    return (
                                        <button
                                            key={tab.label}
                                            onClick={() => setDashboardFilter(tab.value)}
                                            style={{
                                                padding: '0.5rem 1.25rem',
                                                borderRadius: '2rem',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                backgroundColor: isActive ? '#F97316' : 'transparent',
                                                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                                    e.target.style.color = 'white';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = 'rgba(255,255,255,0.7)';
                                                }
                                            }}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Featured module card - centered content */}
                        <div style={{
                            maxWidth: '1000px',
                            margin: '0 auto 3rem auto',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '3rem'
                            }}>
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{
                                            background: 'linear-gradient(135deg, #F97316, #2DD4BF)',
                                            color: 'white',
                                            padding: '0.25rem 1rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Featured Simulation
                                        </span>
                                        <span style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <span style={{ fontSize: '1rem', color: 'white' }}>🔥</span>
                                            <span style={{ color: 'white' }}>Most popular this week</span>
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: 'white',
                                        marginBottom: '0.5rem',
                                        lineHeight: '1.3'
                                    }}>
                                        Advanced Social Engineering Tactics
                                    </h3>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '1rem',
                                        lineHeight: '1.6',
                                        margin: 0
                                    }}>
                                        Learn to identify sophisticated manipulation techniques used in modern phishing attacks
                                    </p>
                                </div>

                                <button
                                    style={{
                                        backgroundColor: '#F97316',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.9rem 2.5rem',
                                        borderRadius: '2.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.3)',
                                        transition: 'all 0.2s',
                                        height: 'fit-content'
                                    }}
                                    onClick={() => navigate('/simulations/credential-harvesting')}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.02)';
                                        e.target.style.boxShadow = '0 15px 25px -5px rgba(249, 115, 22, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = '0 10px 20px -5px rgba(249, 115, 22, 0.3)';
                                    }}
                                >
                                    Start Learning
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}>
                            {filteredDashboardCards.map((mod, index) => (
                                <div
                                    key={mod.id || mod.slug || mod.title}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        borderRadius: '1rem',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(249, 115, 22, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onClick={() => navigate(`/simulations/${mod.slug}`)}
                                >
                                    {index === 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            backgroundColor: '#F97316',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            zIndex: 1
                                        }}>
                                            NEW
                                        </div>
                                    )}
                                    {index === 2 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            backgroundColor: '#2DD4BF',
                                            color: '#0a1a2f',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            zIndex: 1
                                        }}>
                                            POPULAR
                                        </div>
                                    )}
                                    
                                    <div style={{
                                        height: '140px',
                                        background: `linear-gradient(135deg, ${index % 2 === 0 ? '#F97316' : '#2DD4BF'}20, #0a1a2f)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        <FontAwesomeIcon 
                                            icon={index === 0 ? faShieldHalved : index === 1 ? faBullseye : faChartLine} 
                                            style={{ 
                                                fontSize: '3rem',
                                                color: index % 2 === 0 ? '#F97316' : '#2DD4BF',
                                                opacity: '0.8'
                                            }} 
                                        />
                                    </div>

                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            color: 'white',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {mod.title || `Module ${mod.id}`}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.6)',
                                            fontSize: '0.875rem',
                                            lineHeight: '1.5',
                                            marginBottom: '1rem',
                                            minHeight: '3rem'
                                        }}>
                                            {mod.description || 'Learn to identify and respond to sophisticated phishing attempts'}
                                        </p>

                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            height: '6px',
                                            borderRadius: '3px',
                                            marginBottom: '1rem',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${mod.progress || Math.floor(Math.random() * 100)}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #F97316, #2DD4BF)',
                                                borderRadius: '3px'
                                            }} />
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.75rem'
                                            }}>
                                                {mod.difficulty || 'Intermediate'} • {mod.duration || '15 min'}
                                            </span>
                                            <span style={{
                                                color: '#F97316',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                Start Training
                                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.75rem' }} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            textAlign: 'center',
                            marginTop: '2rem'
                        }}>
                            <button
                                onClick={() => navigate('/simulations')}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: '2px solid rgba(249, 115, 22, 0.3)',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
                                    e.target.style.borderColor = '#F97316';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                                }}
                            >
                                View All Simulations
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;