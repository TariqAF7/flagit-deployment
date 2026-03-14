import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import SimulationCard from '../components/SimulationCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
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

const Simulations = () => {
    const { simulations, userStats } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [timeRange, setTimeRange] = useState('2weeks');

    // Mock user performance data (will be replaced with real backend data)
    const userPerformance = {
        overallScore: 82,
        completedModules: 7,
        averageScore: 75,
        teamAverage: 72,
        strengths: ['deceptiveLinks', 'urgencyDetection'],
        weaknesses: ['spearPhishing', 'quishing'],
        streak: 5,
        lastWeekImprovement: 12,
        rank: 'top25'
    };

    // Dynamic messages based on user performance
    const getPerformanceMessages = () => {
        const messages = [];
        
        // Recommendation message based on weakest area
        if (userPerformance.weaknesses.includes('spearPhishing')) {
            messages.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'Recommended: Complete "Spear Phishing" module',
                description: 'This will help you spot targeted impersonation attacks - your current weak spot',
                color: '#F97316',
                priority: 'high'
            });
        } else if (userPerformance.weaknesses.includes('quishing')) {
            messages.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'Recommended: Complete "Quishing Tactics" module',
                description: 'QR code attacks are on the rise - strengthen your detection skills',
                color: '#F97316',
                priority: 'high'
            });
        } else {
            messages.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'Recommended: Complete "Urgency Tactics" module',
                description: 'This will help improve your resistance to time-pressure attacks',
                color: '#F97316',
                priority: 'high'
            });
        }

        // Achievement message based on streak
        if (userPerformance.streak >= 10) {
            messages.push({
                type: 'achievement',
                icon: faTrophy,
                title: '🔥 10-Week Streak!',
                description: 'You\'ve completed simulations for 10 weeks straight - exceptional dedication!',
                color: '#2DD4BF',
                badge: 'elite'
            });
        } else if (userPerformance.streak >= 5) {
            messages.push({
                type: 'achievement',
                icon: faRocket,
                title: '⭐ 5-Week Streak',
                description: 'Consistent progress! Keep the momentum going.',
                color: '#2DD4BF',
                badge: 'consistent'
            });
        }

        // Performance-based message
        if (userPerformance.overallScore >= 90) {
            messages.push({
                type: 'success',
                icon: faTrophy,
                title: '🏆 Elite Defender',
                description: 'You\'re in the top 5% of all users. Masterful phishing detection!',
                color: '#2DD4BF',
                badge: 'elite'
            });
        } else if (userPerformance.overallScore >= 75) {
            messages.push({
                type: 'success',
                icon: faShieldHalved,
                title: '🛡️ Strong Defender',
                description: `You're performing ${userPerformance.overallScore - userPerformance.teamAverage} points above team average`,
                color: '#2DD4BF',
                badge: 'strong'
            });
        } else if (userPerformance.overallScore >= 60) {
            messages.push({
                type: 'success',
                icon: faChartLine,
                title: '📈 On Track',
                description: `You've improved by ${userPerformance.lastWeekImprovement}% this week - great progress!`,
                color: '#2DD4BF',
                badge: 'improving'
            });
        } else {
            messages.push({
                type: 'success',
                icon: faSeedling,
                title: '🌱 Building Foundation',
                description: 'Every expert was once a beginner. Keep learning!',
                color: '#2DD4BF',
                badge: 'beginner'
            });
        }

        // Strength-based message
        if (userPerformance.strengths.includes('deceptiveLinks')) {
            messages.push({
                type: 'strength',
                icon: faCheckCircle,
                title: '✅ URL Detection Master',
                description: 'Your ability to spot malicious links is exceptional',
                color: '#2DD4BF',
                badge: 'strength'
            });
        } else if (userPerformance.strengths.includes('urgencyDetection')) {
            messages.push({
                type: 'strength',
                icon: faCheckCircle,
                title: '✅ Calm Under Pressure',
                description: 'You resist urgency tactics better than 85% of users',
                color: '#2DD4BF',
                badge: 'strength'
            });
        }

        return messages;
    };

    const performanceMessages = getPerformanceMessages();

    // Simulation data with training-focused descriptions - Less clue-giving
const simulationModules = [
    {
        id: 1,
        title: 'Psychological Tactics',
        description: 'Analyze this email and decide: Is it a legitimate request or a manipulation attempt?',
        icon: faBrain,
        difficulty: 'Beginner',
        duration: '12 min',
        rating: 4.8,
        progress: 0
    },
    {
        id: 2,
        title: 'Credential Harvesting',
        description: 'Review this login page carefully. Would you enter your credentials?',
        icon: faUserSecret,
        difficulty: 'Beginner',
        duration: '10 min',
        rating: 4.6,
        progress: 0
    },
    {
        id: 3,
        title: 'BiTB Awareness',
        description: 'Examine this browser window. Can you spot anything unusual?',
        icon: faGlobe,
        difficulty: 'Intermediate',
        duration: '15 min',
        rating: 4.8,
        progress: 0
    },
    {
        id: 4,
        title: 'Deceptive Links 101',
        description: 'Before you click, examine this link. Is it safe or suspicious?',
        icon: faLink,
        difficulty: 'Beginner',
        duration: '8 min',
        rating: 4.9,
        progress: 0
    },
    {
        id: 5,
        title: 'Spear Phishing',
        description: 'This email knows your name and role. Does that make it trustworthy?',
        icon: faBullseye,
        difficulty: 'Advanced',
        duration: '20 min',
        rating: 4.7,
        progress: 0
    },
    {
        id: 6,
        title: 'Quishing Tactics',
        description: 'Scan this QR code? Think twice. What could be hidden behind it?',
        icon: faQrcode,
        difficulty: 'Intermediate',
        duration: '12 min',
        rating: 4.5,
        progress: 0
    },
    {
        id: 7,
        title: 'Vishing Tactics',
        description: 'Listen to this voicemail. Would you call back?',
        icon: faPhone,
        difficulty: 'Intermediate',
        duration: '15 min',
        rating: 4.4,
        progress: 0
    },
    {
        id: 8,
        title: 'Watering Hole Attack',
        description: 'This website looks normal. Can you spot the hidden danger?',
        icon: faShieldHalved,
        difficulty: 'Advanced',
        duration: '18 min',
        rating: 4.6,
        progress: 0
    },
    {
        id: 9,
        title: 'CEO Fraud Detection',
        description: 'Urgent request from your CEO. Would you comply or verify?',
        icon: faEnvelope,
        difficulty: 'Advanced',
        duration: '15 min',
        rating: 4.9,
        progress: 0
    }
];

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
                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>{simulationModules?.length || 0}</div>
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
                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>{userPerformance.overallScore}%</div>
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
                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>2.4h</div>
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
                        {simulationModules.map((sim, index) => (
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
                                {index === 0 && (
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
                                {index === 2 && (
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
                                            icon={sim.icon} 
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