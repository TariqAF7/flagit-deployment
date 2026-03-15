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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faDownload,
  faFilter,
  faUsers,
  faShieldHalved,
  faFlag,
  faExclamationTriangle,
  faCheckCircle,
  faChartPie,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

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
  Critical: { bar: '#ef4444', badge: '#ef444420', text: '#ef4444' },
  High:     { bar: '#f97316', badge: '#f9731620', text: '#f97316' },
  Moderate: { bar: '#eab308', badge: '#eab30820', text: '#eab308' },
  Low:      { bar: '#22c55e', badge: '#22c55e20', text: '#22c55e' },
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
  <div style={{ 
    backgroundColor: '#132B44',
    borderRadius: '1rem',
    padding: '1.5rem',
    borderTop: '1px solid #F97316',
    borderBottom: '1px solid #F97316',
    borderLeft: '4px solid #F97316',
    borderRight: 'none',
    boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
    position: 'relative'
  }}>
    <div style={{ 
      position: 'absolute', 
      top: '1rem', 
      right: '1rem', 
      width: 36, 
      height: 36, 
      borderRadius: '10px', 
      backgroundColor: `${color}20`,
      color, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '1.1rem'
    }}>{icon}</div>
    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: '600' }}>{label}</div>
    <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'white', lineHeight: 1, marginBottom: '0.3rem' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: color }}>{sub}</div>
  </div>
);

const Spinner = () => (
  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    Loading…
  </div>
);

