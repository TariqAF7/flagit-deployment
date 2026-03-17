import React, { useState, useEffect } from 'react';

const SimulationModal = ({ isOpen, onClose, onSave, simulation }) => {
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        senderName: '',
        senderEmail: '',
        bodyContent: '',
        targetGroup: 'All Employees',
        category: 'Phishing',
        description: '',
        schedule: '',
        scheduleTime: '09:00',
        status: 'Pending',
        progress: 0,
    });

    useEffect(() => {
        if (simulation) {
            // Populate with existing data for editing
            const dt = simulation.schedule ? new Date(simulation.schedule) : null;
            setFormData({
                name: simulation.name || simulation.title || '',
                subject: simulation.subject || '',
                senderName: simulation.senderName || '',
                senderEmail: simulation.senderEmail || '',
                bodyContent: simulation.bodyContent || simulation.content || '',
                targetGroup: simulation.targetGroup || 'All Employees',
                category: simulation.category || 'Phishing',
                description: simulation.description || '',
                schedule: dt ? dt.toISOString().split('T')[0] : '',
                scheduleTime: dt ? dt.toTimeString().slice(0, 5) : '09:00',
                status: simulation.status || 'Pending',
                progress: simulation.progress || 0,
            });
        } else {
            setFormData({
                name: '',
                subject: '',
                senderName: '',
                senderEmail: '',
                bodyContent: '',
                targetGroup: 'All Employees',
                category: 'Phishing',
                description: '',
                schedule: '',
                scheduleTime: '09:00',
                status: 'Pending',
                progress: 0,
            });
        }
    }, [simulation, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Combine date + time into a single ISO string
        let combined = formData.schedule;
        if (formData.schedule && formData.scheduleTime) {
            combined = `${formData.schedule}T${formData.scheduleTime}`;
        }
        onSave({
            ...formData,
            schedule: combined,
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.7rem 1rem',
        border: '1.5px solid #e2e8f0',
        borderRadius: '0.6rem',
        fontSize: '0.875rem',
        color: 'var(--deep-navy, #1e3a5f)',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'border 0.2s',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#64748b',
        marginBottom: '0.35rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '1.25rem',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '560px',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--deep-navy, #1e3a5f)' }}>
                            {simulation ? (simulation._id || simulation.id ? 'Edit Simulation' : 'Launch New Simulation') : 'Create New Simulation'}
                        </h2>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                            {simulation ? 'Review parameters before launch' : 'Define simulation parameters'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '0.35rem', border: 'none', background: '#f1f5f9',
                            borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Simulation Name */}
                    <div style={{ marginBottom: '1.15rem' }}>
                        <label style={labelStyle}>Simulation Name</label>
                        <input
                            type="text"
                            style={inputStyle}
                            placeholder="e.g. March Spear Phishing Test"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Simulation Type (Category) */}
                    <div style={{ marginBottom: '1.15rem' }}>
                        <label style={labelStyle}>Simulation Type</label>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', color: '#1e293b', fontWeight: 600 }}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="Phishing"
                                    checked={formData.category === 'Phishing'}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ accentColor: '#ef4444' }}
                                />
                                Phishing Scenario
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', color: '#1e293b', fontWeight: 600 }}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="Normal"
                                    checked={formData.category === 'Normal'}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ accentColor: '#3b82f6' }}
                                />
                                Legitimate/Normal Scenario
                            </label>
                        </div>
                    </div>

                    {/* Simulation Description */}
                    <div style={{ marginBottom: '1.15rem' }}>
                        <label style={labelStyle}>Simulation Description</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                            placeholder="Provide internal notes or the goal for this simulation..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Manual Entry Fields for Simulation Appearance */}
                    <div style={{ marginBottom: '1.15rem' }}>
                        <label style={labelStyle}>Header (Subject Line)</label>
                        <input
                            type="text"
                            style={inputStyle}
                            placeholder="e.g. Action Required: Security Alert"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
                        <div>
                            <label style={labelStyle}>Username (Sender Name)</label>
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="e.g. IT Helpdesk"
                                value={formData.senderName}
                                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Sender Email</label>
                            <input
                                type="email"
                                style={inputStyle}
                                placeholder="e.g. support@scam-alert.com"
                                value={formData.senderEmail}
                                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.15rem' }}>
                        <label style={labelStyle}>Body Content</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '180px', resize: 'vertical', fontFamily: 'inherit' }}
                            placeholder="Type the main message content for the simulation here..."
                            value={formData.bodyContent}
                            onChange={(e) => setFormData({ ...formData, bodyContent: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1.15rem' }}>
                        <label style={labelStyle}>Target Group</label>
                        <select
                            style={inputStyle}
                            value={formData.targetGroup}
                            onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                        >
                            <option>All Employees</option>
                            <option>IT Department</option>
                            <option>Finance</option>
                            <option>HR</option>
                            <option>C-Suite</option>
                            <option>New Hires</option>
                        </select>
                    </div>

                    {/* Two-col: Date + Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
                        <div>
                            <label style={labelStyle}>Schedule Date</label>
                            <input
                                type="date"
                                style={inputStyle}
                                required
                                value={formData.schedule}
                                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Schedule Time</label>
                            <input
                                type="time"
                                style={inputStyle}
                                value={formData.scheduleTime}
                                onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={labelStyle}>Initial Status</label>
                        <select
                            style={inputStyle}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option>Pending</option>
                            <option>Active</option>
                            <option>Paused</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.65rem 1.25rem',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '0.6rem',
                                backgroundColor: 'white',
                                color: '#64748b',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '0.65rem 1.5rem',
                                border: 'none',
                                borderRadius: '0.6rem',
                                backgroundColor: '#F97316',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fb923c')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F97316')}
                        >
                            {simulation ? (simulation._id || simulation.id ? 'Save Changes' : 'Start Simulation') : 'Create Simulation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SimulationModal;
