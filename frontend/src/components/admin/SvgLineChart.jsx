import React from 'react';

const SvgLineChart = ({ data }) => {
    const width = 800;
    const height = 300;
    const padding = 40;
    const maxY = 300;

    const getX = (index) => padding + (index * (width - padding * 2) / (data.length - 1));
    const getY = (value) => height - padding - (value / maxY) * (height - padding * 2);

    const makePathData = (key) => {
        return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
    };

    const makeAreaPathData = (key) => {
        const path = makePathData(key);
        return `${path} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '600px', height: 'auto', display: 'block' }}>
                {/* Grid Lines */}
                {[0, 75, 150, 225, 300].map(val => (
                    <g key={val}>
                        <line x1={padding} y1={getY(val)} x2={width - padding} y2={getY(val)} stroke="#e2e8f0" strokeWidth="1" />
                        <text x={padding - 10} y={getY(val) + 4} fontSize="12" fill="var(--text-muted)" textAnchor="end">{val}</text>
                    </g>
                ))}

                {/* X Axis Labels */}
                {data.map((d, i) => (
                    <text key={i} x={getX(i)} y={height - padding + 20} fontSize="12" fill="var(--text-muted)" textAnchor="middle">{d.w}</text>
                ))}

                {/* Total Area */}
                <path d={makeAreaPathData('total')} fill="#cbd5e1" opacity="0.3" />
                <path d={makeAreaPathData('detected')} fill="#bae6fd" opacity="0.4" />

                {/* Lines */}
                <path d={makePathData('total')} fill="none" stroke="#ef4444" strokeWidth="3" />
                <path d={makePathData('detected')} fill="none" stroke="#f59e0b" strokeWidth="3" />
                <path d={makePathData('reported')} fill="none" stroke="#22c55e" strokeWidth="3" />

                {/* Points */}
                {data.map((d, i) => (
                    <g key={i}>
                        <circle cx={getX(i)} cy={getY(d.total)} r="4" fill="#ef4444" />
                        <circle cx={getX(i)} cy={getY(d.detected)} r="4" fill="#f59e0b" />
                        <circle cx={getX(i)} cy={getY(d.reported)} r="4" fill="#22c55e" />
                    </g>
                ))}
            </svg>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                    Total Incidents
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                    Detected
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                    Reported
                </div>
            </div>
        </div>
    );
};

export default SvgLineChart;
