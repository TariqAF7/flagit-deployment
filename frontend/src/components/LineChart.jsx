import React from 'react';

const LineChart = () => {
    // Dummy path data for simple area/line chart matching screenshot
    // Width 500, Height 200
    // Points approx: (0, 150), (100, 140), (200, 100), (300, 80), (400, 70), (500, 60)

    // Scale for visual: 0 y is top, so 200 is bottom (y=0 in chart)
    const linePath = "M 0 140 L 83 130 L 166 80 L 250 65 L 333 55 L 416 48 L 500 45";
    const areaPath = "M 0 200 L 0 140 L 83 130 L 166 80 L 250 65 L 333 55 L 416 48 L 500 45 L 500 200 Z";

    const xLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];
    const yLabels = ["0", "25", "50", "75", "100"]; // From bottom to top

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ position: 'relative', height: '200px', width: '100%', marginBottom: '1.5rem' }}>
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
