import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

// Demo convenience credentials for each role
const ROLE_CREDENTIALS = {
    user: { email: 'flagit@gmail.com', password: 'Pilon123' },
    admin: { email: 'admin@flagit.com', password: 'Pilon123' },
    aiMaintainer: { email: 'ai@flagit.com', password: 'Pilon123' },
};

const Login = () => {
    const { login } = useAppStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('flagit@gmail.com');
    const [password, setPassword] = useState('Pilon123');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is not valid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    // Autofill credentials for the selected demo role
    const handleRoleSwitch = (newRole) => {
        setSelectedRole(newRole);
        const creds = ROLE_CREDENTIALS[newRole];
        if (creds) {
            setEmail(creds.email);
            setPassword(creds.password);
        }
        setErrors({});
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const role = await login(email, password);

            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'aiMaintainer') {
                navigate('/maintainer/models');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setErrors({ email: err.message || 'Invalid email or password' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-layout" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <div className="card auth-card" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: '0' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: '0.5rem' }}>
                        <svg viewBox="0 0 100 100" width="80" height="80">
                            <path d="M50 10 L10 30 L10 60 C10 80 50 95 50 95 C50 95 90 80 90 60 L90 30 Z" fill="var(--deep-navy)" />
                            <path d="M50 15 L15 33 L15 58 C15 75 50 88 50 88 C50 88 85 75 85 58 L85 33 Z" fill="var(--accent-orange)" />
                            <path d="M50 20 L20 36 L20 56 C20 70 50 81 50 81 C50 81 80 70 80 56 L80 36 Z" fill="var(--secondary-teal)" />
                            <path d="M50 40 C40 40 30 50 30 50 C30 50 40 60 50 60 C60 60 70 50 70 50 C70 50 60 40 50 40 Z" fill="var(--deep-navy)" />
                            <circle cx="50" cy="50" r="10" fill="var(--primary-teal)" />
                            <circle cx="50" cy="50" r="4" fill="white" />
                            <path d="M48 50 L48 60 C46 62 54 62 52 60 L52 50 Z" fill="white" />
                        </svg>
                    </div>
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>FLAGIT</h1>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Login</h2>

                {selectedRole !== 'user' && (
                    <div style={{ display: 'inline-block', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {selectedRole === 'admin' ? 'Logging in as Admin' : 'Maintainer Login'}
                    </div>
                )}

                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Enter your email and password below</p>

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
                            <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Forgot password?</a>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="form-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full mt-4"
                        style={{ borderRadius: '0.25rem', padding: '0.875rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in…' : 'Log In'}
                    </button>
                </form>

                <div className="flex justify-between mt-6 text-sm">
                    {selectedRole !== 'admin' && (
                        <button type="button" onClick={() => handleRoleSwitch('admin')} className="btn-text" style={{ color: 'var(--accent-orange)' }}>
                            Login as Admin
                        </button>
                    )}
                    {selectedRole !== 'aiMaintainer' && (
                        <button type="button" onClick={() => handleRoleSwitch('aiMaintainer')} className="btn-text" style={{ color: 'var(--accent-orange)' }}>
                            Login as AI Maintainer
                        </button>
                    )}
                    {selectedRole !== 'user' && (
                        <button type="button" onClick={() => handleRoleSwitch('user')} className="btn-text" style={{ color: 'var(--primary-teal)' }}>
                            Login as User
                        </button>
                    )}
                </div>

                <div className="mt-6 text-sm text-muted" style={{ color: 'var(--text-muted)' }}>
                    Don't have an account? <a href="#" style={{ color: 'blue', textDecoration: 'none' }}>Sign up here</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
