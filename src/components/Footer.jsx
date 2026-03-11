import React from 'react';

const Footer = () => {
    return (
        <footer style={{ 
            marginTop: '2rem', 
            padding: '1.5rem 1.5rem 1.25rem 1.5rem', 
            borderTop: '1px solid rgba(249, 115, 22, 0.15)', 
            textAlign: 'center', 
            backgroundColor: '#0a1a2f'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '2rem', 
                marginBottom: '0.75rem' 
            }}>
                <a 
                    href="#" 
                    style={{ 
                        fontSize: '0.85rem', 
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#F97316'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                >
                    Privacy Policy
                </a>
                <a 
                    href="#" 
                    style={{ 
                        fontSize: '0.85rem', 
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#F97316'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                >
                    Terms of Service
                </a>
            </div>
            <p style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: '#F97316', 
                marginBottom: '0.35rem' 
            }}>
                Train smart. Stay safe.
            </p>
            <p style={{ 
                fontSize: '0.7rem', 
                color: 'rgba(255,255,255,0.4)' 
            }}>
                &copy; {new Date().getFullYear()} FlagIt. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;