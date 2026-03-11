import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div style={{
            backgroundColor: '#132B44',
            borderRadius: '1rem',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: '4px solid #F97316',
            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(2px)';
            e.currentTarget.style.boxShadow = '0 12px 25px -8px rgba(249, 115, 22, 0.3)';
            e.currentTarget.style.borderLeftColor = '#fb923c';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.borderLeftColor = '#F97316';
        }}>
            <div style={{
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                borderRadius: '0.75rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F97316'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>{value}</div>
            </div>
        </div>
    );
};

export default StatCard;