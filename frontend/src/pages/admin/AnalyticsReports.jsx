import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import SvgLineChart from '../../components/admin/SvgLineChart';
import {
  fetchReportTrends,
  fetchReportHeatmap,
  fetchReportEffectiveness,
  fetchReportPdfData,
  fetchAdminDepartments,
} from '../../api/admin';

// ── Constants ────────────────────────────────────────────────────────────────
const SIM_TYPES = [
  { value: 'all',               label: 'All Types' },
  { value: 'Credential',        label: 'Credential Harvesting' },
  { value: 'Invoice',           label: 'Invoice Fraud' },
  { value: 'Account Recovery',  label: 'Account Recovery Scam' },
];
const TIMEFRAMES = [
  { value: 'last_7_days',  label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_year',    label: 'Last 12 Months' },
];

// ── Risk colour scale (green → red) ─────────────────────────────────────────
const RISK_COLOR = {
  Critical: { bar: '#ef4444', badge: '#fef2f2', text: '#dc2626' },
  High:     { bar: '#f97316', badge: '#fff7ed', text: '#ea580c' },
  Moderate: { bar: '#eab308', badge: '#fefce8', text: '#ca8a04' },
  Low:      { bar: '#22c55e', badge: '#f0fdf4', text: '#16a34a' },
};

// Interpolate vulnerability rate 0-100 → green (#22c55e) → red (#ef4444)
const vulnColor = (rate) => {
  const r = Math.round(34  + (rate / 100) * (239 - 34));
  const g = Math.round(197 - (rate / 100) * (197 - 68));
  const b = Math.round(94  - (rate / 100) * (94  - 68));
  return `rgb(${r},${g},${b})`;
};

// ── Small reusable components ────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', position: 'relative', backgroundColor: 'white' }}>
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: 32, height: 32, borderRadius: 8, backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--deep-navy)', lineHeight: 1, marginBottom: '0.3rem' }}>{value}</div>
    <div style={{ fontSize: '0.7rem', color }}>{sub}</div>
  </div>
);

