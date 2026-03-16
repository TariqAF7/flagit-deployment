import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope, 
    faComments, 
    faComment, 
    faPhone,
    faArrowRight 
} from '@fortawesome/free-solid-svg-icons';

const TestSimulations = () => {
    const [simType, setSimType] = useState('email');
    const navigate = useNavigate();

    // Mock data for each simulation type (stored in sessionStorage)
    const mockSimulations = {
        email: {
            _id: "mock-email-001",
            title: "Email Security Test",
            type: "email",
            timeLimit: 900,
            emailContent: {
                subject: "URGENT: Your Account Has Been Compromised",
                senderName: "Security Team",
                senderEmail: "security@company.com",
                body: `
                    <div style="font-family: Arial, sans-serif;">
                        <p>Dear User,</p>
                        <p>We have detected <strong style="color: #dc2626;">suspicious activity</strong> on your account from an unrecognized device in Russia.</p>
                        
                        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 1rem; margin: 1rem 0;">
                            <p style="font-weight: bold; margin: 0 0 0.5rem 0;">⚠️ IMMEDIATE ACTION REQUIRED</p>
                            <p style="margin: 0;">Your account will be suspended within 24 hours if not verified.</p>
                        </div>
                        
                        <p>Click here to verify your account: <a href="#">https://secure-verify.com/update</a></p>
                        
                        <p style="margin-top: 2rem;">Thank you,<br/>Security Department</p>
                    </div>
                `,
                timestamp: "Today, 2:47 PM"
            }
        },
        teams: {
            _id: "mock-teams-001",
            title: "Teams Security Alert",
            type: "teams",
            timeLimit: 600,
            content: {
                channelName: "IT Support Channel",
                participants: "You, John, Sarah",
                messages: [
                    { 
                        sender: "John (IT Support)", 
                        text: "Hi team, we're rolling out urgent security updates. Everyone needs to verify their accounts immediately.", 
                        time: "2:47 PM", 
                        isUser: false 
                    },
                    { 
                        sender: "Sarah (Security)", 
                        text: "Here's the verification link: https://teams-security-update.com/verify", 
                        time: "2:48 PM", 
                        isUser: false 
                    },
                    { 
                        sender: "You", 
                        text: "Is this legitimate? The link looks suspicious.", 
                        time: "2:49 PM", 
                        isUser: true 
                    },
                    { 
                        sender: "John (IT Support)", 
                        text: "Yes, it's urgent! Please verify now.", 
                        time: "2:50 PM", 
                        isUser: false 
                    }
                ]
            }
        },
        telegram: {
            _id: "mock-telegram-001",
            title: "Telegram Security Channel",
            type: "telegram",
            timeLimit: 600,
            content: {
                channelName: "Official Security Channel",
                participants: "125 members",
                messages: [
                    { 
                        sender: "Security Bot", 
                        text: "⚠️ URGENT: All users must verify their accounts immediately due to a security breach.", 
                        time: "2:47 PM", 
                        isUser: false 
                    },
                    { 
                        sender: "Security Bot", 
                        text: "Verification link: https://telegram-verify.ru/check", 
                        time: "2:47 PM", 
                        isUser: false 
                    },
                    { 
                        sender: "You", 
                        text: "This link looks suspicious. Is this real?", 
                        time: "2:48 PM", 
                        isUser: true 
                    },
                    { 
                        sender: "Admin", 
                        text: "Yes, it's urgent! Click now to avoid account suspension.", 
                        time: "2:49 PM", 
                        isUser: false 
                    }
                ]
            }
        },
        vishing: {
            _id: "mock-vishing-001",
            title: "Bank Security Call",
            type: "vishing",
            timeLimit: 300,
            content: {
                callerName: "Bank Security Department",
                callerNumber: "+1 (888) 555-0123",
                transcript: "This is your bank calling about suspicious activity on your account. We've detected multiple failed login attempts from an unrecognized device. Please press 1 to verify your identity, or press 2 to speak with a representative. Your account will be temporarily suspended in 24 hours if you don't respond. Press 3 to hear this message again. This is an automated security call. Do not share your PIN with anyone."
            }
        }
    };

    const handleStartTest = () => {
        // Store the mock data in sessionStorage
        sessionStorage.setItem('testMode', 'true');
        sessionStorage.setItem('testSimulation', JSON.stringify(mockSimulations[simType]));
        
        // Navigate to the simulation detail page with a test slug
        navigate(`/simulations/test-${simType}`);
    };

    const getIcon = () => {
        switch(simType) {
            case 'email': return faEnvelope;
            case 'teams': return faComments;
            case 'telegram': return faComment;
            case 'vishing': return faPhone;
            default: return faEnvelope;
        }
    };

    const getDescription = () => {
        switch(simType) {
            case 'email': return 'Gmail-style interface with sender info, subject line, and email body';
            case 'teams': return 'Microsoft Teams interface with chat bubbles, channel header, and message input';
            case 'telegram': return 'Telegram dark theme with chat list, message bubbles, and input area';
            case 'vishing': return 'Phone call interface with dialer, call controls, and live transcription';
            default: return '';
        }
    };

    return (
        <div style={{ 
            backgroundColor: '#167f94', 
            minHeight: '100vh',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '4px',
                        height: '40px',
                        background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                        borderRadius: '2px'
                    }} />
                    <FontAwesomeIcon icon={getIcon()} style={{ color: '#F97316', fontSize: '2rem' }} />
                    <h1 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700', 
                        color: '#0f172a',
                        margin: 0
                    }}>
                        Simulation Test Panel
                    </h1>
                </div>
                
                <p style={{ 
                    color: '#64748b', 
                    marginBottom: '2rem',
                    fontSize: '1rem',
                    marginLeft: '1.5rem'
                }}>
                    Select a simulation type to preview the UI
                </p>

                {/* Type Selection Grid */}
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    {['email', 'teams', 'telegram', 'vishing'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSimType(type)}
                            style={{
                                padding: '1.25rem',
                                backgroundColor: simType === type ? '#F97316' : '#f1f5f9',
                                color: simType === type ? 'white' : '#334155',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                                boxShadow: simType === type ? '0 10px 15px -3px rgba(249,115,22,0.3)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                if (simType !== type) {
                                    e.currentTarget.style.backgroundColor = '#e2e8f0';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (simType !== type) {
                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={
                                type === 'email' ? faEnvelope :
                                type === 'teams' ? faComments :
                                type === 'telegram' ? faComment :
                                faPhone
                            } />
                            {type}
                        </button>
                    ))}
                </div>

                {/* Preview Card */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <FontAwesomeIcon icon={getIcon()} style={{ color: '#F97316' }} />
                        <h3 style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: '600', 
                            color: '#0f172a',
                            margin: 0,
                            textTransform: 'capitalize'
                        }}>
                            {simType} Simulation
                        </h3>
                    </div>
                    
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        {getDescription()}
                    </p>
                    
                    {/* Launch Button */}
                    <button
                        onClick={handleStartTest}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: '#F97316',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fb923c';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(249,115,22,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F97316';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Launch {simType.charAt(0).toUpperCase() + simType.slice(1)} Simulation
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                {/* Tips Card */}
                <div style={{
                    backgroundColor: '#fff7ed',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #fed7aa'
                }}>
                    <h4 style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#9a3412',
                        marginBottom: '0.75rem'
                    }}>
                        🔍 Testing Checklist
                    </h4>
                    <ul style={{ 
                        margin: 0,
                        paddingLeft: '1.25rem',
                        color: '#92400e',
                        fontSize: '0.85rem',
                        lineHeight: '1.6'
                    }}>
                        <li>✓ Check all UI elements render correctly</li>
                        <li>✓ Verify spacing and alignment are consistent</li>
                        <li>✓ Test responsive behavior (resize browser)</li>
                        <li>✓ Ensure timer and header are visible</li>
                        <li>✓ Test both action buttons work</li>
                        <li>✓ Check that no content overflows</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TestSimulations;