// ── Heatmap Tab ──────────────────────────────────────────────────────────────
const HeatmapTab = ({ data, loading, fallback }) => {
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}><Spinner /></div>;
  if (!data || data.length === 0) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
      <FontAwesomeIcon icon={faUsers} style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }} />
      <p style={{ margin: 0, fontWeight: '600', color: 'white' }}>No heatmap data available.</p>
    </div>
  );

  const maxRate = Math.max(...data.map(d => d.vulnerabilityRate), 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.2rem', color: 'white' }}>Department Vulnerability Ranking</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            Ranked most-to-least vulnerable · Click Rate = (Phishing Link Clicks / Total Simulations) × 100
            {fallback && ' · Sample data'}
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#132B44', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          {Object.entries(RISK_COLOR).map(([level, c]) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: c.bar }} />
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
            <div key={row.department} style={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 1fr 90px 100px', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '0.85rem 1rem', 
              borderRadius: '0.75rem', 
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}>
              {/* Rank + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  backgroundColor: rc.bar, 
                  color: 'white', 
                  fontSize: '0.7rem', 
                  fontWeight: '700', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>{i + 1}</span>
                <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'white' }}>{row.department}</span>
              </div>

              {/* Bar */}
              <div style={{ position: 'relative', height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${barW}%`,
                  borderRadius: '99px',
                  backgroundColor: vulnColor(row.vulnerabilityRate),
                  transition: 'width 0.8s ease',
                }} />
              </div>

              {/* Rate */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: rc.bar }}>{row.vulnerabilityRate}%</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>click rate</div>
              </div>

              {/* Badge */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ 
                  backgroundColor: rc.badge, 
                  color: rc.text, 
                  padding: '0.2rem 0.8rem', 
                  borderRadius: '2rem', 
                  fontSize: '0.7rem', 
                  fontWeight: '600' 
                }}>
                  {row.riskLevel}
                </span>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{row.clicks}/{row.total}</div>
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
  if (!data) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
      <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }} />
      <p style={{ margin: 0, fontWeight: '600', color: 'white' }}>No effectiveness data available.</p>
    </div>
  );

  const { trained, untrained, impact } = data;
  const maxRate = Math.max(trained.avgClickRate, untrained.avgClickRate, 1);

  const BAR_H = 180; // max bar height in px

  const GroupBar = ({ group, color, accentColor }) => {
    const barH = Math.round((group.avgClickRate / maxRate) * BAR_H);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.75rem' }}>
        {/* Rate label above bar */}
        <div style={{ fontSize: '2.2rem', fontWeight: '700', color: accentColor }}>{group.avgClickRate}%</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>avg click rate</div>

        {/* Bar */}
        <div style={{ width: '100%', maxWidth: 120, height: BAR_H, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', position: 'relative', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <div style={{
            width: '100%', height: barH,
            backgroundColor: color,
            borderRadius: '0.5rem 0.5rem 0 0',
            transition: 'height 0.8s ease',
          }} />
        </div>

        {/* Label */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>{group.label}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
            {group.totalUsers != null ? `${group.totalUsers} user${group.totalUsers !== 1 ? 's' : ''}` : ''}
            {group.totalResults != null ? ` · ${group.totalResults} attempts` : ''}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.4rem', maxWidth: 200 }}>{group.description}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.2rem', color: 'white' }}>Training Effectiveness</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            Comparing phishing click rates between trained and untrained user groups
            {fallback && ' · Sample data'}
          </p>
        </div>
        {/* Impact badge */}
        {impact > 0 && (
          <div style={{ 
            backgroundColor: '#1e5f3a', 
            border: '1px solid #4ade80', 
            borderRadius: '0.75rem', 
            padding: '0.75rem 1.5rem', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#4ade80', lineHeight: 1 }}>−{impact}pp</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>click rate reduction</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.1rem' }}>from training</div>
          </div>
        )}
      </div>

      {/* Bar chart comparison */}
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.02)', 
        borderRadius: '1rem', 
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <GroupBar group={untrained} color="#ef4444" accentColor="#ef4444" />

          {/* VS divider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', paddingBottom: '4rem' }}>
            <div style={{ width: 2, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.8rem', 
              fontWeight: '700', 
              color: 'rgba(255,255,255,0.5)' 
            }}>VS</div>
            <div style={{ width: 2, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          <GroupBar group={trained} color="#22c55e" accentColor="#4ade80" />
        </div>
      </div>

      {/* Key insight row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem', 
        marginTop: '1.5rem' 
      }}>
        <div style={{ 
          backgroundColor: '#5f2a2a',
          borderRadius: '0.75rem', 
          padding: '1rem', 
          textAlign: 'center',
          border: '1px solid #ef4444'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ef4444' }}>{untrained.avgClickRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Click rate — untrained users</div>
        </div>
        <div style={{ 
          backgroundColor: '#1e5f3a',
          borderRadius: '0.75rem', 
          padding: '1rem', 
          textAlign: 'center',
          border: '1px solid #4ade80'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#4ade80' }}>{trained.avgClickRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Click rate — trained users</div>
        </div>
        <div style={{ 
          backgroundColor: '#1e3a5f',
          borderRadius: '0.75rem', 
          padding: '1rem', 
          textAlign: 'center',
          border: '1px solid #60a5fa'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#60a5fa' }}>{impact > 0 ? `−${impact}pp` : '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Percentage-point improvement</div>
        </div>
      </div>
    </div>
  );
};

// ── Export helpers (unchanged) ───────────────────────────────────────────────
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
    width: '100%', 
    backgroundColor: '#132B44', 
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.65rem 1rem', 
    borderRadius: '0.5rem',
    color: 'white', 
    fontSize: '0.85rem', 
    fontWeight: '500', 
    cursor: 'pointer', 
    outline: 'none',
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
                <FontAwesomeIcon icon={faChartLine} style={{ color: '#F97316', fontSize: '2rem' }} />
                <h1 style={{ 
                  fontSize: '2.2rem', 
                  fontWeight: '700', 
                  color: 'white',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Analytics Reports
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
                Comprehensive security training insights and threat detection metrics
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

          {/* Toast */}
          {toast && (
            <div style={{ 
              position: 'fixed', 
              top: '1.25rem', 
              right: '1.25rem', 
              zIndex: 200, 
              backgroundColor: '#22c55e', 
              color: 'white', 
              padding: '0.85rem 1.25rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              <FontAwesomeIcon icon={faCheckCircle} />
              {toast}
            </div>
          )}

          {/* ── Filter Panel ── */}
          <div style={{ 
            backgroundColor: '#132B44',
            borderRadius: '1rem', 
            padding: '1.5rem', 
            borderTop: '1px solid #F97316',
            borderBottom: '1px solid #F97316',
            borderLeft: '4px solid #F97316',
            borderRight: 'none',
            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)',
            marginBottom: '1.5rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.2rem', color: 'white' }}>Report Filters</h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  {trendsFallback ? 'Showing sample data — no simulation results in DB yet.' : `${reportTrends.length} data point${reportTrends.length !== 1 ? 's' : ''} for selected filters`}
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting}
                style={{ 
                  padding: '0.65rem 1.25rem', 
                  backgroundColor: exporting ? 'rgba(255,255,255,0.2)' : '#F97316', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '2rem', 
                  fontWeight: '600', 
                  fontSize: '0.85rem', 
                  cursor: exporting ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  transition: 'all 0.2s',
                  opacity: exporting ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!exporting) {
                    e.target.style.backgroundColor = '#fb923c';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 20px -5px rgba(249,115,22,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!exporting) {
                    e.target.style.backgroundColor = '#F97316';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {exporting ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Generating PDF…
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faDownload} />
                    Download PDF Report
                  </>
                )}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timeframe</label>
                <select style={selectStyle} value={timeframe} onChange={e => setTimeframe(e.target.value)}>
                  {TIMEFRAMES.map(t => <option key={t.value} value={t.value} style={{ backgroundColor: '#132B44' }}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</label>
                <select style={selectStyle} value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="all" style={{ backgroundColor: '#132B44' }}>All Departments</option>
                  {departments.map(d => <option key={d} value={d} style={{ backgroundColor: '#132B44' }}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Simulation Type</label>
                <select style={selectStyle} value={simType} onChange={e => setSimType(e.target.value)}>
                  {SIM_TYPES.map(t => <option key={t.value} value={t.value} style={{ backgroundColor: '#132B44' }}>{t.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Chart / Tab Panel ── */}
          <div style={{ 
            backgroundColor: '#132B44',
            borderRadius: '1rem', 
            padding: '1.5rem', 
            borderTop: '1px solid #F97316',
            borderBottom: '1px solid #F97316',
            borderLeft: '4px solid #F97316',
            borderRight: 'none',
            boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.4)'
          }}>

            {/* Tab bar */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              borderBottom: '1px solid rgba(255,255,255,0.1)', 
              marginBottom: '2rem', 
              paddingBottom: '0.5rem', 
              overflowX: 'auto' 
            }}>
              {['Trends', 'User Heatmap', 'Training Effectiveness'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  style={{ 
                    border: 'none', 
                    background: tab === activeTab ? '#F97316' : 'transparent', 
                    color: tab === activeTab ? 'white' : 'rgba(255,255,255,0.6)', 
                    padding: '0.5rem 1.25rem', 
                    borderRadius: '2rem', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    cursor: 'pointer', 
                    whiteSpace: 'nowrap', 
                    transition: 'all 0.2s' 
                  }}
                  onMouseEnter={(e) => {
                    if (tab !== activeTab) {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tab !== activeTab) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'rgba(255,255,255,0.6)';
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

                        {/* ── Trends Tab ── */}
            {activeTab === 'Trends' && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1.5rem', 
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    margin: '0 0 0.2rem', 
                    color: 'white', 
                    textAlign: 'center' 
                  }}>
                    Phishing Incidents Over Time
                  </h3>
                  <p style={{ 
                    margin: '0 0 0.5rem', 
                    fontSize: '0.8rem', 
                    color: 'rgba(255,255,255,0.6)', 
                    textAlign: 'center' 
                  }}>
                    {TIMEFRAMES.find(t => t.value === timeframe)?.label}
                    {department !== 'all' ? ` · ${department}` : ''}
                    {simType !== 'all' ? ` · ${SIM_TYPES.find(t => t.value === simType)?.label}` : ''}
                  </p>
                  {trendsLoading && <Spinner />}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <StatCard label="Total Incidents"    value={totals.total.toLocaleString()}    sub="Simulation events in period"    color="#F97316"
                    icon={<FontAwesomeIcon icon={faExclamationTriangle} />} />
                  <StatCard label="Detected"           value={totals.detected.toLocaleString()} sub={`${detRate}% detection rate`}    color="#22c55e"
                    icon={<FontAwesomeIcon icon={faShieldHalved} />} />
                  <StatCard label="Reported (FlagIT)"  value={totals.reported.toLocaleString()} sub={`${repRate}% reporting rate`}    color="#3b82f6"
                    icon={<FontAwesomeIcon icon={faFlag} />} />
                </div>

                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.02)', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
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
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsReports;