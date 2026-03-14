import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ProgressRing from '../components/ProgressRing';
import LineChart from '../components/LineChart';
import RadarChart from '../components/RadarChart';
import { useAppStore } from '../store/useAppStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, 
    faShieldHalved, 
    faArrowTrendUp, 
    faBrain,
    faClock,
    faRankingStar,
    faArrowRight,
    faChartPie
} from '@fortawesome/free-solid-svg-icons';

const Analytics = () => {
    const { resilienceScore } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('7weeks');

    // Mock data for demonstration
    const vulnerabilityData = {
        urgency: 65,
        urlDetection: 82,
        authority: 71,
        genericGreeting: 58,
        suspiciousLinks: 79,
        spoofing: 63
    };

    const weeklyProgress = [68, 72, 75, 73, 78, 82, 85];

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
                    {/* Header Section - Centered */}
                    <div style={{ 
                        marginBottom: '2rem',
                        textAlign: 'center'
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
                            <FontAwesomeIcon icon={faChartPie} style={{ color: '#F97316', fontSize: '2rem' }} />
                            <h1 style={{ 
                                fontSize: '2.2rem', 
                                fontWeight: '700', 
                                color: 'white',
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                Analytics Dashboard
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
                            marginBottom: '1.5rem'
                        }}>
                            Track your phishing awareness progress and identify areas for improvement
                        </p>

                        {/* Time Range Selector - Centered */}
                        <div style={{
                            display: 'inline-flex',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            padding: '0.25rem',
                            borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            margin: '0 auto'
                        }}>
                            {['7 Weeks', '4 Weeks', '3 Months'].map((range, index) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range === '7 Weeks' ? '7weeks' : range === '4 Weeks' ? '4weeks' : '3months')}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        backgroundColor: timeRange === (range === '7 Weeks' ? '7weeks' : range === '4 Weeks' ? '4weeks' : '3months') ? '#F97316' : 'transparent',
                                        color: timeRange === (range === '7 Weeks' ? '7weeks' : range === '4 Weeks' ? '4weeks' : '3months') ? 'white' : 'rgba(255,255,255,0.6)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (timeRange !== (range === '7 Weeks' ? '7weeks' : range === '4 Weeks' ? '4weeks' : '3months')) {
                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                            e.target.style.color = 'white';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (timeRange !== (range === '7 Weeks' ? '7weeks' : range === '4 Weeks' ? '4weeks' : '3months')) {
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

                    {/* Top Metrics Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        {/* Metric 1 */}
                        <div style={{
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(249, 115, 22, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FontAwesomeIcon icon={faChartLine} style={{ color: '#F97316' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Current Score</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{resilienceScore}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span>▲</span> +12% vs last month
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div style={{
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(249, 115, 22, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FontAwesomeIcon icon={faRankingStar} style={{ color: '#F97316' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Team Ranking</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>Top 25%</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#2DD4BF', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span>★</span> Among 128 team members
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div style={{
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(249, 115, 22, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FontAwesomeIcon icon={faClock} style={{ color: '#F97316' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Avg Response Time</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>2.4s</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span>▼</span> 0.3s faster than average
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        {/* Resilience Score Card */}
                        <div style={{
                            gridColumn: 'span 5',
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '2rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '600', 
                                color: 'white',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#F97316' }} />
                                Overall Resilience Score
                            </h2>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <ProgressRing
                                    radius={90}
                                    stroke={12}
                                    progress={resilienceScore}
                                    label="Resilience"
                                    textColor="white"
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '2rem',
                                width: '100%',
                                padding: '1rem 0',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.25rem' }}>+12%</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>vs Last Month</div>
                                </div>
                                <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#2DD4BF', fontWeight: 'bold', fontSize: '1.25rem' }}>Top 25%</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Team Ranking</div>
                                </div>
                            </div>

                            <button
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: '1px solid rgba(249, 115, 22, 0.3)',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                    marginTop: '0.5rem'
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
                                View Detailed Breakdown
                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                            </button>
                        </div>

                        {/* Progress Over Time Card */}
                        <div style={{
                            gridColumn: 'span 7',
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '2rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <h2 style={{ 
                                    fontSize: '1.25rem', 
                                    fontWeight: '600', 
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: '#F97316' }} />
                                    Progress Over Time
                                </h2>
                                <div style={{
                                    color: '#2DD4BF',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '2rem'
                                }}>
                                    <span>+33 points</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>in 7 weeks</span>
                                </div>
                            </div>
                            
                            <div style={{ height: '250px', width: '100%' }}>
                                <LineChart data={weeklyProgress} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '1.5rem'
                    }}>
                        {/* Vulnerability Assessment Card */}
                        <div style={{
                            gridColumn: 'span 5',
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '2rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <h2 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '600', 
                                color: 'white',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FontAwesomeIcon icon={faBrain} style={{ color: '#F97316' }} />
                                Vulnerability Assessment
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <RadarChart 
                                    textColor="#167f94" 
                                    gridColor="rgba(255,255,255,0.2)"
                                />
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    borderLeft: '3px solid #dc2626'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>Urgency Susceptible</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>65%</div>
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(22, 163, 74, 0.15)',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    borderLeft: '3px solid #16a34a'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>URL Detection</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>82%</div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations Card */}
                        <div style={{
                            gridColumn: 'span 7',
                            backgroundColor: '#132B44',
                            borderRadius: '1rem',
                            padding: '2rem',
                            borderTop: '1px solid #F97316',
                            borderBottom: '1px solid #F97316',
                            borderLeft: '4px solid #F97316',
                            borderRight: 'none',
                            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                        }}>
                            <h2 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '600', 
                                color: 'white',
                                marginBottom: '1.5rem'
                            }}>
                                Personalized Recommendations
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem'
                            }}>
                                {/* Recommendation 1 */}
                                <div style={{
                                    backgroundColor: 'rgba(249, 115, 22, 0.15)',
                                    borderRadius: '0.75rem',
                                    padding: '1.25rem',
                                    borderLeft: '3px solid #F97316'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                                        <span style={{ color: '#F97316', fontWeight: '600', fontSize: '0.9rem' }}>High Priority</span>
                                    </div>
                                    <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        Urgency Tactics Module
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1rem' }}>
                                        Improve resistance to time-pressure attacks
                                    </p>
                                    <button
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: '#F97316',
                                            border: '1px solid rgba(249, 115, 22, 0.3)',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
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
                                        Start Module
                                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.6rem' }} />
                                    </button>
                                </div>

                                {/* Recommendation 2 */}
                                <div style={{
                                    backgroundColor: 'rgba(45, 212, 191, 0.15)',
                                    borderRadius: '0.75rem',
                                    padding: '1.25rem',
                                    borderLeft: '3px solid #2DD4BF'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '1.2rem' }}>📈</span>
                                        <span style={{ color: '#2DD4BF', fontWeight: '600', fontSize: '0.9rem' }}>Recommended</span>
                                    </div>
                                    <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        Spear Phishing Detection
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1rem' }}>
                                        Learn to spot targeted impersonation attacks
                                    </p>
                                    <button
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: '#2DD4BF',
                                            border: '1px solid rgba(45, 212, 191, 0.3)',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'rgba(45, 212, 191, 0.1)';
                                            e.target.style.borderColor = '#2DD4BF';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.borderColor = 'rgba(45, 212, 191, 0.3)';
                                        }}
                                    >
                                        Start Module
                                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.6rem' }} />
                                    </button>
                                </div>

                                {/* Achievement Card */}
                                <div style={{
                                    gridColumn: 'span 2',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: '0.75rem',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    marginTop: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #F97316, #2DD4BF)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        🏆
                                    </div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
                                            Above Team Average!
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                            You're performing 10 points above your team's average score in URL Detection
                                        </div>
                                    </div>
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