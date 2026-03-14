import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider, useAppStore } from './store/useAppStore';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulations from './pages/Simulations';
import SimulationDetail from './pages/SimulationDetail';
import ResultsSuccess from './pages/ResultsSuccess';
import ResultsRecap from './pages/ResultsRecap';
import Analytics from './pages/Analytics';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TrainingCampaigns from './pages/admin/TrainingCampaigns';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import AdminSettings from './pages/admin/AdminSettings';
import ModelManagement from './pages/maintainer/ModelManagement';
import DatasetManagement from './pages/maintainer/DatasetManagement';
import SampleGenerator from './pages/maintainer/SampleGenerator';
import DetectorContainer from "./phishingDetector/components/DetectorContainer";

// A wrapper to handle the root route logic since we need access to the store
const RootRedirect = () => {
  const { isLoggedIn, role } = useAppStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'aiMaintainer') return <Navigate to="/maintainer/models" replace />;
  return <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      {/* End User Flow (Protected) */}
      <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['user']}><Dashboard /></RoleProtectedRoute>} />
      <Route path="/simulations" element={<RoleProtectedRoute allowedRoles={['user']}><Simulations /></RoleProtectedRoute>} />
      <Route path="/simulations/:id" element={<RoleProtectedRoute allowedRoles={['user']}><SimulationDetail /></RoleProtectedRoute>} />
      <Route path="/results/success" element={<RoleProtectedRoute allowedRoles={['user']}><ResultsSuccess /></RoleProtectedRoute>} />
      <Route path="/results/recap" element={<RoleProtectedRoute allowedRoles={['user']}><ResultsRecap /></RoleProtectedRoute>} />
      <Route path="/analytics" element={<RoleProtectedRoute allowedRoles={['user']}><Analytics /></RoleProtectedRoute>} />

      {/* Admin Flow (Protected) */}
      <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
      <Route path="/admin/users" element={<RoleProtectedRoute allowedRoles={['admin']}><UserManagement /></RoleProtectedRoute>} />
      <Route path="/admin/campaigns" element={<RoleProtectedRoute allowedRoles={['admin']}><TrainingCampaigns /></RoleProtectedRoute>} />
      <Route path="/admin/reports" element={<RoleProtectedRoute allowedRoles={['admin']}><AnalyticsReports /></RoleProtectedRoute>} />
      <Route path="/admin/settings" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminSettings /></RoleProtectedRoute>} />

      {/* Maintainer Flow (Protected) */}
      {/* The base /maintainer route is now handled by RootRedirect, and specific sub-routes are defined below */}
      <Route path="/maintainer/models" element={<RoleProtectedRoute allowedRoles={['aiMaintainer']}><ModelManagement /></RoleProtectedRoute>} />
      <Route path="/maintainer/datasets" element={<RoleProtectedRoute allowedRoles={['aiMaintainer']}><DatasetManagement /></RoleProtectedRoute>} />
      <Route path="/maintainer/generator" element={<RoleProtectedRoute allowedRoles={['aiMaintainer']}><SampleGenerator /></RoleProtectedRoute>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
