import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import CampaignModal from '../../components/admin/CampaignModal';
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../../api/admin';

const TrainingCampaigns = () => {
    const { adminActiveCampaigns, setAdminActiveCampaigns, adminPastCampaigns, setAdminPastCampaigns } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    // Load campaigns from API on mount
    useEffect(() => {
        fetchCampaigns()
            .then(data => {
                if (data.active) setAdminActiveCampaigns(data.active.map(c => ({ ...c, id: c._id })));
                if (data.past) setAdminPastCampaigns(data.past.map(c => ({ ...c, id: c._id })));
            })
            .catch(err => console.warn('Failed to load campaigns:', err.message));
    }, []);

    const handleEdit = (campaign) => {
        setEditingCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCampaign(null);
        setIsModalOpen(true);
    };

    const handleSaveCampaign = async (campaignData) => {
        try {
            if (editingCampaign) {
                await updateCampaign(editingCampaign.id, campaignData);
                setAdminActiveCampaigns(adminActiveCampaigns.map(c => c.id === editingCampaign.id ? { ...campaignData, id: editingCampaign.id } : c));
            } else {
                const result = await createCampaign(campaignData);
                const c = result.campaign || result;
                setAdminActiveCampaigns([{ ...campaignData, id: c._id || Date.now() }, ...adminActiveCampaigns]);
            }
        } catch (err) {
            console.warn('Save campaign API failed, using local fallback:', err.message);
            if (editingCampaign) {
                setAdminActiveCampaigns(adminActiveCampaigns.map(c => c.id === editingCampaign.id ? { ...campaignData, id: editingCampaign.id } : c));
            } else {
                setAdminActiveCampaigns([{ ...campaignData, id: Date.now() }, ...adminActiveCampaigns]);
            }
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCampaign(id);
        } catch (err) {
            console.warn('Delete campaign API failed, using local fallback:', err.message);
        }
        setAdminActiveCampaigns(adminActiveCampaigns.filter(c => c.id !== id));
    };

    const ProgressBar = ({ progress }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: progress === 100 ? '#22c55e' : 'var(--accent-orange)' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{progress}%</span>
        </div>
    );

    const StatusPill = ({ status }) => {
        const isActive = status === 'Active';
        const isCompleted = status === 'Completed';
        const color = isActive ? '#22c55e' : (isCompleted ? '#64748b' : '#f59e0b');
        const bg = isActive ? '#dcfce7' : (isCompleted ? '#f1f5f9' : '#fef3c7');
        return (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: bg, color: color, padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }}></div>
                {status}
            </div>
        );
    };

    return (
        <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ backgroundColor: '#f1f5f9', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

                    <AdminTopBar
                        title="Training Simulation Management"
                        subtitle="Create and manage security awareness training campaigns for your organization"
                        toggleSidebar={() => setSidebarOpen(true)}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={handleAdd}
                        style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', backgroundColor: '#3b82f6', borderRadius: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create New Campaign
                    </button>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--deep-navy)' }}>Active Campaigns</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Currently running training campaigns</p>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '3rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Campaign Name</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Target Group</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Scenario Type</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Schedule</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Status</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Progress</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminActiveCampaigns.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1.25rem 0', fontWeight: 'bold', color: 'var(--deep-navy)' }}>{c.name}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.targetGroup}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.scenarioType}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.schedule}</td>
                                        <td style={{ padding: '1.25rem 0' }}><StatusPill status={c.status} /></td>
                                        <td style={{ padding: '1.25rem 0' }}><ProgressBar progress={c.progress} /></td>
                                        <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button onClick={() => handleEdit(c)} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                </button>
                                                <button style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                                </button>
                                                <button onClick={() => handleDelete(c.id)} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {adminActiveCampaigns.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No active campaigns.</div>
                        )}
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--deep-navy)' }}>Past Campaigns</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Completed training campaigns</p>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Campaign Name</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Target Group</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Scenario Type</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Schedule</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Status</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal' }}>Progress</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminPastCampaigns.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1.25rem 0', fontWeight: 'bold', color: 'var(--deep-navy)' }}>{c.name}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.targetGroup}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.scenarioType}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.schedule}</td>
                                        <td style={{ padding: '1.25rem 0' }}><StatusPill status={c.status} /></td>
                                        <td style={{ padding: '1.25rem 0' }}><ProgressBar progress={c.progress} /></td>
                                        <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                                <button style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCampaign}
                campaign={editingCampaign}
            />
        </div>
    );
};

export default TrainingCampaigns;
