import React, { useState } from 'react';

/**
 * SvgLineChart
 * Expects data[] with shape:
 *   { label: string, totalIncidents: number, detectedIncidents: number, reportedIncidents: number }
 *
 * Colour spec (per design brief):
 *   Total Incidents    → Navy   (#1e3a5f)
 *   Detected Incidents → Teal   (var(--primary-teal) ≈ #0d9488)
 *   Reported Incidents → Orange (#f97316)
 */

const SERIES = [
  { key: 'totalIncidents',    label: 'Total Incidents',    color: '#1e3a5f', areaOpacity: 0.07 },
  { key: 'detectedIncidents', label: 'Detected Incidents', color: '#0d9488', areaOpacity: 0.10 },
  { key: 'reportedIncidents', label: 'Reported Incidents', color: '#f97316', areaOpacity: 0.10 },
];

const W       = 800;
const H       = 280;
const PAD_L   = 48;
const PAD_R   = 20;
const PAD_T   = 16;
const PAD_B   = 36;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

const SvgLineChart = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null); // { x, y, point }

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        No trend data available for this period.
      </div>
    );
  }

  // ── Scale helpers ─────────────────────────────────────────────────────
  const maxVal = Math.max(
    ...data.flatMap(d => [d.totalIncidents, d.detectedIncidents, d.reportedIncidents])
  );
  // Round up to a nice ceiling (nearest 50)
  const yMax = Math.max(50, Math.ceil(maxVal / 50) * 50);

  const xOf  = (i) => PAD_L + (i / Math.max(data.length - 1, 1)) * CHART_W;
  const yOf  = (v) => PAD_T + CHART_H - (v / yMax) * CHART_H;

  // ── Path builders ─────────────────────────────────────────────────────
  const linePath = (key) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i).toFixed(1)} ${yOf(d[key]).toFixed(1)}`).join(' ');

  const areaPath = (key) => {
    const line = linePath(key);
    return `${line} L ${xOf(data.length - 1).toFixed(1)} ${(PAD_T + CHART_H).toFixed(1)} L ${xOf(0).toFixed(1)} ${(PAD_T + CHART_H).toFixed(1)} Z`;
  };

  // ── Y-axis tick values ────────────────────────────────────────────────
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * yMax));

  return (
    <div style={{ width: '100%' }}>
      {/* ── SVG Canvas ── */}
      <div style={{ overflowX: 'auto', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', minWidth: '500px', height: 'auto', display: 'block' }}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0"    />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines + Y labels */}
          {yTicks.map(val => (
            <g key={val}>
              <line
                x1={PAD_L} y1={yOf(val)} x2={W - PAD_R} y2={yOf(val)}
                stroke="#e2e8f0" strokeWidth="1" strokeDasharray={val === 0 ? '0' : '4 3'}
              />
              <text
                x={PAD_L - 8} y={yOf(val) + 4}
                fontSize="11" fill="#94a3b8" textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* X axis base line */}
          <line
            x1={PAD_L} y1={PAD_T + CHART_H}
            x2={W - PAD_R} y2={PAD_T + CHART_H}
            stroke="#e2e8f0" strokeWidth="1"
          />

          {/* X axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={xOf(i)} y={H - 6}
              fontSize="11" fill="#94a3b8" textAnchor="middle"
            >
              {d.label}
            </text>
          ))}

          {/* Area fills */}
          {SERIES.map(s => (
            <path
              key={`area-${s.key}`}
              d={areaPath(s.key)}
              fill={`url(#grad-${s.key})`}
            />
          ))}

          {/* Lines */}
          {SERIES.map(s => (
            <path
              key={`line-${s.key}`}
              d={linePath(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Hover dots + invisible vertical hit areas */}
          {data.map((d, i) => (
            <g key={`pt-${i}`}>
              {/* Invisible tall hit strip */}
              <rect
                x={xOf(i) - (CHART_W / data.length) / 2}
                y={PAD_T}
                width={CHART_W / data.length}
                height={CHART_H}
                fill="transparent"
                onMouseEnter={(e) => {
                  const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
                  setTooltip({
                    x: e.clientX - svgRect.left,
                    y: e.clientY - svgRect.top,
                    point: d,
                  });
                }}
              />
              {/* Data dots */}
              {SERIES.map(s => (
                <circle
                  key={s.key}
                  cx={xOf(i)} cy={yOf(d[s.key])}
                  r={tooltip?.point === d ? 5 : 3.5}
                  fill="white"
                  stroke={s.color}
                  strokeWidth="2"
                  style={{ transition: 'r 0.1s' }}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* ── Tooltip overlay ── */}
        {tooltip && (
          <div style={{
            position: 'absolute',
            left:  tooltip.x + 12,
            top:   tooltip.y - 10,
            backgroundColor: 'var(--deep-navy, #1e3a5f)',
            color: 'white',
            borderRadius: '0.5rem',
            padding: '0.6rem 0.85rem',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: 10,
            minWidth: '150px',
          }}>
            <div style={{ fontWeight: '700', marginBottom: '0.35rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.3rem' }}>
              {tooltip.point.label}
            </div>
            {SERIES.map(s => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.85 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color }} />
                  {s.label}
                </span>
                <strong>{tooltip.point[s.key]}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
        {SERIES.map(s => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#475569', fontWeight: '500' }}>
            <svg width="24" height="4">
              <line x1="0" y1="2" x2="16" y2="2" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="8" cy="2" r="3" fill="white" stroke={s.color} strokeWidth="2" />
            </svg>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SvgLineChart;
