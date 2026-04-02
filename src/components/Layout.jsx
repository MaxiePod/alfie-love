import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { C } from '../theme';
import { APP_VERSION } from '../App';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/games', label: 'Games' },
  { path: '/blog', label: 'Blog' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: C.card,
        borderBottom: '1px solid ' + C.cardBorder,
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
        }}>
          <Link to="/" style={{
            fontSize: '18px',
            fontWeight: 100,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: C.white,
          }}>
            alfie.love
          </Link>

          {/* Desktop nav */}
          <div style={{
            display: 'flex',
            gap: '32px',
          }} className="desktop-nav">
            {navItems.map(item => {
              const active = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path} style={{
                  fontSize: '11px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: active ? C.white : C.textMuted,
                  fontWeight: active ? 400 : 300,
                  transition: 'color 0.2s',
                  borderBottom: active ? '1px solid ' + C.accent : '1px solid transparent',
                  paddingBottom: '2px',
                }}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: C.textMuted,
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {menuOpen ? '\u2715' : '\u2630'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-dropdown" style={{
            display: 'none',
            flexDirection: 'column',
            gap: '8px',
            paddingBottom: '16px',
          }}>
            {navItems.map(item => {
              const active = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: '12px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: active ? C.white : C.textMuted,
                    fontWeight: active ? 400 : 300,
                    padding: '8px 0',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <footer style={{
        borderTop: '1px solid ' + C.cardBorder,
        padding: '24px',
        textAlign: 'center',
        fontSize: '11px',
        letterSpacing: '2px',
        color: C.textDim,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span>alfie.love</span>
        <span style={{
          fontSize: '9px',
          letterSpacing: '1px',
          padding: '2px 8px',
          borderRadius: '2px',
          background: C.inputBg,
          border: '1px solid ' + C.inputBorder,
          color: C.textDim,
        }}>{APP_VERSION}</span>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-dropdown { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
