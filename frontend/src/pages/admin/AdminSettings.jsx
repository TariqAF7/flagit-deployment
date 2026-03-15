import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import { fetchAdminSettings, updateAdminSettings } from '../../api/admin';

// ── Setting Row primitives ───────────────────────────────────────────────────
const SettingRow = ({ label, description, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.25rem 0', borderBottom: '1px solid #f1f5f9', gap: '2rem', flexWrap: 'wrap' }}>
    <div style={{ flex: 1, minWidth: '200px' }}>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--deep-navy)', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>{description}</div>
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
      width: 48, height: 26,
      borderRadius: 99, border: 'none',
      backgroundColor: value ? 'var(--primary-teal, #0d9488)' : '#cbd5e1',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      transition: 'background 0.25s',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: value ? 25 : 3,
      width: 20, height: 20, borderRadius: '50%',
      backgroundColor: 'white',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      transition: 'left 0.2s',
    }} />
  </button>
);

const InputField = ({ value, onChange, type = 'text', min, max, disabled }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
    min={min}
    max={max}
    disabled={disabled}
    style={{
      padding: '0.5rem 0.75rem',
      border: '1.5px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: 'var(--deep-navy)',
      backgroundColor: disabled ? '#f8fafc' : 'white',
      width: type === 'number' ? '90px' : '220px',
      outline: 'none',
    }}
  />
);

const SelectField = ({ value, onChange, options, disabled }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={disabled}
    style={{
      padding: '0.5rem 0.75rem',
      border: '1.5px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: 'var(--deep-navy)',
      backgroundColor: disabled ? '#f8fafc' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      minWidth: '140px',
    }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ── Section card wrapper ─────────────────────────────────────────────────────
const Section = ({ title, subtitle, icon, children }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
      <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'var(--primary-teal, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        {icon}
      </div>
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-navy)', margin: 0 }}>{title}</h2>
        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>{subtitle}</p>
      </div>
    </div>
    <div style={{ marginTop: '0.5rem' }}>
      {children}
    </div>
  </div>
);

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

  const toastBg = toast?.type === 'error' ? '#ef4444' : toast?.type === 'warning' ? '#f59e0b' : '#22c55e';

  return (
    <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
      <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
        <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

        <main className="main-content" style={{ backgroundColor: '#f1f5f9', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

          <AdminTopBar
            title="Platform Settings"
            subtitle="Configure global system options — all changes persist to MongoDB"
            toggleSidebar={() => setSidebarOpen(true)}
          />

          {/* Toast */}
          {toast && (
            <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, backgroundColor: toastBg, color: 'white', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.25s ease' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {toast.msg}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#94a3b8' }}>
              <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* ── General ── */}
              <Section
                title="General"
                subtitle="Platform identity and name"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              >
                <SettingRow label="Platform Name" description="The display name shown across the admin interface.">
                  <InputField value={form.platformName} onChange={set('platformName')} />
                </SettingRow>
                <SettingRow label="Session Timeout" description="How long (minutes) before an inactive admin session expires.">
                  <InputField value={form.sessionTimeoutMinutes} onChange={set('sessionTimeoutMinutes')} type="number" min={5} max={480} />
                </SettingRow>
              </Section>

              {/* ── Simulation ── */}
              <Section
                title="Simulation"
                subtitle="Default behaviour for phishing simulations"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
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
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              >
                <SettingRow label="Email Notifications" description="Send automated security awareness emails and simulation result summaries to users.">
                  <Toggle value={form.emailNotifications} onChange={set('emailNotifications')} />
                </SettingRow>
              </Section>

              {/* ── Maintenance ── */}
              <Section
                title="Maintenance Mode"
                subtitle="Temporarily restrict access for all non-admin users"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
              >
                <SettingRow
                  label="Enable Maintenance Mode"
                  description={
                    form.maintenanceMode
                      ? '⚠️ ACTIVE — Only admins can access the platform right now.'
                      : 'When enabled, regular users will see a maintenance page and cannot log in.'
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {form.maintenanceMode && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>ACTIVE</span>
                    )}
                    <Toggle value={form.maintenanceMode} onChange={set('maintenanceMode')} />
                  </div>
                </SettingRow>
              </Section>

              {/* ── Save bar ── */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
                {dirty && <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>Unsaved changes</span>}
                <button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  style={{
                    padding: '0.65rem 1.75rem',
                    backgroundColor: saving || !dirty ? '#cbd5e1' : 'var(--primary-teal, #0d9488)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: saving || !dirty ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'background 0.2s',
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
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
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes slideIn  { from { opacity: 0; transform: translateX(1rem); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminSettings;
