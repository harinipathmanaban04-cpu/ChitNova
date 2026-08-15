import React, { useState } from 'react';
import {
  Link,
  useNavigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import {
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('chitnova_theme') ===
      'dark'
  );

  const { user, logout } = useAuth();
  const nav = useNavigate();

  const toggle = () => {
    setDark((value) => {
      const next = !value;

      document.documentElement.dataset.theme =
        next ? 'dark' : 'light';

      localStorage.setItem(
        'chitnova_theme',
        next ? 'dark' : 'light'
      );

      return next;
    });
  };

  if (!document.documentElement.dataset.theme) {
    document.documentElement.dataset.theme =
      dark ? 'dark' : 'light';
  }

  const close = () => setOpen(false);

  if (location.pathname === '/dashboard') {
    return (
      <div className="dashboard-only-shell">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="app-shell">

      <header className="header">

        <Link
          className="brand"
          to="/"
          onClick={close}
        >
          <span className="brand-mark">
            C
          </span>

          <span>
            <b>CHITNOVA</b>
            <small>
              Save Together. Grow Secure.
            </small>
          </span>
        </Link>

        <nav
          className={
            open ? 'nav open' : 'nav'
          }
        >
          <Link to="/" onClick={close}>
            About Us
          </Link>

          <Link
            to="/plans"
            onClick={close}
          >
            Chit Plans
          </Link>

          <a
            href="/#how-it-works"
            onClick={close}
          >
            How It Works
          </a>

          <a
            href="/#benefits"
            onClick={close}
          >
            Benefits
          </a>

          <a
            href="/#faqs"
            onClick={close}
          >
            FAQs
          </a>

          <a
            href="/#contact"
            onClick={close}
          >
            Contact
          </a>
        </nav>

        <div className="header-actions">

          <button
            className="icon-btn"
            onClick={toggle}
            aria-label="Theme toggle"
          >
            {dark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {user ? (
            <>
              <Link
                className="btn ghost hide-sm"
                to="/dashboard"
              >
                Dashboard
              </Link>

              <button
                className="btn primary hide-sm"
                onClick={() => {
                  logout();
                  nav('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn ghost hide-sm"
                to="/login"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                className="btn primary hide-sm"
                to="/register"
              >
                <UserPlus size={16} />
                Join Now
              </Link>
            </>
          )}

          <button
            className="menu-btn"
            onClick={() =>
              setOpen((value) => !value)
            }
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>

      </header>

      <main>
        <Outlet />
      </main>

      <footer
        className="footer"
        id="contact"
      >
        <div className="footer-grid">

          <div>
            <div className="brand footer-brand">
              <span className="brand-mark">
                C
              </span>

              <span>
                <b>CHITNOVA</b>
                <small>
                  Save Together. Grow Secure.
                </small>
              </span>
            </div>

            <p>
              Modern, transparent chit management
              built around a simple customer experience.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <Link to="/">About Us</Link>
            <Link to="/plans">Chit Plans</Link>
            <a href="/#how-it-works">
              How It Works
            </a>
            <a href="/#faqs">FAQs</a>
          </div>

          <div>
            <h4>Customer Support</h4>
            <a href="tel:+919876543210">
              +91 98765 43210
            </a>
            <a href="mailto:support@chitnova.com">
              support@chitnova.com
            </a>
            <Link to="/messages">
              Message Agent
            </Link>
          </div>

          <div>
            <h4>Legal</h4>
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
            <span>Grievance Redressal</span>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Chitnova. All rights reserved.
          <span>
            Secure • Transparent • Customer-first
          </span>
        </div>

      </footer>

    </div>
  );
}