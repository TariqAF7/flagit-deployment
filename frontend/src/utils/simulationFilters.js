export const filterSimulations = ({
    simulationData = [],
    filter = 'all',
    timeRange = 'all',
    resultsHistory = []
}) => {
    let filtered = [...simulationData];
    const now = new Date();

    if (timeRange === '2weeks') {
        const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(s => !s.createdAt || new Date(s.createdAt) >= cutoff);
    } else if (timeRange === 'month') {
        const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(s => !s.createdAt || new Date(s.createdAt) >= cutoff);
    }

    if (filter === 'new') {
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        filtered = filtered.filter(s => s.createdAt && new Date(s.createdAt) >= dayAgo);
    } else if (filter === 'popular') {
        filtered = [...filtered].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 3);
    } else if (filter === 'recommended') {
        const attemptedIds = new Set(resultsHistory.map(r => r.simulationId));
        filtered = filtered.filter(s => !attemptedIds.has(s.id));
    }

    return filtered;
};
