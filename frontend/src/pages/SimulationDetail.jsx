import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { fetchSimulationBySlug } from '../api/simulations';
import { startSimulation } from '../api/simulations';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock,
    faFlag,
    faEnvelope,
    faExclamationTriangle,
    faArrowLeft,
    faCheckCircle,
    faInfoCircle,
    faTrash,
    faArchive,
    faReply,
    faForward,
    faEllipsisH,
    faStar,
    faComment,
    faComments,
    faPhone,
    faMicrophone,
    faRobot,
    faPaperPlane,
    faSearch,
    faBell,
    faUserCircle,
    faVideo,
    faUsers,
    faSmile,
    faImage,
    faLock
} from '@fortawesome/free-solid-svg-icons';

// ============================================
// EMAIL SIMULATION (Gmail Style)
// ============================================
const EmailSimulation = ({ email, senderInitial, handleEmailBodyClick }) => (
    <div style={{ backgroundColor: '#f6f8fc', width: '100%' }}>
        {/* Gmail-style Header */}
        <div style={{
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ color: '#5f6368', fontSize: '1.1rem' }} />
            <span style={{ color: '#5f6368', fontSize: '0.85rem', fontWeight: '500' }}>Gmail</span>
            <div style={{ flex: 1 }} />
            <FontAwesomeIcon icon={faSearch} style={{ color: '#5f6368', fontSize: '1.1rem', marginRight: '1rem' }} />
            <FontAwesomeIcon icon={faBell} style={{ color: '#5f6368', fontSize: '1.1rem', marginRight: '1rem' }} />
            <FontAwesomeIcon icon={faUserCircle} style={{ color: '#5f6368', fontSize: '1.5rem' }} />
        </div>

        {/* Email Thread View */}
        <div style={{ padding: '1.5rem 2rem', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}>
            {/* Email Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '400', 
                    color: '#202124',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.3'
                }}>
                    {email.subject || 'No Subject'}
                </h1>
                
                {/* Sender Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            backgroundColor: '#F97316',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: '600',
                            flexShrink: 0
                        }}>
                            {senderInitial}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                                <span style={{ fontWeight: '600', color: '#202124', fontSize: '1rem' }}>{email.senderName || 'Unknown Sender'}</span>
                                <span style={{ color: '#5f6368', fontSize: '0.85rem' }}>
                                    &lt;{email.senderEmail || 'unknown@email.com'}&gt;
                                </span>
                                <span style={{
                                    backgroundColor: '#f1f3f4',
                                    color: '#5f6368',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: '500'
                                }}>
                                    External
                                </span>
                            </div>
                            <div style={{ color: '#5f6368', fontSize: '0.8rem' }}>
                                to me
                            </div>
                        </div>
                    </div>
                    <div style={{ color: '#5f6368', fontSize: '0.85rem' }}>
                        {email.timestamp || 'Today, 2:47 PM'}
                    </div>
                </div>

                {/* Email Actions Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #e0e0e0',
                    marginTop: '1rem'
                }}>
                    <FontAwesomeIcon icon={faArchive} style={{ color: '#5f6368', cursor: 'pointer', fontSize: '1.1rem' }} />
                    <FontAwesomeIcon icon={faTrash} style={{ color: '#5f6368', cursor: 'pointer', fontSize: '1.1rem' }} />
                    <FontAwesomeIcon icon={faReply} style={{ color: '#5f6368', cursor: 'pointer', fontSize: '1.1rem' }} />
                    <FontAwesomeIcon icon={faForward} style={{ color: '#5f6368', cursor: 'pointer', fontSize: '1.1rem' }} />
                    <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#5f6368', cursor: 'pointer', fontSize: '1.1rem' }} />
                </div>
            </div>

            {/* Email Body */}
            <div
                onClick={handleEmailBodyClick}
                style={{
                    padding: '0.5rem 0',
                    color: '#202124',
                    lineHeight: '1.6',
                    fontSize: '0.95rem',
                    width: '100%',
                    wordBreak: 'break-word'
                }}
                dangerouslySetInnerHTML={{ __html: email.body || '<p>No content available.</p>' }}
            />
        </div>
    </div>
);

// ============================================
// TEAMS SIMULATION (Microsoft Teams Style)
// ============================================
const TeamsSimulation = ({ chat }) => (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '500px', display: 'flex', width: '100%' }}>
        {/* Teams Left Sidebar */}
        <div style={{
            width: '72px',
            backgroundColor: '#2b2b2b',
            padding: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            flexShrink: 0
        }}>
            <FontAwesomeIcon icon={faComment} style={{ color: '#fff', fontSize: '1.3rem' }} />
            <FontAwesomeIcon icon={faUsers} style={{ color: '#a0a0a0', fontSize: '1.2rem' }} />
            <FontAwesomeIcon icon={faBell} style={{ color: '#a0a0a0', fontSize: '1.2rem' }} />
            <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#a0a0a0', fontSize: '1.2rem' }} />
        </div>

        {/* Teams Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Teams Header */}
            <div style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faComments} style={{ color: '#5f6368', fontSize: '1.1rem' }} />
                    <span style={{ fontWeight: '600', color: '#252525' }}>{chat.channelName || 'General'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#5f6368', fontSize: '0.9rem', cursor: 'pointer' }}>Posts</span>
                    <span style={{ color: '#5f6368', fontSize: '0.9rem', cursor: 'pointer' }}>Files</span>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FontAwesomeIcon icon={faVideo} style={{ color: '#5f6368', cursor: 'pointer', fontSize: '1.1rem' }} />
                    <FontAwesomeIcon icon={faUserCircle} style={{ color: '#5f6368', fontSize: '1.5rem' }} />
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#fff' }}>
                {chat.messages?.length > 0 ? chat.messages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '4px',
                            backgroundColor: msg.sender === 'System' ? '#6264A7' : '#F97316',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            flexShrink: 0
                        }}>
                            {msg.sender?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '600', color: '#252525', fontSize: '0.9rem' }}>{msg.sender || 'Unknown'}</span>
                                <span style={{ fontSize: '0.7rem', color: '#5f6368' }}>{msg.time || '2:47 PM'}</span>
                            </div>
                            <div style={{ color: '#252525', fontSize: '0.9rem', lineHeight: '1.5', wordBreak: 'break-word' }}>{msg.text}</div>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
                        No messages to display
                    </div>
                )}
            </div>

            {/* Teams Message Input */}
            <div style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#fff',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <FontAwesomeIcon icon={faSmile} style={{ color: '#5f6368', fontSize: '1.1rem' }} />
                <FontAwesomeIcon icon={faImage} style={{ color: '#5f6368', fontSize: '1.1rem' }} />
                <div style={{
                    flex: 1,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '20px',
                    padding: '0.6rem 1rem',
                    color: '#5f6368',
                    fontSize: '0.9rem',
                    minWidth: '200px'
                }}>
                    Type a message...
                </div>
                <FontAwesomeIcon icon={faPaperPlane} style={{ color: '#F97316', fontSize: '1.1rem', cursor: 'pointer' }} />
            </div>
        </div>
    </div>
);

