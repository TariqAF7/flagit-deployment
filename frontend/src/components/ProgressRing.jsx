import React, { useEffect, useState } from 'react';

const ProgressRing = ({ radius, stroke, progress, label, labelSub, textColor = 'white' }) => {
    const [offset, setOffset] = useState(0);
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    useEffect(() => {
        const strokeDashoffset = circumference - (progress / 100) * circumference;
        const timeout = setTimeout(() => {
            setOffset(strokeDashoffset);
        }, 100);
        return () => clearTimeout(timeout);
    }, [progress, circumference]);

    return (
        <div className="score-ring" style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="var(--accent-orange)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: offset === 0 ? circumference : offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: textColor,
                    lineHeight: '1.2'
                }}>
                    {progress}
                </div>
                <div style={{
                    fontSize: '1rem',
                    color: textColor === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                    fontWeight: 'bold',
                    marginTop: '4px'
                }}>
                    / 100
                </div>
                {label && (
                    <div style={{
                        fontSize: '0.9rem',
                        color: textColor === 'white' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        marginTop: '8px'
                    }}>
                        {label}
                    </div>
                )}
                {labelSub && (
                    <div style={{
                        fontSize: '0.8rem',
                        color: textColor === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                        fontWeight: 'normal',
                        marginTop: '4px'
                    }}>
                        {labelSub}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressRing;