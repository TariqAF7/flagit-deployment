import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import CampaignModal from '../../components/admin/CampaignModal';
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../../api/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullhorn,
  faPlus,
  faEdit,
  faPause,
  faTrash,
  faEye,
  faCalendarAlt,
  faUsers,
  faTag,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const TrainingCampaigns = () => {
    const { adminActiveCampaigns, setAdminActiveCampaigns, adminPastCampaigns, setAdminPastCampaigns } = useAppStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [toast, setToast] = useState(null);

    // Toast helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

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
                showToast(`Campaign "${campaignData.name}" updated successfully.`);
            } else {
                const result = await createCampaign(campaignData);
                const c = result.campaign || result;
                setAdminActiveCampaigns([{ ...campaignData, id: c._id || Date.now() }, ...adminActiveCampaigns]);
                showToast(`Campaign "${campaignData.name}" created successfully.`);
            }
        } catch (err) {
            console.warn('Save campaign API failed, using local fallback:', err.message);
            if (editingCampaign) {
                setAdminActiveCampaigns(adminActiveCampaigns.map(c => c.id === editingCampaign.id ? { ...campaignData, id: editingCampaign.id } : c));
            } else {
                setAdminActiveCampaigns([{ ...campaignData, id: Date.now() }, ...adminActiveCampaigns]);
            }
            showToast('Campaign saved locally.', 'warning');
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCampaign(id);
            showToast('Campaign deleted successfully.');
        } catch (err) {
            console.warn('Delete campaign API failed, using local fallback:', err.message);
            showToast('Campaign deleted locally.', 'warning');
        }
        setAdminActiveCampaigns(adminActiveCampaigns.filter(c => c.id !== id));
    };

    const handlePause = (id) => {
        setAdminActiveCampaigns(adminActiveCampaigns.map(c => 
            c.id === id ? { ...c, status: 'Paused' } : c
        ));
        showToast('Campaign paused.', 'info');
    };

    const ProgressBar = ({ progress }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '60px', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    background: progress === 100 ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #F97316, #2DD4BF)'
                }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'white' }}>{progress}%</span>
        </div>
    );

    const StatusPill = ({ status }) => {
        const getStyles = () => {
            switch(status) {
                case 'Active':
                    return { bg: '#1e5f3a', color: '#4ade80', dot: '#4ade80' };
                case 'Paused':
                    return { bg: '#5f3a1e', color: '#fbbf24', dot: '#fbbf24' };
                case 'Completed':
                    return { bg: '#3a3a3a', color: '#94a3b8', dot: '#94a3b8' };
                default:
                    return { bg: '#3a3a3a', color: '#94a3b8', dot: '#94a3b8' };
            }
        };
        const s = getStyles();
        return (
            <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.3rem', 
                backgroundColor: s.bg, 
                color: s.color, 
                padding: '0.2rem 0.6rem', 
                borderRadius: '1rem', 
                fontSize: '0.75rem', 
                fontWeight: '600'
            }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.dot }}></div>
                {status}
            </div>
        );
    };

    // Toast component
    const Toast = ({ message, type = 'success', onDismiss }) => {
        const bg = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'info' ? '#3b82f6' : '#22c55e';
        return (
            <div style={{
                position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 500,
                backgroundColor: bg, color: 'white',
                padding: '0.85rem 1.25rem',
                borderRadius: '0.75rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontSize: '0.875rem', fontWeight: '600',
                maxWidth: '360px',
                animation: 'slideIn 0.25s ease',
            }}>
                {type === 'success' && <span>✓</span>}
                {type === 'error' && <span>⚠️</span>}
                {type === 'warning' && <span>⚠️</span>}
                {type === 'info' && <span>ℹ️</span>}
                <span style={{ flex: 1 }}>{message}</span>
                <button onClick={onDismiss} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0, opacity: 0.7 }}>✕</button>
            </div>
        );
    };

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
            <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
                <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

                <main className="main-content" style={{ 
                    backgroundColor: '#167f94', 
                    padding: '2rem', 
                    flex: 1, 
                    minHeight: '100vh', 
                    overflowY: 'auto' 
                }}>

                    {/* Custom Header with gradient lines and icon */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '2rem',
                        width: '100%'
                    }}>
                        {/* Left spacer for centering */}
                        <div style={{ width: '180px' }}></div>

                        {/* Centered title section */}
                        <div style={{ 
                            textAlign: 'center',
                            flex: 1
                        }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    width: '4px',
                                    height: '32px',
                                    background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                                    borderRadius: '2px'
                                }} />
                                <FontAwesomeIcon icon={faBullhorn} style={{ color: '#F97316', fontSize: '2rem' }} />
                                <h1 style={{ 
                                    fontSize: '2.2rem', 
                                    fontWeight: '700', 
                                    color: 'white',
                                    margin: 0,
                                    letterSpacing: '-0.02em'
                                }}>
                                    Training Campaigns
                                </h1>
                                <div style={{
                                    width: '4px',
                                    height: '32px',
                                    background: 'linear-gradient(180deg, #2DD4BF, #F97316)',
                                    borderRadius: '2px'
                                }} />
                            </div>
                            <p style={{ 
                                color: 'rgba(255,255,255,0.9)', 
                                fontSize: '1rem',
                                margin: 0
                            }}>
                                Create and manage security awareness training campaigns for your organization
                            </p>
                        </div>

                        {/* Right side - Last Updated */}
                        <div style={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '2rem',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            width: '180px',
                            textAlign: 'right'
                        }}>
                            <div style={{ fontWeight: '600', color: 'white' }}>Last Updated</div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Today, 3:42 PM</div>
                        </div>
                    </div>

                    {/* Create New Campaign Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <button
                            onClick={handleAdd}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '2rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#fb923c';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 10px 20px -5px rgba(249,115,22,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#F97316';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Create New Campaign
                        </button>
                    </div>

                    {/* Active Campaigns Section - No grid line */}
                    <div style={{ 
                        textAlign: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '600', 
                            color: 'white',
                            margin: 0
                        }}>
                            Active Campaigns
                        </h2>
                        <p style={{ 
                            color: 'rgba(255,255,255,0.8)', 
                            fontSize: '0.95rem',
                            marginTop: '0.25rem'
                        }}>
                            Currently running training campaigns
                        </p>
                    </div>

                    {/* Active Campaigns Table */}
                    <div style={{ 
                        backgroundColor: '#132B44',
                        borderRadius: '1rem', 
                        padding: '1.5rem', 
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                        marginBottom: '3rem', 
                        overflowX: 'auto' 
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Campaign Name</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Target Group</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Scenario Type</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Schedule</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Progress</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminActiveCampaigns.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1.25rem 0', fontWeight: '600', color: 'white' }}>{c.name}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{c.targetGroup}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{c.scenarioType}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{c.schedule}</td>
                                        <td style={{ padding: '1.25rem 0' }}><StatusPill status={c.status} /></td>
                                        <td style={{ padding: '1.25rem 0' }}><ProgressBar progress={c.progress} /></td>
                                        <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button 
                                                    onClick={() => handleEdit(c)} 
                                                    style={{ 
                                                        border: 'none', 
                                                        background: 'rgba(249,115,22,0.15)', 
                                                        color: '#F97316',
                                                        padding: '0.4rem',
                                                        borderRadius: '0.4rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.3)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.15)'}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button 
                                                    onClick={() => handlePause(c.id)}
                                                    style={{ 
                                                        border: 'none', 
                                                        background: 'rgba(255,255,255,0.1)', 
                                                        color: 'rgba(255,255,255,0.8)',
                                                        padding: '0.4rem',
                                                        borderRadius: '0.4rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                                >
                                                    <FontAwesomeIcon icon={faPause} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(c.id)} 
                                                    style={{ 
                                                        border: 'none', 
                                                        background: 'rgba(239,68,68,0.15)', 
                                                        color: '#ef4444',
                                                        padding: '0.4rem',
                                                        borderRadius: '0.4rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.3)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {adminActiveCampaigns.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }} />
                                <p style={{ margin: 0, fontWeight: '600', color: 'white' }}>No active campaigns.</p>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Click "Create New Campaign" to get started.</p>
                            </div>
                        )}
                    </div>

                    {/* Past Campaigns Section - No grid line */}
                    <div style={{ 
                        textAlign: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '600', 
                            color: 'white',
                            margin: 0
                        }}>
                            Past Campaigns
                        </h2>
                        <p style={{ 
                            color: 'rgba(255,255,255,0.8)', 
                            fontSize: '0.95rem',
                            marginTop: '0.25rem'
                        }}>
                            Completed training campaigns
                        </p>
                    </div>

                    {/* Past Campaigns Table */}
                    <div style={{ 
                        backgroundColor: '#132B44',
                        borderRadius: '1rem', 
                        padding: '1.5rem', 
                        borderTop: '1px solid #F97316',
                        borderBottom: '1px solid #F97316',
                        borderLeft: '4px solid #F97316',
                        borderRight: 'none',
                        boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
                        overflowX: 'auto' 
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Campaign Name</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Target Group</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Scenario Type</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Schedule</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600' }}>Progress</th>
                                    <th style={{ padding: '1rem 0', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminPastCampaigns.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1.25rem 0', fontWeight: '600', color: 'white' }}>{c.name}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{c.targetGroup}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{c.scenarioType}</td>
                                        <td style={{ padding: '1.25rem 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{c.schedule}</td>
                                        <td style={{ padding: '1.25rem 0' }}><StatusPill status={c.status} /></td>
                                        <td style={{ padding: '1.25rem 0' }}><ProgressBar progress={c.progress} /></td>
                                        <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button 
                                                    style={{ 
                                                        border: 'none', 
                                                        background: 'rgba(255,255,255,0.1)', 
                                                        color: 'rgba(255,255,255,0.8)',
                                                        padding: '0.4rem',
                                                        borderRadius: '0.4rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button 
                                                    style={{ 
                                                        border: 'none', 
                                                        background: 'rgba(239,68,68,0.15)', 
                                                        color: '#ef4444',
                                                        padding: '0.4rem',
                                                        borderRadius: '0.4rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.3)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
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

            {toast && (
                <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
            )}

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(1rem); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @media (min-width: 768px) {
                    .hamburger { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default TrainingCampaigns;