// ============================================
// TELEGRAM SIMULATION (Telegram Style)
// ============================================
const TelegramSimulation = ({ chat }) => (
    <div style={{ backgroundColor: '#1e2b39', minHeight: '500px', display: 'flex', width: '100%' }}>
        {/* Telegram Sidebar */}
        <div style={{
            width: '280px',
            backgroundColor: '#17212b',
            borderRight: '1px solid #0e1621',
            flexShrink: 0
        }}>
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #0e1621',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <FontAwesomeIcon icon={faComment} style={{ color: '#fff', fontSize: '1.1rem' }} />
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>Telegram</span>
            </div>
            <div style={{ padding: '0.75rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: i === 1 ? '#2b5278' : 'transparent',
                        marginBottom: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#2b5278',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            flexShrink: 0
                        }}>
                            {i === 1 ? 'G' : i === 2 ? 'C' : 'S'}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ color: '#fff', fontWeight: '500', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {i === 1 ? 'General Chat' : i === 2 ? 'Security Channel' : 'Support Group'}
                            </div>
                            <div style={{ color: '#6c7883', fontSize: '0.65rem' }}>
                                {i === 1 ? '2 participants' : i === 2 ? '15 members' : '5 members'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Telegram Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Chat Header */}
            <div style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#17212b',
                borderBottom: '1px solid #0e1621',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#2b5278',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: '600',
                    flexShrink: 0
                }}>
                    G
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>General Chat</div>
                    <div style={{ color: '#6c7883', fontSize: '0.7rem' }}>online</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#6c7883', fontSize: '1rem', cursor: 'pointer' }} />
                    <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#6c7883', fontSize: '1rem', cursor: 'pointer' }} />
                </div>
            </div>

            {/* Telegram Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#0e1621' }}>
                {chat.messages?.length > 0 ? chat.messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                            marginBottom: '1rem'
                        }}
                    >
                        {!msg.isUser && (
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#2b5278',
                                marginRight: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                flexShrink: 0
                            }}>
                                {msg.sender?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div style={{
                            maxWidth: '70%',
                            backgroundColor: msg.isUser ? '#2b5278' : '#17212b',
                            color: '#fff',
                            padding: '0.6rem 1rem',
                            borderRadius: msg.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            wordBreak: 'break-word'
                        }}>
                            {!msg.isUser && (
                                <div style={{ fontWeight: '600', fontSize: '0.75rem', marginBottom: '0.2rem', color: '#F97316' }}>
                                    {msg.sender || 'Unknown'}
                                </div>
                            )}
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.text}</div>
                            <div style={{ fontSize: '0.6rem', color: '#6c7883', marginTop: '0.2rem', textAlign: 'right' }}>
                                {msg.time || '2:47 PM'}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', color: '#6c7883', padding: '3rem' }}>
                        No messages to display
                    </div>
                )}
            </div>

            {/* Telegram Input */}
            <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#17212b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap'
            }}>
                <FontAwesomeIcon icon={faSmile} style={{ color: '#6c7883', fontSize: '1rem' }} />
                <div style={{
                    flex: 1,
                    backgroundColor: '#0e1621',
                    borderRadius: '20px',
                    padding: '0.6rem 1rem',
                    color: '#6c7883',
                    fontSize: '0.9rem',
                    minWidth: '150px'
                }}>
                    Type a message...
                </div>
                <FontAwesomeIcon icon={faPaperPlane} style={{ color: '#F97316', fontSize: '1rem', cursor: 'pointer' }} />
            </div>
        </div>
    </div>
);

