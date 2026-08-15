import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import { AuthLayout } from './Login';

export default function ForgotPassword() {

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);


  /* ---------------------------
     RESEND COUNTDOWN
  ---------------------------- */

  useEffect(() => {

    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [resendTimer]);


  /* ---------------------------
     SEND OTP
  ---------------------------- */

  const sendOtp = async (e) => {

    if (e) {
      e.preventDefault();
    }

    setErr('');
    setMsg('');
    setLoading(true);

    try {

      await api.post('/auth/forgot-password', {
        email
      });

      setStep(2);

      setMsg(
        'OTP sent to your registered Gmail.'
      );

      setResendTimer(60);

    } catch (x) {

      setErr(
        x.response?.data?.message ||
        'Unable to send OTP'
      );

    } finally {

      setLoading(false);

    }
  };


  /* ---------------------------
     VERIFY OTP
  ---------------------------- */

  const verifyOtp = async (e) => {

    e.preventDefault();

    setErr('');
    setMsg('');
    setLoading(true);

    try {

      await api.post('/auth/verify-otp', {
        email,
        otp
      });

      setStep(3);

      setMsg(
        'OTP verified successfully. Create a new password.'
      );

    } catch (x) {

      setErr(
        x.response?.data?.message ||
        'Invalid or expired OTP'
      );

    } finally {

      setLoading(false);

    }
  };


  /* ---------------------------
     RESEND OTP
  ---------------------------- */

  const resendOtp = async () => {

    if (resendTimer > 0 || loading) {
      return;
    }

    setErr('');
    setMsg('');
    setLoading(true);

    try {

      await api.post('/auth/forgot-password', {
        email
      });

      setMsg(
        'A new OTP has been sent to your Gmail.'
      );

      setOtp('');

      setResendTimer(60);

    } catch (x) {

      setErr(
        x.response?.data?.message ||
        'Unable to resend OTP'
      );

    } finally {

      setLoading(false);

    }
  };


  /* ---------------------------
     RESET PASSWORD
  ---------------------------- */

  const resetPassword = async (e) => {

    e.preventDefault();

    setErr('');
    setMsg('');

    if (password.length < 8) {

      setErr(
        'Password must be at least 8 characters.'
      );

      return;
    }

    if (password !== confirmPassword) {

      setErr(
        'Passwords do not match.'
      );

      return;
    }

    setLoading(true);

    try {

      await api.post('/auth/reset-password', {
        email,
        otp,
        password
      });

      setStep(4);

      setMsg(
        'Password reset successfully.'
      );

    } catch (x) {

      setErr(
        x.response?.data?.message ||
        'Unable to reset password'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <AuthLayout
      title={
        step === 4
          ? 'Password updated'
          : 'Reset your password'
      }
      subtitle="Use your registered Gmail to securely recover your Chitnova account."
    >

      {/* =================================
          STEP 1 — EMAIL
      ================================== */}

      {step === 1 && (

        <form
          className="auth-form"
          onSubmit={sendOtp}
        >

          <label>
            Registered Gmail

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@gmail.com"
              required
            />
          </label>

          <button
            type="submit"
            className="btn primary full big"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>

        </form>

      )}


      {/* =================================
          STEP 2 — OTP
      ================================== */}

      {step === 2 && (

        <form
          className="auth-form"
          onSubmit={verifyOtp}
        >

          <div className="otp-note">

            OTP sent to:

            <br />

            <b>{email}</b>

          </div>


          <label>
            6-digit OTP

            <input
              inputMode="numeric"
              maxLength="6"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(
                    /\D/g,
                    ''
                  )
                )
              }
              placeholder="000000"
              required
            />
          </label>


          <button
            type="submit"
            className="btn primary full big"
            disabled={
              loading || otp.length !== 6
            }
          >
            {loading
              ? 'Verifying...'
              : 'Verify OTP'}
          </button>


          {/* RESEND */}

          <div className="resend-area">

            {resendTimer > 0 ? (

              <span>
                Resend OTP in{' '}
                <b>{resendTimer}s</b>
              </span>

            ) : (

              <button
                type="button"
                className="resend-btn"
                onClick={resendOtp}
                disabled={loading}
              >
                <RefreshCw size={15} />

                Resend OTP
              </button>

            )}

          </div>

        </form>

      )}


      {/* =================================
          STEP 3 — NEW PASSWORD
      ================================== */}

      {step === 3 && (

        <form
          className="auth-form"
          onSubmit={resetPassword}
        >

          <div className="otp-note">
            ✓ OTP verified successfully.
            <br />
            Create a new password below.
          </div>


          {/* NEW PASSWORD */}

          <label>
            New password

            <div className="password-input-wrap">

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 8 characters"
                minLength="8"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
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


          {/* CONFIRM PASSWORD */}

          <label>
            Confirm password

            <div className="password-input-wrap">

              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm your password"
                minLength="8"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </label>


          <button
            type="submit"
            className="btn primary full big"
            disabled={loading}
          >
            {loading
              ? 'Resetting...'
              : 'Reset Password'}
          </button>

        </form>

      )}


      {/* =================================
          STEP 4 — SUCCESS
      ================================== */}

      {step === 4 && (

        <div className="success-box">

          <b>Password reset successful ✓</b>

          <p>
            Your password has been changed.
            You can now sign in with your new password.
          </p>

          <Link
            className="btn primary full"
            to="/login"
          >
            Go to Login
          </Link>

        </div>

      )}


      {/* =================================
          MESSAGES
      ================================== */}

      {msg && (
        <div className="alert success">
          {msg}
        </div>
      )}

      {err && (
        <div className="alert error">
          {err}
        </div>
      )}


      <p className="auth-switch">
        <Link to="/login">
          Back to Login
        </Link>
      </p>

    </AuthLayout>
  );
}