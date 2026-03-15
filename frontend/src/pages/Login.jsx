import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldHalved, 
    faEye, 
    faEyeSlash,
    faArrowRight,
    faLock,
    faEnvelope,
    faUserPlus
} from '@fortawesome/free-solid-svg-icons';

// Demo convenience credentials for each role (stored but not autofilled)
const ROLE_CREDENTIALS = {
    user: { email: 'flagit@gmail.com', password: 'Pilon123' },
    admin: { email: 'admin@flagit.com', password: 'Pilon123' },
};

const Login = () => {
    const { login, register, logout } = useAppStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

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

    // Store credentials but don't autofill - just update state silently
    const handleRoleSwitch = (newRole) => {
        setSelectedRole(newRole);
        // Don't set email/password - let user type them
        setErrors({});
        setIsSignUp(false);
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

            // Enforce tab-role match
            if (selectedRole === 'user' && role !== 'user') {
                logout();
                setErrors({ email: 'This account is not authorized for the selected login tab.' });
                return;
            }
            if (selectedRole === 'admin' && role !== 'admin') {
                logout();
                setErrors({ email: 'This account is not authorized for the selected login tab.' });
                return;
            }

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.message || 'Invalid email or password';
            if (msg.toLowerCase().includes('password')) {
                setErrors({ password: msg });
            } else {
                setErrors({ email: msg });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await register(email, password);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.message || 'Failed to create account. Please try again.';
            if (msg.toLowerCase().includes('password')) {
                setErrors({ password: msg });
            } else {
                setErrors({ email: msg });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a1a2f 0%, #132B44 50%, #167f94 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)',
                zIndex: 0
            }} />

            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1200px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                borderRadius: '2rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.05)',
                zIndex: 1,
                margin: '2rem'
            }}>
                {/* Left side - Branding */}
                <div style={{
                    flex: 1,
                    padding: '3rem',
                    background: 'linear-gradient(135deg, rgba(19,43,68,0.8) 0%, rgba(22,127,148,0.8) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRight: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        border: '3px solid #F97316',
                        borderRadius: '50%',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        boxShadow: '0 10px 25px -5px rgba(249,115,22,0.3)',
                        overflow: 'hidden'
                    }}>
                        <img 
                            src="/icons/flagit-logo.png" 
                            alt="FlagIt" 
                            style={{ 
                                width: '100px', 
                                height: '100px',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                display: 'block',
                                transform: 'translate(0, 14px)'
                            }} 
                        />
                    </div>

                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        FlagIt
                    </h1>

                    <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        maxWidth: '300px',
                        marginBottom: '2rem'
                    }}>
                        Outsmarting Phishing, Together.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(249,115,22,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#F97316' }} />
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(45,212,191,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#2DD4BF' }} />
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(249,115,22,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#F97316' }} />
                        </div>
                    </div>

                    <div style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.85rem',
                        maxWidth: '250px'
                    }}>
                        Join thousands of organizations protecting their teams from phishing attacks
                    </div>
                </div>

                {/* Right side - Login/Signup Form */}
                <div style={{
                    flex: 1,
                    padding: '3rem',
                    backgroundColor: 'rgba(19,43,68,0.6)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                width: '4px',
                                height: '32px',
                                background: 'linear-gradient(180deg, #F97316, #2DD4BF)',
                                borderRadius: '2px'
                            }} />
                            <h2 style={{
                                fontSize: '1.8rem',
                                fontWeight: '600',
                                color: 'white',
                                margin: 0
                            }}>
                                {selectedRole === 'admin' ? 'Admin Access' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                            </h2>
                        </div>

                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.95rem',
                            marginBottom: '2rem'
                        }}>
                            {selectedRole === 'admin' 
                                ? 'Admin credentials required' 
                                : isSignUp 
                                ? 'Sign up to start your security training'
                                : 'Enter your credentials to access your account'}
                        </p>

                        {/* Role indicator for admin */}
                        {selectedRole === 'admin' && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(249,115,22,0.15)',
                                padding: '0.5rem 1rem',
                                borderRadius: '2rem',
                                marginBottom: '2rem'
                            }}>
                                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#F97316', fontSize: '0.8rem' }} />
                                <span style={{ color: '#F97316', fontSize: '0.85rem', fontWeight: '500' }}>
                                    Admin Access
                                </span>
                            </div>
                        )}

                        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>
                                    Email Address
                                </label>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <FontAwesomeIcon 
                                        icon={faEnvelope} 
                                        style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${errors.email ? '#dc2626' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: '1rem',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                            e.target.style.borderColor = '#F97316';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                            e.target.style.borderColor = errors.email ? '#dc2626' : 'rgba(255,255,255,0.1)';
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <div style={{
                                        color: '#dc2626',
                                        fontSize: '0.75rem',
                                        marginTop: '0.5rem'
                                    }}>
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    <label style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.85rem',
                                        fontWeight: '500'
                                    }}>
                                        Password
                                    </label>
                                    {selectedRole !== 'admin' && !isSignUp && (
                                        <a 
                                            href="#" 
                                            style={{
                                                color: '#F97316',
                                                fontSize: '0.8rem',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#2DD4BF'}
                                            onMouseLeave={(e) => e.target.style.color = '#F97316'}
                                        >
                                            Forgot password?
                                        </a>
                                    )}
                                </div>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <FontAwesomeIcon 
                                        icon={faLock} 
                                        style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 3rem 0.875rem 3rem',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${errors.password ? '#dc2626' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: '1rem',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                            e.target.style.borderColor = '#F97316';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                            e.target.style.borderColor = errors.password ? '#dc2626' : 'rgba(255,255,255,0.1)';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.4)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                {errors.password && (
                                    <div style={{
                                        color: '#dc2626',
                                        fontSize: '0.75rem',
                                        marginTop: '0.5rem'
                                    }}>
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Main Action Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: '#F97316',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '1rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    marginBottom: '1rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        e.target.style.backgroundColor = '#fb923c';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 10px 20px -5px rgba(249,115,22,0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSubmitting) {
                                        e.target.style.backgroundColor = '#F97316';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {isSubmitting ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                                {!isSubmitting && <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.9rem' }} />}
                            </button>

                            {/* Sign Up Button - Only show for user role and not in signup mode */}
                            {selectedRole === 'user' && !isSignUp && (
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(true)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        border: '1px solid rgba(249,115,22,0.3)',
                                        borderRadius: '1rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'rgba(249,115,22,0.1)';
                                        e.target.style.borderColor = '#F97316';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.borderColor = 'rgba(249,115,22,0.3)';
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    Create New Account
                                </button>
                            )}

                            {/* Back to Login Button - Only show in signup mode */}
                            {selectedRole === 'user' && isSignUp && (
                                <button
                                    type="button"
                                    onClick={() => { setIsSignUp(false); setErrors({}); }}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '1rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    ← Back to Login
                                </button>
                            )}
                        </form>

                        {/* Role switcher - Only user and admin */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '2rem',
                            flexWrap: 'wrap'
                        }}>
                            {['user', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleSwitch(role)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        backgroundColor: selectedRole === role ? '#F97316' : 'transparent',
                                        color: selectedRole === role ? 'white' : 'rgba(255,255,255,0.6)',
                                        border: `1px solid ${selectedRole === role ? '#F97316' : 'rgba(255,255,255,0.1)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedRole !== role) {
                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                            e.target.style.color = 'white';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedRole !== role) {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = 'rgba(255,255,255,0.6)';
                                        }
                                    }}
                                >
                                    {role === 'user' ? 'User Login' : 'Admin Login'}
                                </button>
                            ))}
                        </div>

                        {/* Demo credentials hint - subtle */}
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            borderRadius: '0.5rem',
                            border: '1px dashed rgba(249,115,22,0.3)',
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.4)',
                            textAlign: 'center'
                        }}>
                            <span style={{ color: '#F97316', fontWeight: '500' }}>Demo credentials:</span> flagit@gmail.com / Pilon123 (User) • admin@flagit.com / Pilon123 (Admin)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;