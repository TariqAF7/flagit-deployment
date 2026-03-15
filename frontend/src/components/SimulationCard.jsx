import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimulationCard = ({ id, slug, title, description, progress, rating, icon }) => {
    const navigate = useNavigate();

    return (
        <div className="card-teal flex-col flex" style={{ backgroundColor: 'var(--primary-teal)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex gap-4">
                <div style={{ backgroundColor: 'var(--accent-orange)', color: 'white', padding: '0.75rem', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {icon || <span style={{ fontWeight: 'bold' }}>{title.charAt(0)}</span>}
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'white' }}>{title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{description}</p>
                </div>
            </div>

            <div className="mt-8 flex-col flex gap-2">
                <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="progress-container" style={{ margin: 0, height: '4px' }}>
                    <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'var(--accent-orange)' }}></div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button onClick={() => navigate(`/simulations/${slug || id}`)} className="btn btn-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '2rem' }}>
                    Start
                </button>
                <div className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--accent-orange)' }}>
                    <span>★</span> {rating}
                </div>
            </div>
        </div>
    );
};

export default SimulationCard;
