import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ProgressRing from '../components/ProgressRing';
import LineChart from '../components/LineChart';
import RadarChart from '../components/RadarChart';
import { fetchSimulations, fetchUserStats } from '../api/simulations';
import { useAppStore } from '../store/useAppStore';
import { fetchUserAnalytics } from '../api/user';
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
    const navigate = useNavigate();
    const { resilienceScore } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeRange, setTimeRange] = useState('7weeks');
    const [teamRanking, setTeamRanking] = useState('Top 0%');
    const [timeSpent, setTimeSpent] = useState(0);
    const [weeklyProgress, setWeeklyProgress] = useState([]);
    const [vulnerabilityData, setVulnerabilityData] = useState([
        { category: 'Deceptive URLs', score: 0 },
        { category: 'BiTB Attacks', score: 0 },
        { category: 'Psychological Tactics', score: 0 },
        { category: 'Credential Harvesting', score: 0 }
    ]);
    const [simulationCatalog, setSimulationCatalog] = useState([]);

    const formatTimeSpent = (seconds) => {
        if (!seconds || seconds <= 0) return '0s';

        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) return `${hrs}h ${mins}m`;
        if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
        return `${secs}s`;
    };

    useEffect(() => {
        let isMounted = true;

        const loadMetrics = async () => {
            try {
                const [analytics, userStats, simulationsResponse] = await Promise.all([
                    fetchUserAnalytics(),
                    fetchUserStats(),
                    fetchSimulations(),
                ]);

                if (isMounted && analytics?.teamRanking) {
                    setTeamRanking(analytics.teamRanking);
                }

                if (isMounted) {
                    setWeeklyProgress(Array.isArray(analytics?.weeklyProgress) ? analytics.weeklyProgress : []);
                }

                if (isMounted) {
                    const categories = Array.isArray(analytics?.vulnerabilityData) ? analytics.vulnerabilityData : [];
                    setVulnerabilityData(categories.length > 0 ? categories : [
                        { category: 'Deceptive URLs', score: 0 },
                        { category: 'BiTB Attacks', score: 0 },
                        { category: 'Psychological Tactics', score: 0 },
                        { category: 'Credential Harvesting', score: 0 }
                    ]);
                }

                if (isMounted) {
                    setTimeSpent(userStats?.timeSpent ?? 0);
                }

                if (isMounted) {
                    setSimulationCatalog(Array.isArray(simulationsResponse)
                        ? simulationsResponse.map((simulation) => ({
                            slug: simulation.slug,
                            title: simulation.title,
                            description: simulation.description,
                        }))
                        : []);
                }
            } catch {
                if (isMounted) {
                    setTeamRanking('Top 0%');
                    setTimeSpent(0);
                    setWeeklyProgress([]);
                    setVulnerabilityData([
                        { category: 'Deceptive URLs', score: 0 },
                        { category: 'BiTB Attacks', score: 0 },
                        { category: 'Psychological Tactics', score: 0 },
                        { category: 'Credential Harvesting', score: 0 }
                    ]);
                    setSimulationCatalog([]);
                }
            }
        };

        loadMetrics();

        return () => {
            isMounted = false;
        };
    }, []);

    const getRangeLength = () => {
        if (timeRange === '4weeks') return 4;
        if (timeRange === '3months') return 12;
        return 7;
    };

    const chartWeeks = getRangeLength();
    const scoreHistory = weeklyProgress
        .map((score) => {
            const numericScore = Number(score);
            if (!Number.isFinite(numericScore)) return 0;
            return Math.max(0, Math.min(100, Math.round(numericScore)));
        })
        .slice(-chartWeeks);

    const paddedScores = Array(Math.max(chartWeeks - scoreHistory.length, 0)).fill(null).concat(scoreHistory);
    let lastKnownScore = 0;
    const chartData = paddedScores.map((score) => {
        if (score === null) {
            return lastKnownScore;
        }
        lastKnownScore = score;
        return score;
    });

    const chartLabels = Array.from({ length: chartWeeks }, (_, idx) => `Week ${idx + 1}`);
    const radarLabels = vulnerabilityData.map((item) => item.category);
    const radarValues = vulnerabilityData.map((item) => {
        const numericScore = Number(item?.score);
        if (!Number.isFinite(numericScore)) return 0;
        return Math.max(0, Math.min(100, Math.round(numericScore)));
    });
    const vulnerabilityHighlights = vulnerabilityData.slice(0, 2);
    const recommendationTitles = ['Psychological Tactics', 'Credential Harvesting'];
    const recommendations = recommendationTitles.map((title) => {
        const match = simulationCatalog.find((simulation) => simulation.title === title);
        return {
            title,
            description: match?.description || '',
            slug: match?.slug || null,
        };
    });

    const startSimulation = (slug, event) => {
        event.stopPropagation();
        if (slug) navigate(`/simulations/${slug}`);
    };

    const rankingMatch = teamRanking.match(/Top\s*(\d+)%/i);
    const rankingPercent = rankingMatch ? Number(rankingMatch[1]) : null;
    const isAboveAverage = rankingPercent !== null && rankingPercent < 50;
    const rankingInsightTitle = isAboveAverage ? 'Above Average Performance!' : 'Keep Pushing Forward!';
    const rankingInsightDescription = isAboveAverage
        ? "You're performing above average score of the total users."
        : 'You are making steady progress compared to all users — keep pushing and climb the rankings.';

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
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{resilienceScore}%</div>
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
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Ranking</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{teamRanking}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#2DD4BF', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span>★</span> Compared to all users
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
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Time Spent</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{formatTimeSpent(timeSpent)}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span>⏱</span> Total time in completed simulations
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
                                <div style={{ 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '120px',
                                    gap: '0.25rem'
                                }}>
                                    <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.25rem' }}>+12%</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>vs Last Month</div>
                                </div>
                                <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                                <div style={{ 
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '120px',
                                    gap: '0.25rem'
                                }}>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Ranking</div>
                                    <div style={{ color: '#2DD4BF', fontWeight: 'bold', fontSize: '1.25rem' }}>{teamRanking}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Compared to all users</div>
                                </div>
                            </div>
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
                                justifyContent: 'flex-start',
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
                            </div>
                            
                            <div style={{ height: '250px', width: '100%' }}>
                                <LineChart data={chartData} labels={chartLabels} />
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
                                    labels={radarLabels}
                                    data={radarValues}
                                    textColor="#167f94" 
                                    gridColor="rgba(255,255,255,0.2)"
                                />
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem'
                            }}>
                                {vulnerabilityHighlights.map((item, idx) => {
                                    const isFirst = idx === 0;
                                    return (
                                        <div
                                            key={item.category}
                                            style={{
                                                backgroundColor: isFirst ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 163, 74, 0.15)',
                                                borderRadius: '0.75rem',
                                                padding: '1rem',
                                                borderLeft: isFirst ? '3px solid #dc2626' : '3px solid #16a34a'
                                            }}
                                        >
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>{item.category}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: isFirst ? '#dc2626' : '#16a34a' }}>{item.score}%</div>
                                        </div>
                                    );
                                })}
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
                                        {recommendations[0].title}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1rem' }}>
                                        {recommendations[0].description}
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
                                        onClick={(e) => startSimulation(recommendations[0].slug, e)}
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
                                        {recommendations[1].title}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1rem' }}>
                                        {recommendations[1].description}
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
                                        onClick={(e) => startSimulation(recommendations[1].slug, e)}
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
                                    justifyContent: 'center',
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
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>
                                            {rankingInsightTitle}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textAlign: 'justify' }}>
                                            {rankingInsightDescription}
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