const Spinner = () => (
  <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
    <div style={{ width: 12, height: 12, border: '2px solid #cbd5e1', borderTopColor: 'var(--primary-teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    Loading…
  </div>
);

// ── Heatmap Tab ──────────────────────────────────────────────────────────────
const HeatmapTab = ({ data, loading, fallback }) => {
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}><Spinner /></div>;
  if (!data || data.length === 0) return <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>No heatmap data available.</div>;

  const maxRate = Math.max(...data.map(d => d.vulnerabilityRate), 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--deep-navy)' }}>Department Vulnerability Ranking</h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
            Ranked most-to-least vulnerable · Click Rate = (Phishing Link Clicks / Total Simulations) × 100
            {fallback && ' · Sample data'}
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {Object.entries(RISK_COLOR).map(([level, c]) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#475569' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c.bar }} />
              {level}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.map((row, i) => {
          const rc = RISK_COLOR[row.riskLevel] || RISK_COLOR.Low;
          const barW = (row.vulnerabilityRate / maxRate) * 100;
          return (
            <div key={row.department} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 90px 90px', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '0.6rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              {/* Rank + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: rc.bar, color: 'white', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--deep-navy)' }}>{row.department}</span>
              </div>

              {/* Bar */}
              <div style={{ position: 'relative', height: 10, backgroundColor: '#e2e8f0', borderRadius: 99 }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${barW}%`,
                  borderRadius: 99,
                  backgroundColor: vulnColor(row.vulnerabilityRate),
                  transition: 'width 0.8s ease',
                }} />
              </div>

              {/* Rate */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: rc.bar }}>{row.vulnerabilityRate}%</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>click rate</div>
              </div>

              {/* Badge */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ backgroundColor: rc.badge, color: rc.text, padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.68rem', fontWeight: 700 }}>
                  {row.riskLevel}
                </span>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '0.2rem' }}>{row.clicks}/{row.total}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Effectiveness Tab ────────────────────────────────────────────────────────
const EffectivenessTab = ({ data, loading, fallback }) => {
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}><Spinner /></div>;
  if (!data) return <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>No effectiveness data available.</div>;

  const { trained, untrained, impact } = data;
  const maxRate = Math.max(trained.avgClickRate, untrained.avgClickRate, 1);

  const BAR_H = 180; // max bar height in px

  const GroupBar = ({ group, color, accentColor }) => {
    const barH = Math.round((group.avgClickRate / maxRate) * BAR_H);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.75rem' }}>
        {/* Rate label above bar */}
        <div style={{ fontSize: '2rem', fontWeight: 800, color: accentColor }}>{group.avgClickRate}%</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>avg click rate</div>

        {/* Bar */}
        <div style={{ width: '100%', maxWidth: 120, height: BAR_H, backgroundColor: '#f1f5f9', borderRadius: '0.5rem', position: 'relative', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <div style={{
            width: '100%', height: barH,
            backgroundColor: color,
            borderRadius: '0.5rem 0.5rem 0 0',
            transition: 'height 0.8s ease',
          }} />
        </div>

        {/* Label */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--deep-navy)' }}>{group.label}</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {group.totalUsers != null ? `${group.totalUsers} user${group.totalUsers !== 1 ? 's' : ''}` : ''}
            {group.totalResults != null ? ` · ${group.totalResults} attempts` : ''}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem', maxWidth: 180 }}>{group.description}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--deep-navy)' }}>Training Effectiveness</h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
            Comparing phishing click rates between trained and untrained user groups
            {fallback && ' · Sample data'}
          </p>
        </div>
        {/* Impact badge */}
        {impact > 0 && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>−{impact}pp</div>
            <div style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.2rem' }}>click rate reduction</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.1rem' }}>from training</div>
          </div>
        )}
      </div>

      {/* Bar chart comparison */}
      <div style={{ backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <GroupBar group={untrained} color="#ef4444" accentColor="#dc2626" />

          {/* VS divider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', paddingBottom: '4rem' }}>
            <div style={{ width: 2, height: 40, backgroundColor: '#e2e8f0' }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>VS</div>
            <div style={{ width: 2, height: 40, backgroundColor: '#e2e8f0' }} />
          </div>

          <GroupBar group={trained} color="#22c55e" accentColor="#16a34a" />
        </div>
      </div>

      {/* Key insight row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{untrained.avgClickRate}%</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Click rate — untrained users</div>
        </div>
        <div style={{ border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{trained.avgClickRate}%</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Click rate — trained users</div>
        </div>
        <div style={{ border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{impact > 0 ? `−${impact}pp` : '—'}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Percentage-point improvement</div>
        </div>
      </div>
    </div>
  );
};

// ── Export helpers ───────────────────────────────────────────────────────────
// Inject jsPDF from CDN once (no install needed)
const ensureJsPDF = () => new Promise((resolve) => {
  if (window.jspdf) return resolve(window.jspdf.jsPDF);
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  s.onload = () => resolve(window.jspdf.jsPDF);
  document.head.appendChild(s);
});

const buildPdf = async (data) => {
  const JsPDF = await ensureJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { summary, heatmap, generatedAt, reportTitle, organization } = data;

  const teal  = [13, 148, 136];
  const navy  = [30, 58, 95];
  const grey  = [100, 116, 139];

  // Header band
  doc.setFillColor(...teal);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle, 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${organization}  ·  Generated ${new Date(generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, 22);

  // Resilience score highlight
  let y = 42;
  doc.setFontSize(11);
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.text('Organizational Resilience Score', 14, y);
  doc.setFontSize(28);
  doc.setTextColor(...teal);
  doc.text(`${summary.orgResilienceScore}`, 14, y + 14);
  doc.setFontSize(10);
  doc.setTextColor(...grey);
  doc.setFont('helvetica', 'normal');
  doc.text(`Detection Rate: ${summary.detectionRate}%    Reporting Rate: ${summary.reportingRate}%`, 14, y + 22);

  // Summary table
  y = 82;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...navy);
  doc.text('Platform Summary', 14, y);
  y += 6;
  const rows = [
    ['Total Users',        summary.totalUsers],
    ['Active Users',       summary.activeUsers],
    ['Total Simulations',  summary.totalSimulations],
    ['Detection Rate',     `${summary.detectionRate}%`],
    ['Reporting Rate',     `${summary.reportingRate}%`],
  ];
  rows.forEach(([label, val], i) => {
    if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(14, y, 182, 7, 'F'); }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grey);
    doc.text(label, 20, y + 5);
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), 120, y + 5);
    y += 7;
  });

  // Heatmap table
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...navy);
  doc.text('Department Vulnerability Heatmap', 14, y);
  y += 6;
  (heatmap.length ? heatmap : [{ department: 'No data', total: 0, clicks: 0, vulnerabilityRate: 0 }]).forEach((row, i) => {
    if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(14, y, 182, 7, 'F'); }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grey);
    doc.text(row.department, 20, y + 5);
    doc.text(`${row.clicks} / ${row.total}`, 100, y + 5);
    const rateColor = row.vulnerabilityRate >= 70 ? [220, 38, 38] : row.vulnerabilityRate >= 50 ? [234, 88, 12] : row.vulnerabilityRate >= 30 ? [202, 138, 4] : [22, 163, 74];
    doc.setTextColor(...rateColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${row.vulnerabilityRate}%`, 160, y + 5);
    y += 7;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...grey);
  doc.text('FlagIT Security Awareness Platform  —  Confidential', 14, 287);

  doc.save(`flagit-executive-summary-${new Date().toISOString().split('T')[0]}.pdf`);
};

// ── Main Page ────────────────────────────────────────────────────────────────
const AnalyticsReports = () => {
  const { reportTrends, setReportTrends } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState('Trends');
  const [toast,       setToast]       = useState('');

  // Export state
  const [exporting,      setExporting]      = useState(false);

  // Trends filter state
  const [timeframe,   setTimeframe]   = useState('last_30_days');
  const [department,  setDepartment]  = useState('all');
  const [simType,     setSimType]     = useState('all');
  const [departments, setDepartments] = useState([]);


  // Per-tab data & loading
  const [trendsLoading,  setTrendsLoading]  = useState(false);
  const [trendsFallback, setTrendsFallback] = useState(false);

  const [heatmapData,    setHeatmapData]    = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [heatmapFallback,setHeatmapFallback]= useState(false);

  const [effectData,     setEffectData]     = useState(null);
  const [effectLoading,  setEffectLoading]  = useState(false);
  const [effectFallback, setEffectFallback] = useState(false);

  // Fetch departments for filter dropdown
  useEffect(() => {
    fetchAdminDepartments()
      .then(data => setDepartments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // ── Trends fetch ──────────────────────────────────────────────
  const loadTrends = useCallback(async (tf, dept, type) => {
    setTrendsLoading(true);
    try {
      const data = await fetchReportTrends({ timeframe: tf, department: dept, simType: type });
      setReportTrends(Array.isArray(data) ? data : []);
      setTrendsFallback(false);
    } catch {
      setTrendsFallback(true);
    } finally {
      setTrendsLoading(false);
    }
  }, [setReportTrends]);

  useEffect(() => { loadTrends(timeframe, department, simType); }, []); // eslint-disable-line
  useEffect(() => { loadTrends(timeframe, department, simType); }, [timeframe, department, simType]); // eslint-disable-line

  // ── Heatmap fetch (on tab switch) ─────────────────────────────
  const loadHeatmap = useCallback(async () => {
    if (heatmapData) return; // already fetched
    setHeatmapLoading(true);
    try {
      const data = await fetchReportHeatmap();
      setHeatmapData(Array.isArray(data) ? data : []);
      setHeatmapFallback(false);
    } catch {
      setHeatmapFallback(true);
      setHeatmapData([]);
    } finally {
      setHeatmapLoading(false);
    }
  }, [heatmapData]);

  // ── Effectiveness fetch (on tab switch) ───────────────────────
  const loadEffectiveness = useCallback(async () => {
    if (effectData) return;
    setEffectLoading(true);
    try {
      const data = await fetchReportEffectiveness();
      setEffectData(data && typeof data === 'object' ? data : null);
      setEffectFallback(false);
    } catch {
      setEffectFallback(true);
      setEffectData(null);
    } finally {
      setEffectLoading(false);
    }
  }, [effectData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'User Heatmap')            loadHeatmap();
    if (tab === 'Training Effectiveness')  loadEffectiveness();
  };

  // ── Derived totals ────────────────────────────────────────────
  const totals = (reportTrends || []).reduce(
    (acc, d) => ({
      total:    acc.total    + (d.totalIncidents    ?? 0),
      detected: acc.detected + (d.detectedIncidents ?? 0),
      reported: acc.reported + (d.reportedIncidents ?? 0),
    }),
    { total: 0, detected: 0, reported: 0 }
  );
  const detRate = totals.total > 0 ? Math.round((totals.detected / totals.total) * 100) : 0;
  const repRate = totals.total > 0 ? Math.round((totals.reported / totals.total) * 100) : 0;

  const handleExport = async () => {
    setExporting(true);
    try {
      const pdfData = await fetchReportPdfData();
      await buildPdf(pdfData);
      setToast('PDF generated successfully.');
    } catch (err) {
      setToast('Export failed: ' + (err.message || 'unknown error.'));
    } finally {
      setExporting(false);
      setTimeout(() => setToast(''), 4000);
    }
  };

  const selectStyle = {
    width: '100%', backgroundColor: '#f1f5f9', border: 'none',
    padding: '0.65rem 1rem', borderRadius: '0.5rem',
    color: 'var(--deep-navy)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', outline: 'none',
  };

  return (
    <div className="dashboard-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
      <div className="dashboard-content" style={{ display: 'flex', width: '100%' }}>
        <AdminSidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

        <main className="main-content" style={{ backgroundColor: '#f1f5f9', padding: '2rem', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>

          <AdminTopBar
            title="Phishing Awareness Analytics"
            subtitle="Comprehensive security training insights and threat detection metrics"
            toggleSidebar={() => setSidebarOpen(true)}
          />

          {/* Toast */}
          {toast && (
            <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, backgroundColor: '#22c55e', color: 'white', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {toast}
            </div>
          )}

          {/* ── Filter Panel ── */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--deep-navy)' }}>Report Filters</h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  {trendsFallback ? 'Showing sample data — no simulation results in DB yet.' : `${reportTrends.length} data point${reportTrends.length !== 1 ? 's' : ''} for selected filters`}
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting}
                style={{ padding: '0.55rem 1.1rem', backgroundColor: exporting ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: exporting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
              >
                {exporting ? (
                  <>
                    <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Generating PDF…
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF Report
                  </>
                )}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timeframe</label>
                <select style={selectStyle} value={timeframe} onChange={e => setTimeframe(e.target.value)}>
                  {TIMEFRAMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</label>
                <select style={selectStyle} value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="all">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Simulation Type</label>
                <select style={selectStyle} value={simType} onChange={e => setSimType(e.target.value)}>
                  {SIM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Chart / Tab Panel ── */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
              {['Trends', 'User Heatmap', 'Training Effectiveness'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  style={{ border: 'none', background: tab === activeTab ? 'var(--primary-teal)' : 'transparent', color: tab === activeTab ? 'white' : '#64748b', padding: '0.45rem 1.2rem', borderRadius: '2rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Trends Tab ── */}
            {activeTab === 'Trends' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--deep-navy)' }}>Phishing Incidents Over Time</h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                      {TIMEFRAMES.find(t => t.value === timeframe)?.label}
                      {department !== 'all' ? ` · ${department}` : ''}
                      {simType !== 'all' ? ` · ${SIM_TYPES.find(t => t.value === simType)?.label}` : ''}
                    </p>
                  </div>
                  {trendsLoading && <Spinner />}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <StatCard label="Total Incidents"    value={totals.total.toLocaleString()}    sub="Simulation events in period"    color="#1e3a5f"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
                  <StatCard label="Detected"           value={totals.detected.toLocaleString()} sub={`${detRate}% detection rate`}    color="#0d9488"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
                  <StatCard label="Reported (FlagIT)"  value={totals.reported.toLocaleString()} sub={`${repRate}% reporting rate`}    color="#f97316"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>} />
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <SvgLineChart data={reportTrends} />
                </div>
              </div>
            )}

            {/* ── Heatmap Tab ── */}
            {activeTab === 'User Heatmap' && (
              <HeatmapTab data={heatmapData} loading={heatmapLoading} fallback={heatmapFallback} />
            )}

            {/* ── Effectiveness Tab ── */}
            {activeTab === 'Training Effectiveness' && (
              <EffectivenessTab data={effectData} loading={effectLoading} fallback={effectFallback} />
            )}
          </div>

        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AnalyticsReports;
