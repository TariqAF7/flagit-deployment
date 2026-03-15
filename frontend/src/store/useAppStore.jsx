import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_MODULES, INITIAL_SIMULATIONS, MOCK_USER, ADMIN_STATS, MOCK_USERS, ACTIVE_CAMPAIGNS, PAST_CAMPAIGNS, REPORT_TRENDS, AI_MODELS, AI_DATASETS } from '../data/seed';
import { loginUser, registerUser } from '../api/auth';
import { fetchModules } from '../api/modules';
import { fetchSimulations, submitSimulation, fetchHistory, fetchLastResult } from '../api/simulations';

const AppStateContext = createContext(null);

const safeLoad = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn(`Error parsing localStorage key "${key}":`, e);
        return fallback;
    }
};

/**
 * Normalize backend role string to frontend role string.
 * Backend: 'user' | 'admin' | 'ai_maintainer'
 * Frontend: 'user' | 'admin' | 'aiMaintainer'
 */
const normalizeRole = (backendRole) => {
    if (backendRole === 'ai_maintainer') return 'aiMaintainer';
    return backendRole || 'user';
};

export const AppStateProvider = ({ children }) => {
    // ── Auth State ────────────────────────────────────────────
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('flagit_token');
    });

    const [role, setRole] = useState(() => {
        const savedUser = safeLoad('flagit_user', null);
        return savedUser ? normalizeRole(savedUser.role) : 'user';
    });

    const [user, setUser] = useState(() => safeLoad('flagit_user', MOCK_USER));

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // ── User Data State ───────────────────────────────────────
    const [resilienceScore, setResilienceScore] = useState(() => {
        const savedUser = safeLoad('flagit_user', null);
        return savedUser?.resilienceScore ?? MOCK_USER.resilienceScore;
    });

    const [stats, setStats] = useState(() => {
        const savedUser = safeLoad('flagit_user', null);
        return savedUser?.stats ?? MOCK_USER.stats;
    });

    const [modules, setModules] = useState(() => safeLoad('flagit_modules', INITIAL_MODULES));
    const [simulations, setSimulations] = useState(() => safeLoad('flagit_simulations', INITIAL_SIMULATIONS));
    const [resultsHistory, setResultsHistory] = useState(() => safeLoad('flagit_history', []));

    // ── Admin States ──────────────────────────────────────────
    const [adminUsers, setAdminUsers] = useState(() => safeLoad('flagit_adminUsers', MOCK_USERS));
    const [adminActiveCampaigns, setAdminActiveCampaigns] = useState(() => safeLoad('flagit_adminActiveCampaigns', ACTIVE_CAMPAIGNS));
    const [adminStats, setAdminStats] = useState(ADMIN_STATS);
    const [adminPastCampaigns, setAdminPastCampaigns] = useState(PAST_CAMPAIGNS);
    const [reportTrends, setReportTrends] = useState(REPORT_TRENDS);

    // ── AI Maintainer States ──────────────────────────────────
    const [aiModels, setAiModels] = useState(() => safeLoad('flagit_aiModels', AI_MODELS));
    const [aiDatasets, setAiDatasets] = useState(() => safeLoad('flagit_aiDatasets', AI_DATASETS));
    const [aiSamples, setAiSamples] = useState(() => safeLoad('flagit_aiSamples', []));

    // ── Persist lightweight state to localStorage ─────────────
    useEffect(() => {
        localStorage.setItem('flagit_modules', JSON.stringify(modules));
        localStorage.setItem('flagit_simulations', JSON.stringify(simulations));
        localStorage.setItem('flagit_history', JSON.stringify(resultsHistory));
        localStorage.setItem('flagit_adminUsers', JSON.stringify(adminUsers));
        localStorage.setItem('flagit_adminActiveCampaigns', JSON.stringify(adminActiveCampaigns));
        localStorage.setItem('flagit_aiModels', JSON.stringify(aiModels));
        localStorage.setItem('flagit_aiDatasets', JSON.stringify(aiDatasets));
        localStorage.setItem('flagit_aiSamples', JSON.stringify(aiSamples));
    }, [modules, simulations, resultsHistory, adminUsers, adminActiveCampaigns, aiModels, aiDatasets, aiSamples]);

    // ── Hydrate data after login ──────────────────────────────
    const hydrateUserData = useCallback(async (userRole) => {
        try {
            // Fetch modules and simulations in parallel
            const [mods, sims] = await Promise.all([
                fetchModules(),
                fetchSimulations(),
            ]);

            if (Array.isArray(mods)) {
                setModules(mods.map(m => ({
                    id: m._id,
                    title: m.title,
                    description: m.description,
                    icon: m.icon,
                    rating: m.rating,
                    difficulty: m.difficulty,
                    duration: m.duration,
                    progress: 0,
                })));
            }

            if (Array.isArray(sims)) {
                setSimulations(sims.map(s => ({
                    id: s._id,
                    title: s.title,
                    description: s.description,
                    icon: s.icon,
                    rating: s.rating,
                    difficulty: s.difficulty,
                    tags: s.tags || [],
                    playCount: s.playCount || 0,
                    createdAt: s.createdAt,
                    progress: 0,
                })));
            }

            // Fetch results history for users
            if (userRole === 'user') {
                try {
                    const hist = await fetchHistory();
                    if (Array.isArray(hist)) {
                        setResultsHistory(hist.map(r => ({
                            id: r._id,
                            simulationId: r.simulationId?._id || r.simulationId,
                            choice: r.choice,
                            isCorrect: r.isCorrect,
                            timestamp: r.createdAt,
                        })));
                    }
                } catch {
                    // Non-critical — keep existing history
                }
            }
        } catch (err) {
            console.warn('Background data hydration failed:', err.message);
            // Non-fatal — seed data remains as fallback
        }
    }, []);

    // ── Login ─────────────────────────────────────────────────
    /**
     * Replaces the mock login with a real API call.
     * @param {string} email
     * @param {string} password
     * @returns {string} role - normalized frontend role e.g. 'admin'
     * @throws {Error} with user-friendly message on failure
     */
    const login = async (email, password) => {
        setLoading(true);
        setApiError(null);
        try {
            const { user: apiUser, token } = await loginUser(email, password);

            // Persist token and user
            localStorage.setItem('flagit_token', token);
            localStorage.setItem('flagit_user', JSON.stringify(apiUser));

            const normalizedRole = normalizeRole(apiUser.role);

            // Update state
            setUser(apiUser);
            setRole(normalizedRole);
            setIsLoggedIn(true);
            setResilienceScore(apiUser.resilienceScore ?? 0);
            setStats(apiUser.stats ?? { simulationsCompleted: 0, phishDetected: 0, modulesFinished: 0 });

            // Fetch live data in background (non-blocking)
            hydrateUserData(normalizedRole);

            return normalizedRole;
        } catch (err) {
            setApiError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ── Register ──────────────────────────────────────────────
    /**
     * Creates a new user account and logs them in automatically.
     * @param {string} email
     * @param {string} password
     * @returns {string} 'user'
     * @throws {Error} with user-friendly message on failure
     */
    const register = async (email, password) => {
        // Derive a name from the email prefix
        const name = email.split('@')[0];
        setLoading(true);
        setApiError(null);
        try {
            const { user: apiUser, token } = await registerUser(name, email, password);

            localStorage.setItem('flagit_token', token);
            localStorage.setItem('flagit_user', JSON.stringify(apiUser));

            const normalizedRole = normalizeRole(apiUser.role);

            setUser(apiUser);
            setRole(normalizedRole);
            setIsLoggedIn(true);
            setResilienceScore(apiUser.resilienceScore ?? 0);
            setStats(apiUser.stats ?? { simulationsCompleted: 0, phishDetected: 0, modulesFinished: 0 });

            hydrateUserData(normalizedRole);

            return normalizedRole;
        } catch (err) {
            setApiError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ── Logout ────────────────────────────────────────────────
    const logout = () => {
        localStorage.removeItem('flagit_token');
        localStorage.removeItem('flagit_user');
        localStorage.removeItem('flagit_history');
        setIsLoggedIn(false);
        setRole('user');
        setUser(MOCK_USER);
        setResilienceScore(MOCK_USER.resilienceScore);
        setStats(MOCK_USER.stats);
        setResultsHistory([]);
    };

    // ── Report Simulation ─────────────────────────────────────
    /**
     * Submits simulation choice to the backend and updates local stats.
     * Falls back to local computation if API fails.
     */
    const reportSimulation = async (simId, choice, responseTime = 0, flagged = false) => {
        try {
            const result = await submitSimulation(simId, choice, responseTime, flagged);
            const isCorrect = result.isCorrect;

            const newEntry = {
                id: Date.now(),
                simulationId: simId,
                choice,
                isCorrect,
                flagged: result.flagged ?? flagged,
                timestamp: new Date().toISOString(),
            };

            setResultsHistory(prev => [...prev, newEntry]);

            if (result.updatedResilienceScore !== undefined) {
                setResilienceScore(result.updatedResilienceScore);
            }

            setStats(prev => ({
                ...prev,
                simulationsCompleted: prev.simulationsCompleted + 1,
                phishDetected: (isCorrect && choice === 'phish') ? prev.phishDetected + 1 : prev.phishDetected,
            }));

            return isCorrect;
        } catch (err) {
            console.warn('Submit API failed, using local fallback:', err.message);
            // Local fallback: all seeded simulations are phishing
            const isCorrect = choice === 'phish';
            const newEntry = {
                id: Date.now(),
                simulationId: simId,
                choice,
                isCorrect,
                flagged,
                timestamp: new Date().toISOString(),
            };
            setResultsHistory(prev => [...prev, newEntry]);
            setStats(prev => ({
                ...prev,
                simulationsCompleted: prev.simulationsCompleted + 1,
                phishDetected: (isCorrect && choice === 'phish') ? prev.phishDetected + 1 : prev.phishDetected,
            }));
            return isCorrect;
        }
    };

    const getLastResult = () => {
        return resultsHistory.length > 0 ? resultsHistory[resultsHistory.length - 1] : null;
    };

    return (
        <AppStateContext.Provider value={{
            // Auth
            isLoggedIn, role, user, login, register, logout, loading, apiError,
            // User data
            stats, resilienceScore,
            modules, simulations, resultsHistory,
            reportSimulation, getLastResult,
            // Admin
            adminUsers, setAdminUsers,
            adminActiveCampaigns, setAdminActiveCampaigns,
            adminStats, setAdminStats,
            adminPastCampaigns, setAdminPastCampaigns,
            reportTrends, setReportTrends,
            // AI Maintainer
            aiModels, setAiModels,
            aiDatasets, setAiDatasets,
            aiSamples, setAiSamples,
        }}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppStore must be used within AppStateProvider');
    }
    return context;
};
