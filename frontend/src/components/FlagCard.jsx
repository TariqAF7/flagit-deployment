import React from 'react';

const FlagCard = ({ type, title, description }) => {
    const isTechnical = type === 'technical';
    const bgColor = isTechnical ? '#fef2f2' : '#fef9c3'; // Light red vs Light yellow/orange
    const iconColor = isTechnical ? '#dc2626' : '#d97706';
    const textColor = isTechnical ? '#991b1b' : '#92400e';
    const titleColor = isTechnical ? '#dc2626' : '#d97706';

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: bgColor,
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            alignItems: 'flex-start'
        }}>
            <div style={{
                backgroundColor: iconColor,
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 'bold',
                fontSize: '0.875rem'
            }}>!</div>
            <div>
                <h4 style={{ color: titleColor, margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{title}</h4>
                <p style={{ color: textColor, margin: 0, fontSize: '0.875rem', lineHeight: '1.4' }}>{description}</p>
            </div>
        </div>
    );
};

export default FlagCard;
