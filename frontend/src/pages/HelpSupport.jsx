import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle,
  faEnvelope,
  faChevronDown,
  faChevronUp,
  faSearch,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const HelpSupport = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
        {
            question: "How do I know if an email is a phishing attempt?",
            answer: "Look for red flags like urgent language demanding immediate action, generic greetings (like 'Dear Customer' instead of your name), mismatched sender email addresses, suspicious links (hover before clicking), spelling errors, and requests for personal information. Our simulations train you to spot these indicators through real-world scenarios."
        },
        {
            question: "What should I do if I think I've encountered a real phishing attempt?",
            answer: "1. Do NOT click any links or download attachments\n2. Use the FlagIt extension to report it immediately\n3. Forward the suspicious email to your IT security team\n4. Delete the email from your inbox\n5. If you entered credentials, change your passwords immediately"
        },
        {
            question: "How are simulation results calculated?",
            answer: "Your resilience score is calculated based on multiple factors: accuracy in identifying phishing attempts (60%), response time (20%), and reporting behavior (20%). The more simulations you complete, the more accurate your score becomes. Your progress is tracked over time to show improvement."
        },
        {
            question: "Can I retake simulations?",
            answer: "Yes! You can retake any simulation as many times as you want. Each attempt helps reinforce your learning and build stronger detection habits. Your best score is saved, but you can see your improvement over time in the analytics dashboard."
        },
        {
            question: "How does the FlagIt Chrome extension work?",
            answer: "The extension automatically scans emails in Gmail, Outlook, and other platforms. When it detects potential phishing, it highlights suspicious elements and shows you why they're concerning. You can report false positives to help improve our AI."
        },
        {
            question: "What's the difference between 'Report as Phishing' and 'Mark as Legit'?",
            answer: "Use 'Report as Phishing' when you believe the email is a real threat - this helps train our AI. Use 'Mark as Legit' when you think it's a legitimate email that was incorrectly flagged. Both responses help improve the system's accuracy."
        }
    ];

    const quickTips = [
        { tip: "Always hover over links before clicking", icon: faCheckCircle },
        { tip: "Check sender email addresses carefully", icon: faCheckCircle },
        { tip: "Never share passwords via email", icon: faCheckCircle },
        { tip: "When in doubt, report it out", icon: faCheckCircle }
    ];

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-content">
                <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ 
                    maxWidth: '1000px', 
                    margin: '0 auto', 
                    width: '100%',
                    padding: '2rem'
                }}>
                    {/* Hero Section */}
                    <div style={{
                        backgroundColor: '#132B44',
                        borderRadius: '1.5rem',
                        padding: '3rem',
                        marginBottom: '3rem',
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 20px 30px -10px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Background decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-5%',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
                            zIndex: 0
                        }} />
                        
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: '4px',
                                    height: '40px',
                                    background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                                    borderRadius: '2px'
                                }} />
                                <FontAwesomeIcon icon={faQuestionCircle} style={{ color: '#F97316', fontSize: '2.5rem' }} />
                                <h1 style={{ 
                                    fontSize: '2.8rem', 
                                    fontWeight: '700', 
                                    color: 'white',
                                    margin: 0,
                                    letterSpacing: '-0.02em'
                                }}>
                                    Help & Support
                                </h1>
                                <div style={{
                                    width: '4px',
                                    height: '40px',
                                    background: 'linear-gradient(180deg, #2DD4BF, #F97316)',
                                    borderRadius: '2px'
                                }} />
                            </div>
                            <p style={{ 
                                color: 'rgba(255,255,255,0.8)', 
                                fontSize: '1.2rem',
                                maxWidth: '600px',
                                margin: '0 auto 2rem auto'
                            }}>
                                Find answers to common questions about FlagIT
                            </p>

                            {/* Search Bar */}
                            <div style={{
                                maxWidth: '500px',
                                margin: '0 auto',
                                position: 'relative'
                            }}>
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'rgba(255,255,255,0.4)',
                                        fontSize: '1rem'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '3rem',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                        e.target.style.borderColor = '#F97316';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Tips Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        marginBottom: '3rem'
                    }}>
                        {quickTips.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '0.5rem 1rem',
                                borderRadius: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <FontAwesomeIcon icon={item.icon} style={{ color: '#2DD4BF', fontSize: '0.8rem' }} />
                                <span style={{ color: 'white', fontSize: '0.85rem' }}>{item.tip}</span>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <h2 style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: '600', 
                        color: 'white',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <FontAwesomeIcon icon={faQuestionCircle} style={{ color: '#F97316' }} />
                        Frequently Asked Questions
                    </h2>

                    <div style={{
                        backgroundColor: '#132B44',
                        borderRadius: '1rem',
                        padding: '2rem',
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                        marginBottom: '3rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.02)',
                                            borderRadius: '0.75rem',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                    >
                                        <div style={{
                                            padding: '1.25rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: activeFaq === index ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                        }}>
                                            <span style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
                                                {faq.question}
                                            </span>
                                            <FontAwesomeIcon 
                                                icon={activeFaq === index ? faChevronUp : faChevronDown} 
                                                style={{ color: '#F97316', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                        {activeFaq === index && (
                                            <div style={{
                                                padding: '1.25rem',
                                                backgroundColor: 'rgba(255,255,255,0.01)'
                                            }}>
                                                <p style={{ 
                                                    color: 'rgba(255,255,255,0.7)', 
                                                    fontSize: '0.9rem', 
                                                    lineHeight: '1.6',
                                                    margin: 0,
                                                    whiteSpace: 'pre-line'
                                                }}>
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)' }}>
                                    <p>No FAQs match your search. Try different keywords.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Still Need Help Section */}
                    <div style={{
                        backgroundColor: '#132B44',
                        borderRadius: '1rem',
                        padding: '2.5rem',
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                            Still need help?
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                            Our support team is ready to assist you with any questions or issues.
                        </p>
                        <button
                            style={{
                                padding: '1rem 2.5rem',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#fb923c';
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#F97316';
                                e.target.style.transform = 'scale(1)';
                            }}
                            onClick={() => window.location.href = 'mailto:support@flagit.com'}
                        >
                            <FontAwesomeIcon icon={faEnvelope} />
                            Contact Support Team
                        </button>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default HelpSupport;