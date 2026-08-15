import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, UserRound, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      await login(form);
      nav('/dashboard');
    } catch (x) {
      setErr(
        x.response?.data?.message ||
        'Invalid username/email or password'
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to view your chit account, payments and notifications."
    >
      <form onSubmit={submit} className="auth-form">

        {/* Username / Gmail */}
        <label>
          Username or Gmail

          <div className="password-input-wrap">
            <input
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value
                })
              }
              placeholder="Enter username or Gmail"
              required
            />

            <UserRound className="input-icon" />
          </div>
        </label>

        {/* Password */}
        <label>
          Password

          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              placeholder="Enter password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </label>

        {err && (
          <div className="alert error">
            {err}
          </div>
        )}

        <div className="form-row">
          <span>Secure member login</span>

          <Link to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn primary full big"
        >
          Login
        </button>

        <p className="auth-switch">
          New to Chitnova?{' '}
          <Link to="/register">
            Create your account
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}


export function AuthLayout({
  title,
  subtitle,
  children
}) {
  return (
    <div className="auth-page">

      <div className="auth-art">
        <span className="eyebrow">
          CHITNOVA MEMBER PORTAL
        </span>

        <h1>
          Simple money management,
          designed around you.
        </h1>

        <p>
          Track your plan, monthly dues, receipts,
          auction updates and agent messages from
          one secure place.
        </p>

        <div className="auth-points">
          <span>✓ Secure authentication</span>
          <span>✓ Digital receipts</span>
          <span>✓ Payment reminders</span>
        </div>
      </div>

      <div className="auth-card">

        <div className="auth-brand">
           <b>CHITNOVA</b>
        </div>

        <h2>{title}</h2>

        <p>{subtitle}</p>

        {children}

      </div>

    </div>
  );
}