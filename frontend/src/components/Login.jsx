import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  GraduationCap,
  Briefcase,
  Shield,
  AlertCircle
} from 'lucide-react';
import EduTrackLogo from './EduTrackLogo';
import { DEMO_ACCOUNTS } from '../lib/demoAccounts';
import { authenticateUser, getUserCredentials } from '../lib/authCredentialsService';

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [identifier, setIdentifier] = useState('student@edutrack.edu');
  const [password, setPassword] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    const demo = DEMO_ACCOUNTS[roleKey];
    if (roleKey === 'student') {
      setIdentifier('RBT24IT001');
      setPassword('student');
    } else if (roleKey === 'teacher') {
      setIdentifier('FAC-IT-101');
      setPassword('teacher');
    } else {
      setIdentifier(demo.email);
      setPassword(demo.password);
    }
    setError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = authenticateUser(identifier, password);
      if (res.success) {
        onLogin(res.user);
      } else {
        // Fallback check against DEMO_ACCOUNTS
        const matchedDemo = Object.values(DEMO_ACCOUNTS).find(
          (acc) =>
            acc.email.toLowerCase() === identifier.trim().toLowerCase() ||
            (acc.id && acc.id.toLowerCase() === identifier.trim().toLowerCase())
        );

        if (matchedDemo && password === matchedDemo.password) {
          onLogin(matchedDemo);
        } else {
          setError(res.message || 'Invalid credentials. Please verify your PRN, Staff ID, or Email.');
          setIsSubmitting(false);
        }
      }
    }, 150);
  };

  return (
    <div className="login-viewport">
      {/* Background Orbital Rings */}
      <div className="orbital-ring ring-1" />
      <div className="orbital-ring ring-2" />
      <div className="orbital-ring ring-3" />
      <div className="orbital-ring ring-4" />

      {/* Top Left Brand Lockup */}
      <div className="login-brand-corner">
        <EduTrackLogo size="md" />
      </div>

      {/* Center Frosted Glass Card */}
      <div className="login-card">
        {/* Top Floating Squircle with Login Icon */}
        <div className="login-card-badge">
          <LogIn size={18} strokeWidth={2.2} />
        </div>

        {/* Heading & Subtitle */}
        <div className="login-card-header">
          <h1 className="login-card-title">Sign in with email</h1>
          <p className="login-card-subtitle">
            Access your student profile, faculty schedules, and academic records.
          </p>
        </div>

        {/* 3 Role Selector Tabs */}
        <div className="login-segmented-tabs">
          <button
            type="button"
            className={`login-segmented-tab ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => handleSelectRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`login-segmented-tab ${selectedRole === 'teacher' ? 'active' : ''}`}
            onClick={() => handleSelectRole('teacher')}
          >
            Teacher
          </button>
          <button
            type="button"
            className={`login-segmented-tab ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleSelectRole('admin')}
          >
            Admin
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleFormSubmit} className="login-form">
          <div className="login-input-row">
            <Mail size={16} className="login-input-icon" />
            <input
              type="text"
              required
              className="login-native-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or PRN / Staff ID (e.g. RBT24IT001)"
            />
          </div>

          <div className="login-input-row">
            <Lock size={16} className="login-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="login-native-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              className="login-pw-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="login-forgot-wrap">
            <button
              type="button"
              className="login-forgot-link"
              onClick={() => alert(`Default password for ${selectedRole} is: "${DEMO_ACCOUNTS[selectedRole].password}"`)}
            >
              Forgot password?
            </button>
          </div>

          {/* Primary "Get Started" Button */}
          <button
            type="submit"
            className="login-get-started-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Get Started'}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider-text">Or sign in with</div>

        {/* 3 Quick Role Tiles */}
        <div className="login-tiles-row">
          <button
            type="button"
            className="login-tile-btn"
            onClick={() => onLogin(DEMO_ACCOUNTS.student)}
            title="Instant Student Login"
          >
            <div className="login-tile-icon-box student">
              <GraduationCap size={15} />
            </div>
            <span className="login-tile-text">Student</span>
          </button>

          <button
            type="button"
            className="login-tile-btn"
            onClick={() => onLogin(DEMO_ACCOUNTS.teacher)}
            title="Instant Teacher Login"
          >
            <div className="login-tile-icon-box teacher">
              <Briefcase size={15} />
            </div>
            <span className="login-tile-text">Teacher</span>
          </button>

          <button
            type="button"
            className="login-tile-btn"
            onClick={() => onLogin(DEMO_ACCOUNTS.admin)}
            title="Instant Admin Login"
          >
            <div className="login-tile-icon-box admin">
              <Shield size={15} />
            </div>
            <span className="login-tile-text">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
