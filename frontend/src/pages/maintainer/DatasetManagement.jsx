import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import MaintainerSidebar from '../../components/maintainer/MaintainerSidebar';
import MaintainerTopBar from '../../components/maintainer/MaintainerTopBar';
import { fetchDatasets, createDataset, deleteDataset, ingestDataset } from '../../api/maintainer';

const DatasetModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', source: 'API', type: 'CSV', size: '', records: '' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            name: formData.name,
            description: 'User initiated data ingestion',
            tags: [formData.type],
            size: formData.size + ' MB',
            records: formData.records,
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            source: formData.source,
            status: 'Processing'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" style={{ zIndex: 100 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--deep-navy)' }}>
                        Ingest New Data
                    </h2>
                    <button type="button" onClick={onClose} style={{ padding: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Dataset Name</label>
                        <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Source</label>
                            <select className="form-input" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                                <option>API</option>
                                <option>Manual Upload</option>
                                <option>Web Scraping</option>
                                <option>External Feed</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">File Type</label>
                            <select className="form-input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option>CSV</option>
                                <option>JSON</option>
                                <option>HTML</option>
                                <option>TXT</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Size (MB)</label>
                            <input type="number" className="form-input" required value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Total Records</label>
                            <input type="number" className="form-input" required value={formData.records} onChange={(e) => setFormData({ ...formData, records: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-white" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-teal">Start Ingestion</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DatasetManagement = () => {
    const { aiDatasets, setAiDatasets } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Load datasets from API on mount
    useEffect(() => {
        fetchDatasets()
            .then(datasets => {
                if (Array.isArray(datasets)) {
                    setAiDatasets(datasets.map(d => ({
                        id: d._id,
                        name: d.name,
                        description: d.description,
                        tags: d.tags,
                        size: d.size,
                        records: d.records,
                        date: d.lastUpdated ? new Date(d.lastUpdated).toISOString().slice(0, 16).replace('T', ' ') : '',
                        source: d.source,
                        status: d.status,
                    })));
                }
            })
            .catch(err => console.warn('Failed to load datasets:', err.message));
    }, []);

    const activeCount = aiDatasets.filter(d => d.status === 'Active').length;
    const filteredDatasets = aiDatasets.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleIngest = async (id) => {
        setAiDatasets(prev => prev.map(d => d.id === id ? { ...d, status: 'Processing' } : d));
        try {
            await ingestDataset(id);
        } catch (err) {
            console.warn('Ingest API failed:', err.message);
        }
        setTimeout(() => {
            setAiDatasets(prev => prev.map(d => d.id === id ? { ...d, status: 'Active', date: new Date().toISOString().slice(0, 16).replace('T', ' ') } : d));
        }, 3000);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this dataset?")) {
            try {
                await deleteDataset(id);
            } catch (err) {
                console.warn('Delete API failed:', err.message);
            }
            setAiDatasets(aiDatasets.filter(d => d.id !== id));
        }
    };

    const handleSaveNew = async (data) => {
        const optimisticEntry = { ...data, id: Date.now() };
        setAiDatasets([optimisticEntry, ...aiDatasets]);
        setIsModalOpen(false);
        try {
            const created = await createDataset(data);
            const d = created.dataset || created;
            // Replace optimistic entry with real DB entry
            setAiDatasets(prev => prev.map(x => x.id === optimisticEntry.id ? { ...data, id: d._id || optimisticEntry.id } : x));
            setTimeout(() => {
                setAiDatasets(prev => prev.map(x => x.id === (d._id || optimisticEntry.id) ? { ...x, status: 'Active' } : x));
            }, 3000);
        } catch (err) {
            console.warn('Create dataset API failed, using local fallback:', err.message);
            setTimeout(() => {
                setAiDatasets(prev => prev.map((d, i) => i === 0 ? { ...d, status: 'Active' } : d));
            }, 3000);
        }
    };

    const TagPill = ({ text }) => (
        <span style={{ backgroundColor: '#e2e8f0', color: 'var(--text-muted)', fontSize: '0.65rem', padding: '0.1rem 0.3rem', borderRadius: '0.2rem', fontWeight: 'bold' }}>{text}</span>
    );

    const SourceIndicator = ({ source }) => {
        let color = '#3b82f6';
        if (source === 'Manual Upload') color = '#f59e0b';
        if (source === 'Web Scraping') color = '#0f766e';
        if (source === 'External Feed') color = '#8b5cf6';

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }}></div>
                {source}
            </div>
        );
    };

    const StatusPill = ({ status }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: status === 'Active' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status === 'Active' ? '#10b981' : '#f59e0b' }}></div>
            {status}
        </div>
    );

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <MaintainerSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} currentStatusLabel="All datasets operational" />

                <main className="main-content" style={{ backgroundColor: '#ffffff', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    <MaintainerTopBar
                        title="Dataset Management"
                        activeCount={activeCount}
                        activeLabel="Datasets Active"
                        lastUpdatedText="2 min ago"
                        toggleSidebar={() => setSidebarOpen(true)}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
                            <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: 'var(--accent-orange)', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Ingest New Data
                            </button>
                            <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search datasets..."
                                    style={{ paddingLeft: '2.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', width: '100%' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>View:</span>
                                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', padding: '0.25rem' }}>
                                    <button style={{ backgroundColor: 'var(--primary-teal)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
                                    <button style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Filter:</span>
                                <select className="form-input" style={{ width: 'auto', backgroundColor: '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}><option>All Sources</option></select>
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', color: 'var(--deep-navy)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                    <th style={{ padding: '1rem', width: '40px' }}><input type="checkbox" /></th>
                                    <th style={{ padding: '1rem' }}>Dataset Name</th>
                                    <th style={{ padding: '1rem' }}>Size</th>
                                    <th style={{ padding: '1rem' }}>Records</th>
                                    <th style={{ padding: '1rem' }}>Last Updated</th>
                                    <th style={{ padding: '1rem' }}>Source</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDatasets.map(d => (
                                    <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                                        <td style={{ padding: '1rem' }}><input type="checkbox" /></td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', fontSize: '1rem' }}>{d.name}</div>
                                                <div style={{ display: 'flex', gap: '0.2rem' }}>{d.tags.map(t => <TagPill key={t} text={t} />)}</div>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '300px' }}>{d.description}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--deep-navy)', fontSize: '1rem' }}>{d.size.split(' ')[0]}</div>
                                            <div style={{ fontSize: '0.75rem' }}>{d.size.split(' ')[1]}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{d.records}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            <div>{d.date.split(' ')[0]}</div>
                                            <div style={{ fontSize: '0.75rem' }}>{d.date.split(' ')[1]}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}><SourceIndicator source={d.source} /></td>
                                        <td style={{ padding: '1rem' }}><StatusPill status={d.status} /></td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button style={{ border: '1px solid #e2e8f0', background: 'transparent', color: 'var(--text-muted)', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}>View</button>
                                                <button onClick={() => handleIngest(d.id)} disabled={d.status === 'Processing'} style={{ border: 'none', background: 'var(--primary-teal)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.75rem', cursor: d.status === 'Processing' ? 'not-allowed' : 'pointer', opacity: d.status === 'Processing' ? 0.5 : 1 }}>Ingest</button>
                                                <button onClick={() => handleDelete(d.id)} style={{ border: '1px solid #fee2e2', background: 'transparent', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredDatasets.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No datasets found.</div>
                        )}
                    </div>
                </main>
            </div>

            <DatasetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveNew} />
        </div>
    );
};

export default DatasetManagement;
