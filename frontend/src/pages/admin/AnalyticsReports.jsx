import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import SvgLineChart from '../../components/admin/SvgLineChart';
import {
  fetchReportTrends,
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



// ── Export helpers (unchanged) ───────────────────────────────────────────────
const ensureJsPDF = () => new Promise((resolve) => {
  if (window.jspdf) return resolve(window.jspdf.jsPDF);
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  s.onload = () => resolve(window.jspdf.jsPDF);
  document.head.appendChild(s);
});

const ensureHtml2Canvas = () => new Promise((resolve) => {
  if (window.html2canvas) return resolve(window.html2canvas);
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  s.onload = () => resolve(window.html2canvas);
  document.head.appendChild(s);
});

const buildPdf = async (data) => {
  const JsPDF = await ensureJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { summary, heatmap, generatedAt, reportTitle, organization, filters, chartImg } = data;

  const teal  = [13, 148, 136];
  const navy  = [30, 58, 95];
  const grey  = [100, 116, 139];

  // Header band
  doc.setFillColor(...teal);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle || 'Analytics Report', 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${organization || 'Organization'}  ·  Generated ${new Date().toLocaleDateString('en-GB')}`, 14, 22);

  // Filters
  let y = 42;
  doc.setFontSize(11);
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.text('Applied Filters', 14, y);
  doc.setFontSize(9);
  doc.setTextColor(...grey);
  doc.setFont('helvetica', 'normal');
  doc.text(`Timeframe: ${filters?.timeframe || 'N/A'}    |    Dept: ${filters?.department || 'N/A'}    |    Sim Type: ${filters?.simType || 'N/A'}`, 14, y + 8);

  // Summary table
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...navy);
  doc.text('Period Summary', 14, y);
  y += 6;
  const rows = [
    ['Total Incidents',    summary.totalIncidents],
    ['Detected',           summary.detectedIncidents],
    ['Reported',           summary.reportedIncidents],
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

  // Graph Snapshot
  if (chartImg) {
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...navy);
      doc.text('Trends Graph View', 14, y);
      y += 6;
      doc.addImage(chartImg, 'PNG', 14, y, 182, 70);
      y += 75;
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...grey);
  doc.text('FlagIT Security Awareness Platform  —  Confidential', 14, 287);

  doc.save(`flagit-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
};

// ── Main Page ────────────────────────────────────────────────────────────────
const AnalyticsReports = () => {
  const { reportTrends, setReportTrends } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      const chartEl = document.getElementById('pdf-chart-container');
      let chartImg = null;
      if (chartEl) {
        const Html2Canvas = await ensureHtml2Canvas();
        const canvas = await Html2Canvas(chartEl, { 
          backgroundColor: '#132B44',
          scale: 2
        });
        chartImg = canvas.toDataURL('image/png');
      }

      const pdfData = await fetchReportPdfData();
      
      const buildData = {
        ...pdfData,
        summary: {
            totalIncidents: totals.total,
            detectedIncidents: totals.detected,
            reportedIncidents: totals.reported,
            detectionRate: detRate,
            reportingRate: repRate,
        },
        filters: {
            timeframe: TIMEFRAMES.find(t => t.value === timeframe)?.label || timeframe,
            department: department === 'all' ? 'All Departments' : department,
            simType: simType === 'all' ? 'All Types' : SIM_TYPES.find(t => t.value === simType)?.label,
        },
        chartImg,
      };

      await buildPdf(buildData);
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

            {/* ── Trends Data ── */}
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

              {trendsFallback ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                    No data available for this period.
                  </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                    <StatCard label="Total Incidents"    value={totals.total.toLocaleString()}    sub="Simulation events in period"    color="#F97316"
                      icon={<FontAwesomeIcon icon={faExclamationTriangle} />} />
                    <StatCard label="Detected"           value={totals.detected.toLocaleString()} sub={`${detRate}% detection rate`}    color="#22c55e"
                      icon={<FontAwesomeIcon icon={faShieldHalved} />} />
                    <StatCard label="Reported (FlagIT)"  value={totals.reported.toLocaleString()} sub={`${repRate}% reporting rate`}    color="#3b82f6"
                      icon={<FontAwesomeIcon icon={faFlag} />} />
                  </div>

                  <div id="pdf-chart-container" style={{ 
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    borderRadius: '0.75rem', 
                    padding: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <SvgLineChart data={reportTrends} />
                  </div>
                </>
              )}
            </div>
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