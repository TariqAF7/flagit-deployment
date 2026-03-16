import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope,
    faComment,
    faComments,
    faPhone,
    faMicrophone,
    faRobot,
    faLink,
    faShieldHalved,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Email Simulation Component
const EmailSimulation = ({ email, senderInitial, handleEmailBodyClick }) => (
    <>
        {/* Email Header */}
        <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e2e8f0'
        }}>
            <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#0f172a',
                margin: '0 0 1.25rem 0'
            }}>
                {email.subject}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: '#F97316',
                        color: 'white',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: '600'
                    }}>
                        {senderInitial}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '1rem' }}>{email.senderName}</span>
                            <span style={{
                                backgroundColor: '#fee2e2',
                                color: '#ef4444',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '1rem',
                                fontSize: '0.65rem',
                                fontWeight: '600'
                            }}>
                                External
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>to me</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {email.senderEmail}
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Today, 2:47 PM</span>
                </div>
            </div>
        </div>

        {/* Email Body */}
        <div
            onClick={handleEmailBodyClick}
            style={{
                padding: '2rem',
                backgroundColor: '#fafaf9',
                color: '#334155',
                lineHeight: '1.8',
                fontSize: '0.95rem'
            }}
            dangerouslySetInnerHTML={{ __html: email.body || '' }}
        />
    </>
);

// Teams/Telegram Chat Simulation
const ChatSimulation = ({ chat, platform }) => (
    <div style={{
        padding: '2rem',
        backgroundColor: '#fafaf9',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
    }}>
        {/* Chat Header */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1.5rem'
        }}>
            <div style={{
                backgroundColor: platform === 'teams' ? '#6264A7' : '#2AABEE',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <FontAwesomeIcon icon={platform === 'teams' ? faComments : faComment} />
            </div>
            <div>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{chat.channelName || chat.groupName}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{chat.participants || '2 participants'}</div>
            </div>
        </div>

        {/* Chat Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chat.messages?.map((msg, idx) => (
                <div
                    key={idx}
                    style={{
                        display: 'flex',
                        justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                        marginBottom: '0.5rem'
                    }}
                >
                    {!msg.isUser && (
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#cbd5e1',
                            marginRight: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>
                            {msg.sender?.charAt(0)}
                        </div>
                    )}
                    <div style={{
                        maxWidth: '70%',
                        backgroundColor: msg.isUser ? '#F97316' : 'white',
                        color: msg.isUser ? 'white' : '#0f172a',
                        padding: '0.75rem 1rem',
                        borderRadius: msg.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: msg.isUser ? 'none' : '1px solid #e2e8f0'
                    }}>
                        {!msg.isUser && (
                            <div style={{ fontWeight: '600', fontSize: '0.75rem', marginBottom: '0.25rem', color: '#F97316' }}>
                                {msg.sender}
                            </div>
                        )}
                        <div style={{ fontSize: '0.9rem' }}>{msg.text}</div>
                        <div style={{ fontSize: '0.65rem', color: msg.isUser ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginTop: '0.25rem', textAlign: 'right' }}>
                            {msg.time || '2:47 PM'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Vishing (Voice) Simulation
const VishingSimulation = ({ call }) => (
    <div style={{
        padding: '3rem 2rem',
        backgroundColor: '#fafaf9',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    }}>
        {/* Call Interface */}
        <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            animation: 'pulse 2s infinite'
        }}>
            <FontAwesomeIcon icon={faPhone} style={{ color: 'white', fontSize: '3rem' }} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
            {call.callerName || 'Unknown Caller'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            {call.callerNumber || 'Call forwarded from "Security Team"'}
        </p>

        {/* Call Controls */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                }}>
                    <FontAwesomeIcon icon={faMicrophone} style={{ color: '#ef4444', fontSize: '1.5rem' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Mute</span>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                }}>
                    <FontAwesomeIcon icon={faMicrophone} style={{ color: '#16a34a', fontSize: '1.5rem' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Speaker</span>
            </div>
        </div>

        {/* Call Transcription */}
        {call.transcript && (
            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                width: '100%',
                maxWidth: '500px',
                textAlign: 'left'
            }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>Call Transcription:</div>
                <div style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {call.transcript}
                </div>
            </div>
        )}
    </div>
);

// Main Router Component
export const SimulationTypeRenderer = ({ type, content, senderInitial, handleEmailBodyClick }) => {
    switch (type) {
        case 'email':
            return <EmailSimulation 
                email={content} 
                senderInitial={senderInitial} 
                handleEmailBodyClick={handleEmailBodyClick} 
            />;
        
        case 'teams':
        case 'telegram':
            return <ChatSimulation chat={content} platform={type} />;
        
        case 'vishing':
            return <VishingSimulation call={content} />;
        
        default:
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                    <p>Unsupported simulation type</p>
                </div>
            );
    }
};