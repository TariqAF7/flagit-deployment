import React, { useMemo, useState } from 'react';

const DEFAULT_LABELS = ['Deceptive URLs', 'BiTB Attacks', 'Psychological Tactics', 'Credential Harvesting'];
const CENTER_X = 100;
const CENTER_Y = 100;
const RADIUS = 70;

const axisMeta = [
    { x: 100, y: 30, labelX: 100, labelY: 20, textAnchor: 'middle' },
    { x: 170, y: 100, labelX: 175, labelY: 103, textAnchor: 'start' },
    { x: 100, y: 170, labelX: 100, labelY: 185, textAnchor: 'middle' },
    { x: 30, y: 100, labelX: 25, labelY: 103, textAnchor: 'end' }
];

const RadarChart = ({ data = [], labels = DEFAULT_LABELS, textColor = '#167f94', gridColor = '#cbd5e1' }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const normalizedData = useMemo(() => {
        const input = Array.isArray(data) ? data.slice(0, 4) : [];
        while (input.length < 4) input.push(0);

        return input.map((value) => {
            const numericValue = Number(value);
            if (!Number.isFinite(numericValue)) return 0;
            return Math.max(0, Math.min(100, Math.round(numericValue)));
        });
    }, [data]);

    const normalizedLabels = useMemo(() => {
        const input = Array.isArray(labels) ? labels.slice(0, 4) : [];
        while (input.length < 4) input.push(DEFAULT_LABELS[input.length]);
        return input;
    }, [labels]);

    const points = useMemo(() => {
        return normalizedData.map((value, idx) => {
            const ratio = value / 100;
            const target = axisMeta[idx];
            const x = CENTER_X + (target.x - CENTER_X) * ratio;
            const y = CENTER_Y + (target.y - CENTER_Y) * ratio;
            return { x, y, value };
        });
    }, [normalizedData]);

    const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ');
    const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

    return (
        <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto' }}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', overflow: 'visible' }} onMouseLeave={() => setHoveredIndex(null)}>
                <polygon points="100,30 170,100 100,170 30,100" fill="#f8fafc" stroke={gridColor} strokeWidth="1" />
                <polygon points="100,53 147,100 100,147 53,100" fill="none" stroke={gridColor} strokeWidth="1" />
                <polygon points="100,76 124,100 100,124 76,100" fill="none" stroke={gridColor} strokeWidth="1" />

                <line x1="100" y1="30" x2="100" y2="170" stroke={gridColor} strokeDasharray="4 2" />
                <line x1="30" y1="100" x2="170" y2="100" stroke={gridColor} strokeDasharray="4 2" />

                <polygon points={polygonPoints} fill="var(--primary-teal)" fillOpacity="0.4" stroke="var(--primary-teal)" strokeWidth="2" strokeLinejoin="round" />

                {points.map((point, idx) => (
                    <circle
                        key={`${point.x}-${point.y}-${idx}`}
                        cx={point.x}
                        cy={point.y}
                        r={hoveredIndex === idx ? 5 : 4}
                        fill="var(--primary-teal)"
                        stroke="white"
                        strokeWidth={hoveredIndex === idx ? 2 : 1.5}
                        onMouseEnter={() => setHoveredIndex(idx)}
                    />
                ))}

                {points.map((point, idx) => (
                    <line
                        key={`guide-${idx}`}
                        x1={point.x}
                        y1={point.y}
                        x2={axisMeta[idx].x}
                        y2={axisMeta[idx].y}
                        stroke={textColor}
                        strokeWidth="1"
                        strokeDasharray="3 2"
                        opacity="0.6"
                    />
                ))}

                {normalizedLabels.map((label, idx) => (
                    <text
                        key={label}
                        x={axisMeta[idx].labelX}
                        y={axisMeta[idx].labelY}
                        textAnchor={axisMeta[idx].textAnchor}
                        fontSize="10"
                        fill={textColor}
                        fontWeight="500"
                    >
                        {label}
                    </text>
                ))}

                {hoveredPoint && (
                    <g>
                        <rect
                            x={Math.max(8, Math.min(112, hoveredPoint.x - 44))}
                            y={Math.max(8, hoveredPoint.y - 36)}
                            width="88"
                            height="28"
                            rx="6"
                            fill="rgba(19, 43, 68, 0.92)"
                            stroke="var(--primary-teal)"
                            strokeWidth="1"
                        />
                        <text
                            x={Math.max(8, Math.min(112, hoveredPoint.x - 44)) + 8}
                            y={Math.max(8, hoveredPoint.y - 36) + 18}
                            fill="white"
                            fontSize="11"
                            fontWeight="700"
                        >
                            {`${hoveredPoint.value}%`}
                        </text>
                    </g>
                )}
            </svg>
        </div>
    );
};

export default RadarChart;