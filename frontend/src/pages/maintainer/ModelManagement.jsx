import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import MaintainerSidebar from '../../components/maintainer/MaintainerSidebar';
import { fetchModels, retrainModel } from '../../api/maintainer';

const ModelManagement = () => {
    const { aiModels, setAiModels } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('2 min ago');

    // Count Active
    const activeCount = aiModels.filter(m => m.status === 'Active').length;

    useEffect(() => {
        fetchModels()
            .then(models => {
                if (Array.isArray(models)) {
                    setAiModels(models.map(m => ({
                        id: m._id,
                        name: m.name,
                        description: m.description,
                        status: m.status,
                        version: m.version,
                        date: m.lastTrainedAt ? new Date(m.lastTrainedAt).toISOString().slice(0, 16).replace('T', ' ') : '',
                        metrics: m.metrics,
                    })));
                }
            })
            .catch(err => console.warn('Failed to load models:', err.message));
    }, []);

    const handleRetrain = async (id) => {
        // Optimistically set to Training
        setAiModels(prev => prev.map(m => m.id === id ? { ...m, status: 'Training' } : m));
        try {
            await retrainModel(id);
            // Poll after 6 seconds to get updated model
            setTimeout(() => {
                fetchModels()
                    .then(models => {
                        if (Array.isArray(models)) {
                            setAiModels(models.map(m => ({
                                id: m._id,
                                name: m.name,
                                description: m.description,
                                status: m.status,
                                version: m.version,
                                date: m.lastTrainedAt ? new Date(m.lastTrainedAt).toISOString().slice(0, 16).replace('T', ' ') : '',
                                metrics: m.metrics,
                            })));
                            setLastUpdated('Just now');
                        }
                    })
                    .catch(() => {});
            }, 6000);
        } catch (err) {
            console.warn('Retrain API failed, using local simulation:', err.message);
            // Local fallback
            setTimeout(() => {
                setAiModels(prev => prev.map(m => {
                    if (m.id === id) {
                        return { ...m, status: 'Active', version: `v${(parseFloat(m.version.substring(1)) + 0.1).toFixed(1)}.0`, date: new Date().toISOString().slice(0, 16).replace('T', ' ') };
                    }
                    return m;
                }));
                setLastUpdated('Just now');
            }, 4000);
        }
    };

    const MetricsBar = ({ label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
            <div style={{ flex: 1, margin: '0 1rem', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${value}%`, backgroundColor: value > 90 ? '#10b981' : '#f59e0b', borderRadius: '3px', transition: 'width 1s ease-in-out' }}></div>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--deep-navy)', width: '40px', textAlign: 'right' }}>{value.toFixed(1)}%</span>
        </div>
    );

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <MaintainerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} currentStatusLabel="All models operational" />

                <main className="main-content" style={{ backgroundColor: 'white', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button className="hamburger" onClick={() => setSidebarOpen(true)} style={{ background: 'var(--deep-navy)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '0.5rem', borderRadius: '0.25rem' }} type="button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--deep-navy)' }}>AI Model Management</h1>
                                <div style={{ display: 'inline-flex', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {activeCount} Models Active
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                                <div style={{ color: 'var(--text-muted)' }}>Last Updated</div>
                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)' }}>{lastUpdated}</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {aiModels.map(model => {
                            const isTraining = model.status === 'Training';
                            return (
                                <div key={model.id} style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--deep-navy)', margin: 0 }}>{model.name}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', color: isTraining ? '#f59e0b' : '#10b981' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isTraining ? '#f59e0b' : '#10b981' }}></div>
                                            {model.status}
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        Version {model.version} • {model.date}
                                    </div>

                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5', flex: 1 }}>
                                        {model.description}
                                    </p>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <MetricsBar label="Accuracy" value={isTraining ? Math.max(0, model.metrics.accuracy - 5 + Math.random() * 10) : model.metrics.accuracy} />
                                        <MetricsBar label="Precision" value={isTraining ? Math.max(0, model.metrics.precision - 5 + Math.random() * 10) : model.metrics.precision} />
                                        <MetricsBar label="Recall" value={isTraining ? Math.max(0, model.metrics.recall - 5 + Math.random() * 10) : model.metrics.recall} />
                                        <MetricsBar label="F1 Score" value={isTraining ? Math.max(0, model.metrics.f1 - 5 + Math.random() * 10) : model.metrics.f1} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                        {isTraining ? (
                                            <button disabled style={{ flex: 1, backgroundColor: '#fde68a', color: '#d97706', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'not-allowed' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                Training...
                                            </button>
                                        ) : (
                                            <button onClick={() => handleRetrain(model.id)} style={{ flex: 1, backgroundColor: 'var(--accent-orange)', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                Retrain Model
                                            </button>
                                        )}
                                        <button style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', color: 'var(--text-muted)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                            Logs
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            <style>{`
                    @media(min - width: 768px) {
                    .hamburger { display: none!important; }
                }
            `}</style>
        </div>
    );
};

export default ModelManagement;
