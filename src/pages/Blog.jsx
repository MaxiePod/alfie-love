import { C } from '../theme';

export default function Blog() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        fontSize: '32px',
        fontWeight: 100,
        letterSpacing: '8px',
        textTransform: 'uppercase',
        color: C.white,
        marginBottom: '4px',
      }}>
        Blog
      </div>
      <div style={{
        fontSize: '11px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: C.textMuted,
        marginBottom: '40px',
      }}>
        Coming soon
      </div>

      <div style={{
        background: C.card,
        border: '1px solid ' + C.cardBorder,
        borderRadius: '3px',
        padding: '60px 24px',
        maxWidth: '680px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '13px', color: C.textDim }}>
          No posts yet. Check back soon.
        </div>
      </div>
    </div>
  );
}
