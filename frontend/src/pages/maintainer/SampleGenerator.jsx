import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import MaintainerSidebar from '../../components/maintainer/MaintainerSidebar';
import MaintainerTopBar from '../../components/maintainer/MaintainerTopBar';
import { fetchSamples, generateSamples as generateSamplesAPI } from '../../api/maintainer';

const SampleGenerator = () => {
    const { aiSamples, setAiSamples } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('Never');
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        attackType: 'Credential Theft',
        tactic: 'Urgency',
        brand: ''
    });

    const activeCount = aiSamples.length;

    // Load existing samples on mount
    useEffect(() => {
        fetchSamples()
            .then(samples => {
                if (Array.isArray(samples)) {
                    setAiSamples(samples.map(s => ({
                        id: s._id,
                        subject: s.subject,
                        content: s.content,
                        type: s.attackType,
                        tactic: s.tactic,
                        brand: s.brand,
                        date: s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 16).replace('T', ' ') : '',
                    })));
                    if (samples.length > 0) setLastUpdated('Previously');
                }
            })
            .catch(err => console.warn('Failed to load samples:', err.message));
    }, []);

    const generateSamples = async () => {
        setIsGenerating(true);
        try {
            const results = await generateSamplesAPI({
                attackType: formData.attackType,
                tactic: formData.tactic,
                brand: formData.brand || 'Random Brand',
                count: 10,
            });
            if (Array.isArray(results)) {
                const newSamples = results.map(s => ({
                    id: s._id || Date.now(),
                    subject: s.subject,
                    content: s.content,
                    type: s.attackType,
                    tactic: s.tactic,
                    brand: s.brand,
                    date: new Date().toISOString().slice(0, 16).replace('T', ' ')
                }));
                setAiSamples([...newSamples, ...aiSamples]);
            }
        } catch (err) {
            console.warn('Generate API failed, using local fallback:', err.message);
            const newSamples = Array.from({ length: 10 }).map((_, i) => {
                const brandText = formData.brand ? formData.brand : 'Random Brand';
                return {
                    id: Date.now() + i,
                    subject: `[${formData.tactic}] Important Update Regarding Your ${brandText} Account`,
                    content: `This is an AI generated ${formData.attackType} phishing sample utilizing ${formData.tactic} against ${brandText}. Please click the link to verify your identity.`,
                    type: formData.attackType,
                    tactic: formData.tactic,
                    brand: brandText,
                    date: new Date().toISOString().slice(0, 16).replace('T', ' ')
                };
            });
            setAiSamples([...newSamples, ...aiSamples]);
        } finally {
            setLastUpdated('Just now');
            setIsGenerating(false);
        }
    };

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <MaintainerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} currentStatusLabel="Generator operational" />

                <main className="main-content" style={{ backgroundColor: '#ffffff', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    <MaintainerTopBar
                        title="AI Phishing Sample Generator"
                        activeCount={activeCount}
                        activeLabel="Samples Generated"
                        lastUpdatedText={lastUpdated}
                        toggleSidebar={() => setSidebarOpen(true)}
                    />

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: 'white', marginBottom: '2rem' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0', color: 'var(--deep-navy)' }}>Generate New Samples</h2>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Attack Type</label>
                                    <select className="form-input" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }} value={formData.attackType} onChange={(e) => setFormData({ ...formData, attackType: e.target.value })}>
                                        <option>Credential Theft</option>
                                        <option>Invoice Fraud</option>
                                        <option>Account Recovery</option>
                                        <option>MFA Reset</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Psychological Tactic</label>
                                    <select className="form-input" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }} value={formData.tactic} onChange={(e) => setFormData({ ...formData, tactic: e.target.value })}>
                                        <option>Urgency</option>
                                        <option>Authority</option>
                                        <option>Fear</option>
                                        <option>Curiosity</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Brand Impersonation</label>
                                    <input type="text" className="form-input" placeholder="Enter brand name or leave empty for random" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                                </div>
                            </div>

                            <button
                                onClick={generateSamples}
                                disabled={isGenerating}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--accent-orange)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                                    opacity: isGenerating ? 0.7 : 1,
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                {isGenerating ? 'Generating AI Samples...' : 'Generate AI Samples'}
                            </button>
                        </div>
                    </div>

                    {isGenerating ? (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'inline-block', border: '4px solid #f3f3f3', borderTop: '4px solid var(--accent-orange)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--deep-navy)' }}>Generating Models...</h3>
                            <p style={{ fontSize: '0.875rem' }}>Please wait while AI synthesizes new phishing samples.</p>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : aiSamples.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#94a3b8' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--deep-navy)' }}>No samples generated yet</h3>
                            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.875rem' }}>Configure your parameters above and click 'Generate AI Samples' to create phishing samples for training.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {aiSamples.map((sample) => (
                                <div key={sample.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.25rem', backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--deep-navy)' }}>{sample.subject}</h3>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sample.date}</div>
                                    </div>
                                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{sample.content}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>{sample.type}</span>
                                        <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>{sample.tactic}</span>
                                        <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 'bold' }}>{sample.brand}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </main>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .hamburger { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default SampleGenerator;