// ============================================
// VISHING SIMULATION (Phone Call Style)
// ============================================
const VishingSimulation = ({ call }) => {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e3c5f 0%, #0f2a44 100%)',
            minHeight: '500px',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '420px',
                padding: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}>
                {/* Call Status */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        backgroundColor: isRecording ? '#4ade80' : '#F97316',
                        margin: '0 auto 1rem auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                        boxShadow: isRecording ? '0 0 20px rgba(74,222,128,0.5)' : '0 0 20px rgba(249,115,22,0.3)'
                    }}>
                        <FontAwesomeIcon 
                            icon={faPhone} 
                            style={{ 
                                color: 'white', 
                                fontSize: '2.2rem'
                            }} 
                        />
                    </div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.2rem' }}>
                        {call.callerName || 'Security Department'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        {call.callerNumber || '+1 (888) 555-0123'}
                    </p>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.2rem 1rem',
                        backgroundColor: isRecording ? '#dcfce7' : '#fee2e2',
                        color: isRecording ? '#16a34a' : '#ef4444',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        {isRecording ? 'Call Recording • Live' : 'Incoming Call • Simulated'}
                    </div>
                </div>

                {/* Call Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setIsRecording(!isRecording)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: 0
                        }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: isRecording ? '#fee2e2' : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.3rem',
                            transition: 'all 0.3s'
                        }}>
                            <FontAwesomeIcon 
                                icon={faMicrophone} 
                                style={{ 
                                    color: isRecording ? '#ef4444' : '#64748b',
                                    fontSize: '1.1rem'
                                }} 
                            />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Mute</span>
                    </button>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: 0
                        }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.3rem'
                        }}>
                            <FontAwesomeIcon icon={faVideo} style={{ color: '#64748b', fontSize: '1.1rem' }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Video</span>
                    </button>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: 0
                        }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.3rem'
                        }}>
                            <FontAwesomeIcon icon={faUsers} style={{ color: '#64748b', fontSize: '1.1rem' }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Add</span>
                    </button>
                </div>

                {/* Call Timer */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    color: '#0f172a',
                    fontWeight: '500'
                }}>
                    {isRecording ? '03:42' : '00:00'}
                </div>

                {/* Live Transcription */}
                {call.transcript ? (
                    <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <FontAwesomeIcon icon={faRobot} style={{ color: '#F97316', fontSize: '0.9rem' }} />
                            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>Live Transcription</span>
                            {isRecording && (
                                <span style={{
                                    backgroundColor: '#F97316',
                                    color: 'white',
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '12px',
                                    fontSize: '0.6rem',
                                    fontWeight: '600'
                                }}>
                                    LIVE
                                </span>
                            )}
                        </div>
                        <div style={{
                            color: '#334155',
                            fontSize: '0.85rem',
                            lineHeight: '1.5',
                            maxHeight: '120px',
                            overflowY: 'auto',
                            paddingRight: '0.5rem'
                        }}>
                            {call.transcript}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        marginBottom: '0.5rem',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '0.85rem'
                    }}>
                        No transcription available
                    </div>
                )}

                {/* End Call Button */}
                <button
                    onClick={() => {}}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        marginTop: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                    End Call
                </button>
            </div>
        </div>
    );
};

