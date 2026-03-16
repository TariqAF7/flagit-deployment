import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FlagCard from '../components/FlagCard';
import { useAppStore } from '../store/useAppStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle,
    faShieldHalved,
    faRotateRight,
    faChartLine,
    faFlag,
    faLightbulb,
    faChevronDown,
    faChevronUp,
    faHome,
    faArrowRight,
    faTrophy,
    faMedal,
    faGhost,
    faUserSecret,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';

const ResultsSuccess = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        technical: true,
        psychological: true
    });
    
    const { getLastResult, currentSimulation } = useAppStore();
    const lastResult = getLastResult();
    const simSlug = currentSimulation?.slug || '';

    const redFlags = currentSimulation?.emailContent?.redFlags || [];
    const technicalFlags = redFlags.filter(f => f.type === 'technical');
    const psychologicalFlags = redFlags.filter(f => f.type === 'psychological');

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ 
                    maxWidth: '1200px', 
                    margin: '0 auto', 
                    width: '100%',
                    padding: '2rem'
                }}>
                    
                    {/* Centered Header with gradient lines and icon */}
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
                            <FontAwesomeIcon icon={faMedal} style={{ color: '#F97316', fontSize: '2rem' }} />
                            <h1 style={{ 
                                fontSize: '2.2rem', 
                                fontWeight: '700', 
                                color: 'white',
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                Success!
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
                            margin: 0
                        }}>
                            Great job! Review the flags you correctly identified
                        </p>
                    </div>

                    {/* Main Result Card */}
                    <div style={{
                        backgroundColor: '#132B44',
                        borderRadius: '1.5rem',
                        padding: '2.5rem',
                        marginBottom: '2.5rem',
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 20px 30px -10px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'center'
                    }}>
                        {/* Background decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-5%',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
                            zIndex: 0
                        }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Icon */}
                            <div style={{
                                backgroundColor: '#22c55e',
                                color: 'white',
                                borderRadius: '50%',
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem auto',
                                boxShadow: '0 10px 20px -5px rgba(34,197,94,0.3)',
                                animation: 'pulse-green 2s infinite'
                            }}>
                                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '2.5rem' }} />
                            </div>
                            
                            <h1 style={{ 
                                color: '#22c55e', 
                                fontSize: '2.5rem', 
                                fontWeight: '700', 
                                margin: '0 0 0.5rem 0',
                                letterSpacing: '-0.02em'
                            }}>
                                You Detected the Phish!
                            </h1>
                            
                            <p style={{ 
                                color: 'rgba(255,255,255,0.7)', 
                                fontSize: '1.1rem',
                                maxWidth: '500px',
                                margin: '0 auto 1rem auto'
                            }}>
                                {currentSimulation?.title || 'Simulation'} — Correctly identified as Phishing
                            </p>
                            
                            {/* Achievement badge - REMOVED the +50 points text */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(34,197,94,0.15)',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '2rem',
                                marginTop: '0.5rem'
                            }}>
                                <FontAwesomeIcon icon={faTrophy} style={{ color: '#F97316' }} />
                                <span style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: '600' }}>
                                    Excellent Detection!
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Flags Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Technical Red Flags Section */}
                        {technicalFlags.length > 0 && (
                            <div style={{
                                backgroundColor: '#132B44',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #ef4444', // Red left border
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                            }}>
                                {/* Section Header - Clickable */}
                                <div 
                                    onClick={() => toggleSection('technical')}
                                    style={{
                                        backgroundColor: '#1a3a4f',
                                        padding: '1.25rem 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        borderBottom: expandedSections.technical ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '4px',
                                            height: '24px',
                                            background: 'linear-gradient(180deg, #ef4444, #f87171)', // Red gradient
                                            borderRadius: '2px'
                                        }} />
                                        <FontAwesomeIcon icon={faFlag} style={{ color: '#ef4444', fontSize: '1.1rem' }} /> {/* Red icon */}
                                        <h2 style={{ 
                                            fontSize: '1.2rem', 
                                            fontWeight: '600', 
                                            color: 'white',
                                            margin: 0
                                        }}>
                                            Technical Red Flags
                                        </h2>
                                        <span style={{
                                            backgroundColor: '#ef4444', // Red badge
                                            color: 'white',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {technicalFlags.length}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon 
                                        icon={expandedSections.technical ? faChevronUp : faChevronDown} 
                                        style={{ color: '#ef4444', fontSize: '1rem' }} // Red chevron
                                    />
                                </div>

                                {/* Section Content */}
                                {expandedSections.technical && (
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {technicalFlags.map((flag, i) => (
                                                <FlagCard key={i} type="technical" title={flag.title} description={flag.description} />
                                            ))}
                                        </div>
                                        
                                        {/* Success tip */}
                                        <div style={{
                                            marginTop: '1.5rem',
                                            padding: '1rem',
                                            backgroundColor: 'rgba(239,68,68,0.1)',
                                            borderRadius: '0.75rem',
                                            border: '1px solid rgba(239,68,68,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem'
                                        }}>
                                            <FontAwesomeIcon icon={faLightbulb} style={{ color: '#ef4444' }} />
                                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                                Great eye! You spotted technical indicators like suspicious links and mismatched domains.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Psychological Manipulation Section */}
                        {psychologicalFlags.length > 0 && (
                            <div style={{
                                backgroundColor: '#132B44',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                borderTop: '1px solid #F97316',
                                borderBottom: '1px solid #F97316',
                                borderLeft: '4px solid #F97316',
                                borderRight: 'none',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
                            }}>
                                {/* Section Header - Clickable */}
                                <div 
                                    onClick={() => toggleSection('psychological')}
                                    style={{
                                        backgroundColor: '#1a3a4f',
                                        padding: '1.25rem 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        borderBottom: expandedSections.psychological ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '4px',
                                            height: '24px',
                                            background: 'linear-gradient(180deg, #F97316, #fbbf24)',
                                            borderRadius: '2px'
                                        }} />
                                        <FontAwesomeIcon icon={faGhost} style={{ color: '#F97316', fontSize: '1.1rem' }} /> {/* Changed from faBrain to faMask */}
                                        <h2 style={{ 
                                            fontSize: '1.2rem', 
                                            fontWeight: '600', 
                                            color: 'white',
                                            margin: 0
                                        }}>
                                            Psychological Manipulation
                                        </h2>
                                        <span style={{
                                            backgroundColor: '#F97316',
                                            color: 'white',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {psychologicalFlags.length}
                                        </span>
                                    </div>
                                    <FontAwesomeIcon 
                                        icon={expandedSections.psychological ? faChevronUp : faChevronDown} 
                                        style={{ color: '#F97316', fontSize: '1rem' }}
                                    />
                                </div>

                                {/* Section Content */}
                                {expandedSections.psychological && (
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {psychologicalFlags.map((flag, i) => (
                                                <FlagCard key={i} type="psychological" title={flag.title} description={flag.description} />
                                            ))}
                                        </div>
                                        
                                        {/* Success tip */}
                                        <div style={{
                                            marginTop: '1.5rem',
                                            padding: '1rem',
                                            backgroundColor: 'rgba(249,115,22,0.1)',
                                            borderRadius: '0.75rem',
                                            border: '1px solid rgba(249,115,22,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem'
                                        }}>
                                            <FontAwesomeIcon icon={faLightbulb} style={{ color: '#F97316' }} />
                                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                                You recognized psychological tactics like urgency and authority manipulation. Excellent awareness!
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions - Four buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginTop: '2.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '0.75rem 2rem',
                                borderRadius: '2rem',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            <FontAwesomeIcon icon={faHome} />
                            Dashboard
                        </button>
                        
                        <button
                            onClick={() => navigate('/analytics')}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid rgba(249,115,22,0.3)',
                                padding: '0.75rem 2rem',
                                borderRadius: '2rem',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(249,115,22,0.1)';
                                e.target.style.borderColor = '#F97316';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = 'rgba(249,115,22,0.3)';
                            }}
                        >
                            <FontAwesomeIcon icon={faChartLine} />
                            Analytics
                        </button>
                        
                        <button
                            onClick={() => navigate(simSlug ? `/simulations/${simSlug}` : '/simulations')}
                            style={{
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 2rem',
                                borderRadius: '2rem',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#fb923c';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 10px 20px -5px rgba(249,115,22,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#F97316';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <FontAwesomeIcon icon={faRotateRight} />
                            Try Again
                        </button>
                        
                        <button
                            onClick={() => {/* Next Page - to be handled by backend */}}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '1px solid #2DD4BF',
                                padding: '0.75rem 2rem',
                                borderRadius: '2rem',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(45,212,191,0.1)';
                                e.target.style.borderColor = '#2DD4BF';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = '#2DD4BF';
                            }}
                        >
                            Next Page
                            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                        </button>
                    </div>

                    <style>{`
                        @keyframes pulse-green {
                            0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
                            70% { box-shadow: 0 0 0 15px rgba(34,197,94,0); }
                            100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
                        }
                    `}</style>

                </main>
            </div>

            <Footer />
        </div>
    );
};

export default ResultsSuccess;