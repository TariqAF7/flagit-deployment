import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import SimulationCard from '../components/SimulationCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { fetchSimulations, fetchUserStats } from '../api/simulations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBrain, 
    faGraduationCap, 
    faClock, 
    faArrowRight,
    faShieldHalved,
    faChartLine,
    faTrophy,
    faRocket,
    faBullseye,
    faSeedling,
    faExclamationTriangle,
    faCheckCircle,
    faStar,
    faEnvelope,
    faLink,
    faUserSecret,
    faQrcode,
    faPhone,
    faGlobe
} from '@fortawesome/free-solid-svg-icons';

// Map icon string names from DB to FontAwesome icon objects
const ICON_MAP = {
    Brain: faBrain,
    UserSecret: faUserSecret,
    Globe: faGlobe,
    Link: faLink,
    Bullseye: faBullseye,
    Qrcode: faQrcode,
    Phone: faPhone,
    Shield: faShieldHalved,
    Envelope: faEnvelope,
    Mail: faEnvelope,
};

const Simulations = () => {
    const { simulations, resultsHistory } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [timeRange, setTimeRange] = useState('2weeks');
    const [userStats, setUserStats] = useState(null);
    const [simulationData, setSimulationData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch simulations + user stats on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [simsResp, statsResp] = await Promise.all([
                    fetchSimulations(),
                    fetchUserStats(),
                ]);
                if (Array.isArray(simsResp)) {
                    setSimulationData(simsResp.map(s => ({
                        id: s._id,
                        title: s.title,
                        description: s.description,
                        icon: s.icon,
                        rating: s.rating,
                        difficulty: s.difficulty,
                        tags: s.tags || [],
                        playCount: s.playCount || 0,
                        createdAt: s.createdAt,
                        progress: 0,
                    })));
                }
                if (statsResp) {
                    setUserStats(statsResp);
                }
            } catch (err) {
                console.warn('Failed to load simulations data:', err.message);
                // Fallback to store data
                if (simulations.length) {
                    setSimulationData(simulations);
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filtering logic
    const getFilteredSimulations = () => {
        let filtered = [...simulationData];
        const now = new Date();

        // Secondary filter: time range
        if (timeRange === '2weeks') {
            const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(s => !s.createdAt || new Date(s.createdAt) >= cutoff);
        } else if (timeRange === 'month') {
            const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(s => !s.createdAt || new Date(s.createdAt) >= cutoff);
        }
        // 'all' = no time filter

        // Primary filter
        if (filter === 'new') {
            const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filtered = filtered.filter(s => s.createdAt && new Date(s.createdAt) >= dayAgo);
        } else if (filter === 'popular') {
            filtered = [...filtered].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 3);
        } else if (filter === 'recommended') {
            const attemptedIds = new Set(resultsHistory.map(r => r.simulationId));
            filtered = filtered.filter(s => !attemptedIds.has(s.id));
        }
        // 'all' = show everything

        return filtered;
    };

    const filteredSimulations = getFilteredSimulations();

    // Derive stats from API response or defaults
    const statsData = {
        totalSimulations: userStats?.totalSimulations ?? simulationData.length,
        avgScore: userStats?.avgScore ?? 0,
        timeSpent: userStats?.timeSpent ?? 0,
    };

    // Format time spent (seconds → human readable)
    const formatTimeSpent = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${(seconds / 3600).toFixed(1)}h`;
    };

    // Generate performance messages from API insights
    const getPerformanceMessages = () => {
        if (!userStats?.insights || userStats.insights.length === 0) {
            // Fallback: show a single default message
            return [{
                type: 'success',
                icon: faSeedling,
                title: '🌱 Building Foundation',
                description: 'Complete simulations to see your personalized insights!',
                color: '#2DD4BF',
                badge: 'beginner'
            }];
        }

        // Map API insight types to icons and colors
        const iconMap = {
            warning: { icon: faExclamationTriangle, color: '#F97316' },
            achievement: { icon: faRocket, color: '#2DD4BF' },
            success: { icon: faShieldHalved, color: '#2DD4BF' },
            strength: { icon: faCheckCircle, color: '#2DD4BF' },
        };

        return userStats.insights.map(insight => {
            const mapping = iconMap[insight.type] || iconMap.success;
            return {
                type: insight.type,
                icon: mapping.icon,
                title: insight.title,
                description: insight.description,
                color: mapping.color,
                badge: insight.badge || null,
            };
        });
    };

    const performanceMessages = getPerformanceMessages();

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#167f94' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ 
                    maxWidth: '1400px', 
                    margin: '0 auto', 
                    width: '100%',
                    padding: '2rem'
                }}>
                    {/* Centered Header Section */}
                    <div style={{ 
                        textAlign: 'center',
                        marginBottom: '2.5rem'
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
                            <FontAwesomeIcon icon={faBrain} style={{ color: '#F97316', fontSize: '2rem' }} />
                            <h1 style={{ 
                                fontSize: '2.2rem', 
                                fontWeight: '700', 
                                color: 'white',
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                Simulations
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
                            margin: '0 auto 1.5rem auto',
                            maxWidth: '600px'
                        }}>
                            Test your skills against real-world phishing scenarios
                        </p>

                        {/* Filters Row - Centered */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            {/* Category Filters */}
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                padding: '0.25rem',
                                borderRadius: '2rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {['All', 'New', 'Popular', 'Recommended'].map((cat, index) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat.toLowerCase())}
                                        style={{
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            backgroundColor: filter === cat.toLowerCase() ? '#F97316' : 'transparent',
                                            color: filter === cat.toLowerCase() ? 'white' : 'rgba(255,255,255,0.6)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (filter !== cat.toLowerCase()) {
                                                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                                e.target.style.color = 'white';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filter !== cat.toLowerCase()) {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = 'rgba(255,255,255,0.6)';
                                            }
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Time Range Selector */}
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                padding: '0.25rem',
                                borderRadius: '2rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {['2 Weeks', '1 Month', 'All Time'].map((range, index) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range === '2 Weeks' ? '2weeks' : range === '1 Month' ? 'month' : 'all')}
                                        style={{
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            backgroundColor: timeRange === (range === '2 Weeks' ? '2weeks' : range === '1 Month' ? 'month' : 'all') ? '#2DD4BF' : 'transparent',
                                            color: timeRange === (range === '2 Weeks' ? '2weeks' : range === '1 Month' ? 'month' : 'all') ? 'white' : 'rgba(255,255,255,0.6)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (timeRange !== (range === '2 Weeks' ? '2weeks' : range === '1 Month' ? 'month' : 'all')) {
                                                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                                e.target.style.color = 'white';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (timeRange !== (range === '2 Weeks' ? '2weeks' : range === '1 Month' ? 'month' : 'all')) {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = 'rgba(255,255,255,0.6)';
                                            }
                                        }}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '2.5rem',
                        maxWidth: '900px',
                        margin: '0 auto 2.5rem auto'
                    }}>
                        <div style={{
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '1.25rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                            textAlign: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#F97316' }} />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Total Simulations</span>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>{statsData.totalSimulations}</div>
                        </div>

                        <div style={{
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '1.25rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                            textAlign: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <FontAwesomeIcon icon={faChartLine} style={{ color: '#F97316' }} />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Avg. Score</span>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>{statsData.avgScore}%</div>
                        </div>

                        <div style={{
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '1.25rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                            textAlign: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <FontAwesomeIcon icon={faClock} style={{ color: '#F97316' }} />
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Time Spent</span>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>{formatTimeSpent(statsData.timeSpent)}</div>
                        </div>
                    </div>

                    {/* Completed Training Modules Card - Dynamic Messages */}
                    <div style={{
                        backgroundColor: '#132B44',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '2.5rem',
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                        maxWidth: '1000px',
                        margin: '0 auto 2.5rem auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#F97316', fontSize: '1.25rem' }} />
                                <h2 style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: '600', 
                                    color: 'white',
                                    margin: 0
                                }}>
                                    Your Learning Insights
                                </h2>
                            </div>
                            <div style={{
                                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '2rem',
                                fontSize: '0.7rem',
                                color: '#F97316'
                            }}>
                                Based on your performance
                            </div>
                        </div>

                        {/* Dynamic Messages */}
                        {performanceMessages.map((msg, index) => (
                            <div key={index} style={{
                                backgroundColor: msg.type === 'warning' ? 'rgba(249, 115, 22, 0.15)' : 
                                               msg.type === 'achievement' ? 'rgba(45, 212, 191, 0.15)' :
                                               msg.type === 'strength' ? 'rgba(45, 212, 191, 0.1)' :
                                               'rgba(45, 212, 191, 0.1)',
                                borderRadius: '0.75rem',
                                padding: '1rem',
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: index !== performanceMessages.length - 1 ? '1rem' : 0,
                                borderLeft: `3px solid ${msg.color}`,
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}>
                                <div style={{ 
                                    color: msg.color, 
                                    flexShrink: 0,
                                    fontSize: '1.1rem',
                                    minWidth: '24px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    paddingTop: '2px'
                                }}>
                                    <FontAwesomeIcon icon={msg.icon} />
                                </div>
                                <div style={{ 
                                    flex: 1,
                                    textAlign: 'left'
                                }}>
                                    <div style={{ 
                                        color: msg.color, 
                                        fontWeight: '600', 
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.25rem',
                                        textAlign: 'left'
                                    }}>
                                        {msg.title}
                                        {msg.badge && (
                                            <span style={{
                                                backgroundColor: msg.color,
                                                color: '#132B44',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.6rem',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}>
                                                {msg.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ 
                                        color: 'rgba(255,255,255,0.7)', 
                                        fontSize: '0.8rem', 
                                        lineHeight: '1.5',
                                        textAlign: 'left'
                                    }}>
                                        {msg.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simulations Grid - Navy Glass Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {filteredSimulations.map((sim, index) => (
                            <div
                                key={sim.id}
                                style={{
                                    background: '#132B44',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px -8px rgba(249, 115, 22, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0, 0, 0, 0.4)';
                                }}
                                onClick={() => {/* Navigate to simulation detail */}}
                            >
                                {/* Badges */}
                                {sim.tags && sim.tags.includes('NEW') && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'linear-gradient(135deg, #F97316, #2DD4BF)',
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
                                {sim.tags && sim.tags.includes('POPULAR') && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        backgroundColor: '#2DD4BF',
                                        color: '#132B44',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        zIndex: 1
                                    }}>
                                        POPULAR
                                    </div>
                                )}
                                
                                {/* Icon */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: `linear-gradient(135deg, ${index % 2 === 0 ? '#F97316' : '#2DD4BF'}20, transparent)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FontAwesomeIcon 
                                            icon={ICON_MAP[sim.icon] || faBrain} 
                                            style={{ 
                                                fontSize: '1.5rem',
                                                color: index % 2 === 0 ? '#F97316' : '#2DD4BF'
                                            }} 
                                        />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: 'white',
                                            margin: 0
                                        }}>
                                            {sim.title}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.5)',
                                            fontSize: '0.75rem',
                                            margin: '0.25rem 0 0 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.6rem', color: '#F97316' }} />
                                            {sim.difficulty} • {sim.rating}
                                        </p>
                                    </div>
                                </div>

                                {/* Description - Training focused */}
                                <p style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.5',
                                    marginBottom: '1.5rem',
                                    flex: 1,
                                    textAlign: 'left'
                                }}>
                                    {sim.description}
                                </p>

                                {/* Progress Bar */}
                                <div style={{
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{
                                            color: 'rgba(255,255,255,0.5)',
                                            fontSize: '0.7rem'
                                        }}>
                                            Progress
                                        </span>
                                        <span style={{
                                            color: '#F97316',
                                            fontSize: '0.7rem',
                                            fontWeight: '600'
                                        }}>
                                            {sim.progress}%
                                        </span>
                                    </div>
                                    <div style={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        height: '6px',
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${sim.progress}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #F97316, #2DD4BF)',
                                            borderRadius: '3px'
                                        }} />
                                    </div>
                                </div>

                                {/* Bottom row */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '0.5rem',
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    paddingTop: '1rem'
                                }}>
                                    <span style={{
                                        color: 'rgba(255,255,255,0.4)',
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.6rem' }} />
                                        {sim.duration}
                                    </span>
                                    <span style={{
                                        color: '#F97316',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        cursor: 'pointer',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
                                    }}>
                                        Start Training
                                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.6rem' }} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Link */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <button
                            onClick={() => {/* Handle view all */}}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '2px solid rgba(249, 115, 22, 0.3)',
                                padding: '0.75rem 2.5rem',
                                borderRadius: '2rem',
                                fontSize: '0.95rem',
                                fontWeight: '500',
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
                            View All Scenarios
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Simulations;