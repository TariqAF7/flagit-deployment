import React, { useState, useEffect } from 'react';

const CampaignModal = ({ isOpen, onClose, onSave, campaign }) => {
    const [formData, setFormData] = useState({
        name: '',
        targetGroup: 'All Employees',
        scenarioType: 'Phishing Email',
        schedule: '',
        status: 'Active',
        progress: 0
    });

    useEffect(() => {
        if (campaign) {
            setFormData({ ...campaign });
        } else {
            setFormData({ name: '', targetGroup: 'All Employees', scenarioType: 'Phishing Email', schedule: '', status: 'Active', progress: 0 });
        }
    }, [campaign, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" style={{ zIndex: 100 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--deep-navy)' }}>
                        {campaign ? 'Edit Campaign' : 'Create New Campaign'}
                    </h2>
                    <button type="button" onClick={onClose} style={{ padding: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Campaign Name</label>
                        <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Target Group</label>
                            <select className="form-input" value={formData.targetGroup} onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}>
                                <option>All Employees</option>
                                <option>IT Department</option>
                                <option>C-Suite</option>
                                <option>New Hires</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Scenario Type</label>
                            <select className="form-input" value={formData.scenarioType} onChange={(e) => setFormData({ ...formData, scenarioType: e.target.value })}>
                                <option>Phishing Email</option>
                                <option>Social Engineering</option>
                                <option>Malware Detection</option>
                                <option>Mixed Scenarios</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Schedule Date</label>
                        <input type="date" className="form-input" required value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Status</label>
                        <select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <option>Active</option>
                            <option>Paused</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn btn-white" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-teal">Save Campaign</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignModal;
