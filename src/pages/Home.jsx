import { Link } from 'react-router-dom';
import { C } from '../theme';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 20px',
    }}>
      <div style={{
        fontSize: '48px',
        fontWeight: 100,
        letterSpacing: '12px',
        textTransform: 'uppercase',
        color: C.white,
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        alfie.love
      </div>
      <div style={{
        fontSize: '12px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: C.textMuted,
        marginBottom: '60px',
      }}>
        Games & More
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '680px',
        width: '100%',
      }}>
        <Link to="/games" style={{
          flex: '1 1 280px',
          background: C.card,
          border: '1px solid ' + C.cardBorder,
          borderRadius: '3px',
          padding: '40px 24px',
          textAlign: 'center',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}
        >
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>&#127918;</div>
          <div style={{
            fontSize: '14px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: C.white,
            fontWeight: 400,
            marginBottom: '8px',
          }}>Games</div>
          <div style={{ fontSize: '12px', color: C.textMuted }}>
            Play and learn
          </div>
        </Link>

        <Link to="/blog" style={{
          flex: '1 1 280px',
          background: C.card,
          border: '1px solid ' + C.cardBorder,
          borderRadius: '3px',
          padding: '40px 24px',
          textAlign: 'center',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}
        >
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>&#9997;&#65039;</div>
          <div style={{
            fontSize: '14px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: C.white,
            fontWeight: 400,
            marginBottom: '8px',
          }}>Blog</div>
          <div style={{ fontSize: '12px', color: C.textMuted }}>
            Stories and thoughts
          </div>
        </Link>
      </div>
    </div>
  );
}
