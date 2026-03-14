import React from 'react';

const ModuleCard = ({ title, description, progress, rating, icon }) => {
    return (
        <div className="card-teal flex-col flex" style={{ minWidth: '280px', flex: 1 }}>
            <div className="flex items-center gap-4 mb-4">
                <div style={{ backgroundColor: 'var(--accent-orange)', color: 'white', padding: '0.75rem', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon || <span style={{ fontWeight: 'bold' }}>{title.charAt(0)}</span>}
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{title}</h3>
                </div>
            </div>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, flex: 1, minHeight: '40px' }}>{description}</p>

            <div className="mt-4">
                <div className="flex justify-between text-xs" style={{ opacity: 0.9 }}>
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button className="btn btn-white" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '0.25rem 1rem', fontSize: '0.875rem' }}>
                    Continue
                </button>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>
                    <span>★</span> {rating}
                </div>
            </div>
        </div>
    );
};

export default ModuleCard;
