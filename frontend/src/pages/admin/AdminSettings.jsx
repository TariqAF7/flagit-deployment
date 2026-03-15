import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import { fetchAdminSettings, updateAdminSettings } from '../../api/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog,
  faSave,
  faExclamationTriangle,
  faCheckCircle,
  faShieldHalved,
  faBell,
  faClock,
  faWrench,
  faEnvelope,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

// ── Setting Row primitives ───────────────────────────────────────────────────
const SettingRow = ({ label, description, children }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    padding: '1.25rem 0', 
    borderBottom: '1px solid rgba(255,255,255,0.05)', 
    gap: '2rem', 
    flexWrap: 'wrap',
    textAlign: 'left'
  }}>
    <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white', marginBottom: '0.2rem', textAlign: 'left' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, textAlign: 'left' }}>{description}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {children}
    </div>
  </div>
);

const Toggle = ({ value, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    style={{
      width: 52, height: 28,
      borderRadius: 99, border: 'none',
      backgroundColor: value ? '#F97316' : 'rgba(255,255,255,0.2)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      transition: 'background 0.25s',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: value ? 27 : 3,
      width: 22, height: 22, borderRadius: '50%',
      backgroundColor: 'white',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      transition: 'left 0.2s',
    }} />
  </button>
);

const InputField = ({ value, onChange, type = 'text', min, max, disabled, placeholder }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
    min={min}
    max={max}
    disabled={disabled}
    placeholder={placeholder}
    style={{
      padding: '0.6rem 1rem',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '0.5rem',
      fontSize: '0.9rem',
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.05)',
      width: type === 'number' ? '100px' : '250px',
      outline: 'none',
      transition: 'all 0.2s',
      textAlign: 'left',
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#F97316';
      e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
      e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
    }}
  />
);

const SelectField = ({ value, onChange, options, disabled }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={disabled}
    style={{
      padding: '0.6rem 1rem',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '0.5rem',
      fontSize: '0.9rem',
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.05)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      minWidth: '150px',
      transition: 'all 0.2s',
      textAlign: 'left',
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#F97316';
      e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
      e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
    }}
  >
    {options.map(o => <option key={o.value} value={o.value} style={{ backgroundColor: '#132B44', textAlign: 'left' }}>{o.label}</option>)}
  </select>
);

// ── Section card wrapper ─────────────────────────────────────────────────────
const Section = ({ title, subtitle, icon, children }) => (
  <div style={{ 
    backgroundColor: '#132B44',
    borderRadius: '1rem', 
    padding: '1.5rem', 
    borderTop: '1px solid #F97316',
    borderBottom: '1px solid #F97316',
    borderLeft: '4px solid #F97316',
    borderRight: 'none',
    boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
    marginBottom: '1.5rem',
    textAlign: 'left'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', textAlign: 'left' }}>
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: '10px', 
        backgroundColor: 'rgba(249,115,22,0.15)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#F97316',
        fontSize: '1.1rem'
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: 0, textAlign: 'left' }}>{title}</h2>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: 0, textAlign: 'left' }}>{subtitle}</p>
      </div>
    </div>
    <div style={{ marginTop: '0.5rem', textAlign: 'left' }}>
      {children}
    </div>
  </div>
);

