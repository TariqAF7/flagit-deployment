import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAppStore();

    // Also check localStorage directly as a fallback for page refreshes
    const hasToken = !!localStorage.getItem('flagit_token');

    if (!isLoggedIn && !hasToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
