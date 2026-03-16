import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope, 
    faComments, 
    faComment, 
    faPhone,
    faPlus,
    faEdit,
    faCopy,
    faTrash,
    faEye
} from '@fortawesome/free-solid-svg-icons';

const TemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [previewMode, setPreviewMode] = useState(false);

    // Mock templates for demonstration
    const mockTemplates = {
        email: [
            { id: 1, name: 'Urgent Security Alert', preview: 'Gmail style warning email', used: 45 },
            { id: 2, name: 'Account Suspension Notice', preview: 'Standard account threat', used: 32 },
            { id: 3, name: 'Payment Confirmation Scam', preview: 'Fake invoice template', used: 28 }
        ],
        teams: [
            { id: 4, name: 'IT Support Alert', preview: 'Teams channel security message', used: 23 },
            { id: 5, name: 'HR Document Request', preview: 'Fake HR message', used: 19 }
        ],
        telegram: [
            { id: 6, name: 'Security Channel Alert', preview: 'Telegram broadcast', used: 17 },
            { id: 7, name: 'Group Admin Warning', preview: 'Group chat scam', used: 12 }
        ],
        vishing: [
            { id: 8, name: 'Bank Security Call', preview: 'Automated voice scam', used: 31 },
            { id: 9, name: 'Tech Support Scam', preview: 'Fake Microsoft call', used: 24 }
        ]
    };

    return (
        <div style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
            <div style={{ display: 'flex' }}>
                <AdminSidebar isOpen={true} close={() => {}} />
                
                <main style={{ flex: 1, padding: '2rem' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>
                            Simulation Templates
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Create and manage reusable UI templates for different platforms
                        </p>
                    </div>

                    {/* Platform Filter */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        marginBottom: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {['all', 'email', 'teams', 'telegram', 'vishing'].map(platform => (
                            <button
                                key={platform}
                                onClick={() => setSelectedPlatform(platform)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: selectedPlatform === platform ? '#F97316' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '2rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {platform !== 'all' && (
                                    <FontAwesomeIcon icon={
                                        platform === 'email' ? faEnvelope :
                                        platform === 'teams' ? faComments :
                                        platform === 'telegram' ? faComment :
                                        faPhone
                                    } />
                                )}
                                {platform}
                            </button>
                        ))}
                        
                        <button
                            style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '2rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginLeft: 'auto'
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Create New Template
                        </button>
                    </div>

                    {/* Templates Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {(selectedPlatform === 'all' ? 
                            Object.entries(mockTemplates).flatMap(([platform, temps]) => 
                                temps.map(t => ({ ...t, platform }))
                            ) : 
                            mockTemplates[selectedPlatform]?.map(t => ({ ...t, platform: selectedPlatform })) || []
                        ).map(template => (
                            <div
                                key={template.id}
                                style={{
                                    backgroundColor: '#132B44',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    borderTop: '1px solid #F97316',
                                    borderBottom: '1px solid #F97316',
                                    borderLeft: '4px solid #F97316',
                                    boxShadow: '0 8px 20px -6px rgba(0,0,0,0.4)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <FontAwesomeIcon 
                                        icon={
                                            template.platform === 'email' ? faEnvelope :
                                            template.platform === 'teams' ? faComments :
                                            template.platform === 'telegram' ? faComment :
                                            faPhone
                                        } 
                                        style={{ color: '#F97316' }} 
                                    />
                                    <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>
                                        {template.name}
                                    </h3>
                                </div>
                                
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    {template.preview}
                                </p>
                                
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
                                    Used {template.used} times
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button style={{
                                        padding: '0.4rem 0.8rem',
                                        backgroundColor: 'rgba(249,115,22,0.15)',
                                        color: '#F97316',
                                        border: 'none',
                                        borderRadius: '0.4rem',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}>
                                        <FontAwesomeIcon icon={faEdit} />
                                        Edit
                                    </button>
                                    <button style={{
                                        padding: '0.4rem 0.8rem',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.4rem',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}>
                                        <FontAwesomeIcon icon={faCopy} />
                                        Duplicate
                                    </button>
                                    <button style={{
                                        padding: '0.4rem 0.8rem',
                                        backgroundColor: 'rgba(239,68,68,0.15)',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '0.4rem',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        marginLeft: 'auto'
                                    }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TemplateManager;