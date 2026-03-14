import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, role } = useAppStore();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to their respective home
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'aiMaintainer') return <Navigate to="/maintainer/models" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