// ============================================
// SIMULATION TYPE RENDERER
// ============================================
const SimulationTypeRenderer = ({ type, content, senderInitial, handleEmailBodyClick }) => {
    const typeLower = type?.toLowerCase() || '';
    
    if (typeLower === 'email' || typeLower === 'gmail') {
        return <EmailSimulation 
            email={content} 
            senderInitial={senderInitial} 
            handleEmailBodyClick={handleEmailBodyClick} 
        />;
    }
    
    if (typeLower === 'teams' || typeLower === 'microsoft teams') {
        return <TeamsSimulation chat={content} />;
    }
    
    if (typeLower === 'telegram') {
        return <TelegramSimulation chat={content} />;
    }
    
    if (typeLower === 'vishing' || typeLower === 'phone' || typeLower === 'call') {
        return <VishingSimulation call={content} />;
    }
    
    // Default fallback
    return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#F97316' }} />
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Unsupported simulation type: {type}</p>
            <p style={{ fontSize: '0.85rem' }}>Please check your simulation configuration.</p>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
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

    useEffect(() => {
        const load = async () => {
            try {
                // Check if we're in test mode
                const isTestMode = sessionStorage.getItem('testMode') === 'true';
                
                if (isTestMode) {
                    // Load mock data from sessionStorage
                    const mockSim = sessionStorage.getItem('testSimulation');
                    if (mockSim) {
                        const mockData = JSON.parse(mockSim);
                        console.log('🧪 Test Mode: Loading', mockData.type, 'simulation');
                        setSimulation(mockData);
                        setCurrentSimulation(mockData);
                        setTimeLeft(mockData.timeLimit || 900);
                        startTimeRef.current = Date.now();
                        setLoading(false);
                        
                        // Clear test mode flag
                        sessionStorage.removeItem('testMode');
                        return;
                    }
                }
                
                // Normal API call
                const sim = await fetchSimulationBySlug(slug);
                setSimulation(sim);
                setCurrentSimulation(sim);
                setTimeLeft(sim.timeLimit || 900);
                startTimeRef.current = Date.now();
                try { await startSimulation(sim._id); } catch {}
            } catch (err) {
                console.error('Failed to load simulation:', err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug, setCurrentSimulation]);

    useEffect(() => {
        if (!simulation || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleChoice('legit');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [simulation, timeLeft]);

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
        } finally {
            setSubmitting(false);
        }
    };

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

    const getPlatformIcon = () => {
        const type = simulation?.type?.toLowerCase() || '';
        if (type === 'teams' || type === 'microsoft teams') return faComments;
        if (type === 'telegram') return faComment;
        if (type === 'vishing' || type === 'phone' || type === 'call') return faPhone;
        return faEnvelope;
    };

    if (loading) {
        return (
            <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="dashboard-content">
                    <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
                    <main className="main-content" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', textAlign: 'center', paddingTop: '4rem' }}>
                        <div style={{ display: 'inline-block', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
                            <p style={{ color: '#64748b' }}>Loading simulation...</p>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    if (!simulation) {
        return (
            <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="dashboard-content">
                    <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
                    <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center', paddingTop: '4rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#F97316', fontSize: '3rem', marginBottom: '1rem' }} />
                            <h2 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '1rem' }}>Simulation not found</h2>
                            <button 
                                onClick={() => navigate('/simulations')}
                                style={{
                                    backgroundColor: '#F97316',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '2rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fb923c'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                            >
                                Back to Simulations
                            </button>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    const content = simulation.emailContent || simulation.content || {};
    const senderInitial = (content.senderName || 'S').charAt(0).toUpperCase();

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ 
                    maxWidth: '1000px', 
                    margin: '0 auto', 
                    width: '100%',
                    padding: '1.5rem'
                }}>

                    {/* Header - Platform specific */}
                    <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        backgroundColor: 'white',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        width: '100%',
                        boxSizing: 'border-box',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/simulations')}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#64748b',
                                    border: 'none',
                                    padding: '0.4rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                                    e.currentTarget.style.color = '#0f172a';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#64748b';
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.8rem' }} />
                                <span>Back</span>
                            </button>
                            <span style={{ color: '#cbd5e1' }}>|</span>
                            <FontAwesomeIcon icon={getPlatformIcon()} style={{ color: '#F97316', fontSize: '1rem' }} />
                            <span style={{ color: '#0f172a', fontWeight: '500', fontSize: '0.9rem' }}>
                                {simulation.title || 'Simulation'}
                            </span>
                        </div>

                        {/* Timer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FontAwesomeIcon icon={faClock} style={{ color: timeLeft <= 60 ? '#ef4444' : '#64748b', fontSize: '0.9rem' }} />
                            <span style={{ 
                                fontWeight: '600', 
                                fontSize: '0.95rem', 
                                color: timeLeft <= 60 ? '#ef4444' : '#0f172a'
                            }}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Simulation Content - Platform specific */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        marginBottom: '2rem',
                        width: '100%'
                    }}>
                        <SimulationTypeRenderer 
                            type={simulation.type || 'email'}
                            content={content}
                            senderInitial={senderInitial}
                            handleEmailBodyClick={handleEmailBodyClick}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginTop: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => handleChoice('phish')}
                            disabled={submitting}
                            style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.7rem 2rem',
                                borderRadius: '2rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                opacity: submitting ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.backgroundColor = '#dc2626';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.backgroundColor = '#ef4444';
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.85rem' }} />
                            Report Phishing
                        </button>
                        
                        <button
                            onClick={() => handleChoice('legit')}
                            disabled={submitting}
                            style={{
                                backgroundColor: 'white',
                                color: '#334155',
                                border: '1px solid #e2e8f0',
                                padding: '0.7rem 2rem',
                                borderRadius: '2rem',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                opacity: submitting ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10b981', fontSize: '0.85rem' }} />
                            Mark Legitimate
                        </button>
                    </div>

                    {/* Hint */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '1.5rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.75rem'
                    }}>
                        Take your time to analyze the content carefully.
                    </div>

                </main>
            </div>

            <Footer />
            
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .email-body a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                .email-body a:hover {
                    color: #1d4ed8;
                }
            `}</style>
        </div>
    );
};

export default SimulationDetail;