// ── Toast component ───────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onDismiss }) => {
  const bg = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#22c55e';
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
      {type === 'success' && <FontAwesomeIcon icon={faCheckCircle} />}
      {type === 'error' && <FontAwesomeIcon icon={faExclamationTriangle} />}
      {type === 'warning' && <FontAwesomeIcon icon={faExclamationTriangle} />}
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0, opacity: 0.7 }}>✕</button>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const AdminSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state mirrors the Settings model
  const [form, setForm] = useState({
    platformName:              'FlagIT',
    maintenanceMode:           false,
    defaultSimulationDifficulty: 'Medium',
    maxSimulationTime:         300,
    emailNotifications:        true,
    sessionTimeoutMinutes:     60,
  });

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);   // { msg, type }
  const [dirty,    setDirty]    = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load settings from server on mount
  useEffect(() => {
    fetchAdminSettings()
      .then(data => {
        const s = data?.data ?? data ?? {};
        setForm(prev => ({
          ...prev,
          platformName:              s.platformName              ?? prev.platformName,
          maintenanceMode:           s.maintenanceMode           ?? prev.maintenanceMode,
          defaultSimulationDifficulty: s.defaultSimulationDifficulty ?? prev.defaultSimulationDifficulty,
          maxSimulationTime:         s.maxSimulationTime         ?? prev.maxSimulationTime,
          emailNotifications:        s.emailNotifications        ?? prev.emailNotifications,
          sessionTimeoutMinutes:     s.sessionTimeoutMinutes     ?? prev.sessionTimeoutMinutes,
        }));
      })
      .catch(err => {
        console.warn('Failed to load settings:', err.message);
        showToast('Could not load settings. Defaults shown.', 'warning');
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettings(form);
      setDirty(false);
      showToast('Settings saved successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout" style={{ backgroundColor: '#167f94', minHeight: '100vh' }}>
      <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
        <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

       <main className="main-content" style={{ 
    marginLeft: '280px',  // ← ADD THIS
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
                <FontAwesomeIcon icon={faCog} style={{ color: '#F97316', fontSize: '2rem' }} />
                <h1 style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: '700', 
                  color: 'white',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Platform Settings
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
                Configure global system options — all changes persist to MongoDB
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
              <div style={{ fontWeight: '600', color: 'white' }}>Settings</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>System Configuration</div>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ width: 30, height: 30, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* ── General ── */}
              <Section
                title="General"
                subtitle="Platform identity and name"
                icon={<FontAwesomeIcon icon={faGlobe} />}
              >
                <SettingRow label="Platform Name" description="The display name shown across the admin interface.">
                  <InputField value={form.platformName} onChange={set('platformName')} placeholder="FlagIT" />
                </SettingRow>
                <SettingRow label="Session Timeout" description="How long (minutes) before an inactive admin session expires.">
                  <InputField value={form.sessionTimeoutMinutes} onChange={set('sessionTimeoutMinutes')} type="number" min={5} max={480} />
                </SettingRow>
              </Section>

              {/* ── Simulation ── */}
              <Section
                title="Simulation"
                subtitle="Default behaviour for phishing simulations"
                icon={<FontAwesomeIcon icon={faShieldHalved} />}
              >
                <SettingRow label="Default Difficulty" description="Applies to any new simulation campaign that does not explicitly set a difficulty.">
                  <SelectField
                    value={form.defaultSimulationDifficulty}
                    onChange={set('defaultSimulationDifficulty')}
                    options={[
                      { value: 'Easy',   label: 'Easy'   },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Hard',   label: 'Hard'   },
                    ]}
                  />
                </SettingRow>
                <SettingRow label="Max Simulation Time" description="Maximum allowed time (seconds) a user has to respond before a simulation auto-submits.">
                  <InputField value={form.maxSimulationTime} onChange={set('maxSimulationTime')} type="number" min={30} max={3600} />
                </SettingRow>
              </Section>

              {/* ── Notifications ── */}
              <Section
                title="Notifications"
                subtitle="Configure automated alerts and email behaviour"
                icon={<FontAwesomeIcon icon={faBell} />}
              >
                <SettingRow label="Email Notifications" description="Send automated security awareness emails and simulation result summaries to users.">
                  <Toggle value={form.emailNotifications} onChange={set('emailNotifications')} />
                </SettingRow>
              </Section>

              {/* ── Maintenance ── */}
              <Section
                title="Maintenance Mode"
                subtitle="Temporarily restrict access for all non-admin users"
                icon={<FontAwesomeIcon icon={faWrench} />}
              >
                <SettingRow
                  label="Enable Maintenance Mode"
                  description={
                    form.maintenanceMode
                      ? '⚠️ ACTIVE — Only admins can access the platform right now.'
                      : 'When enabled, regular users will see a maintenance page and cannot log in.'
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {form.maintenanceMode && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        color: '#ef4444', 
                        backgroundColor: '#ef444420', 
                        padding: '0.2rem 0.8rem', 
                        borderRadius: '2rem',
                        border: '1px solid #ef4444'
                      }}>
                        ACTIVE
                      </span>
                    )}
                    <Toggle value={form.maintenanceMode} onChange={set('maintenanceMode')} />
                  </div>
                </SettingRow>
              </Section>

              {/* ── Save bar ── */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1rem 0',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginTop: '1rem'
              }}>
                {dirty && (
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#f59e0b', 
                    fontWeight: 600,
                    backgroundColor: '#f59e0b20',
                    padding: '0.3rem 1rem',
                    borderRadius: '2rem',
                    border: '1px solid #f59e0b'
                  }}>
                    Unsaved changes
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  style={{
                    padding: '0.7rem 2rem',
                    backgroundColor: saving || !dirty ? 'rgba(255,255,255,0.1)' : '#F97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: saving || !dirty ? 'not-allowed' : 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    transition: 'all 0.2s',
                    opacity: saving || !dirty ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!saving && dirty) {
                      e.target.style.backgroundColor = '#fb923c';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 20px -5px rgba(249,115,22,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving && dirty) {
                      e.target.style.backgroundColor = '#F97316';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Saving…
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        @keyframes slideIn { 
          from { opacity: 0; transform: translateX(1rem); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;