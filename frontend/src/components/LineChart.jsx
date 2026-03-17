import React, { useMemo, useState } from 'react';

const CHART_WIDTH = 500;
const CHART_HEIGHT = 200;

const LineChart = ({ data = [], labels = [] }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const yLabels = ["0", "25", "50", "75", "100"];

    const normalizedData = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [0];

        return data.map((value) => {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return 0;
            return Math.max(0, Math.min(100, numeric));
        });
    }, [data]);

    const points = useMemo(() => {
        const totalPoints = normalizedData.length;
        if (totalPoints === 1) {
            const singleValue = normalizedData[0];
            return [{ x: CHART_WIDTH / 2, y: CHART_HEIGHT - (singleValue / 100) * CHART_HEIGHT, value: Math.round(singleValue) }];
        }

        const xStep = CHART_WIDTH / (totalPoints - 1);
        return normalizedData.map((value, idx) => ({
            x: idx * xStep,
            y: CHART_HEIGHT - (value / 100) * CHART_HEIGHT,
            value: Math.round(value),
        }));
    }, [normalizedData]);

    const linePath = useMemo(() => {
        if (points.length === 0) return '';
        return points
            .map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
            .join(' ');
    }, [points]);

    const areaPath = useMemo(() => {
        if (points.length === 0) return '';

        const path = points
            .map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
            .join(' ');

        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];
        return `${path} L ${lastPoint.x} ${CHART_HEIGHT} L ${firstPoint.x} ${CHART_HEIGHT} Z`;
    }, [points]);

    const xLabels = labels.length === normalizedData.length
        ? labels
        : Array.from({ length: normalizedData.length }, (_, idx) => `Week ${idx + 1}`);

    const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
    const hoveredLabel = hoveredIndex !== null ? xLabels[hoveredIndex] : '';

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ position: 'relative', height: '200px', width: '100%', marginBottom: '1.5rem' }} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Y-axis labels and grid lines */}
                {yLabels.map((lbl, idx) => (
                    <div key={idx} style={{ position: 'absolute', bottom: `${idx * 25}%`, width: '100%', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', textAlign: 'right', paddingRight: '0.5rem' }}>{lbl}</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>
                ))}

                {/* Chart SVG */}
                <svg viewBox="0 0 500 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: '0 0 0 30px', width: 'calc(100% - 30px)', height: '100%', overflow: 'visible' }}>
                    <path d={areaPath} fill="var(--primary-teal)" fillOpacity="0.3" />
                    <path d={linePath} fill="none" stroke="var(--primary-teal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((point, idx) => (
                        <circle
                            key={`${point.x}-${point.y}-${idx}`}
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === idx ? 5 : 3.5}
                            fill="var(--primary-teal)"
                            stroke="white"
                            strokeWidth={hoveredIndex === idx ? 2 : 1}
                            onMouseEnter={() => setHoveredIndex(idx)}
                        />
                    ))}

                    {hoveredPoint && (
                        <g>
                            <line
                                x1={hoveredPoint.x}
                                y1={hoveredPoint.y}
                                x2={hoveredPoint.x}
                                y2={CHART_HEIGHT}
                                stroke="var(--primary-teal)"
                                strokeOpacity="0.35"
                                strokeDasharray="4 3"
                            />
                            <rect
                                x={Math.max(0, Math.min(CHART_WIDTH - 120, hoveredPoint.x - 60))}
                                y={Math.max(8, hoveredPoint.y - 48)}
                                width="120"
                                height="36"
                                rx="8"
                                fill="rgba(19, 43, 68, 0.92)"
                                stroke="var(--primary-teal)"
                                strokeWidth="1"
                            />
                            <text
                                x={Math.max(0, Math.min(CHART_WIDTH - 120, hoveredPoint.x - 60)) + 10}
                                y={Math.max(8, hoveredPoint.y - 48) + 14}
                                fill="rgba(255,255,255,0.8)"
                                fontSize="10"
                            >
                                {hoveredLabel}
                            </text>
                            <text
                                x={Math.max(0, Math.min(CHART_WIDTH - 120, hoveredPoint.x - 60)) + 10}
                                y={Math.max(8, hoveredPoint.y - 48) + 28}
                                fill="white"
                                fontSize="12"
                                fontWeight="700"
                            >
                                {`${hoveredPoint.value}%`}
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '30px', paddingRight: '10px' }}>
                {xLabels.map((lbl, i) => (
                    <span key={i}>{lbl}</span>
                ))}
            </div>
        </div>
    );
};

export default LineChart;
