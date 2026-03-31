import { Link } from 'react-router-dom';
import { C } from '../theme';

const games = [
  {
    slug: 'lexicon',
    title: 'Lexicon',
    description: 'SAT vocabulary challenge — race, survival, or AI-scored typing mode',
    tags: ['Vocabulary', 'SAT Prep', 'Multiplayer'],
  },
];

export default function Games() {
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
        Games
      </div>
      <div style={{
        fontSize: '11px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: C.textMuted,
        marginBottom: '40px',
      }}>
        Pick something to play
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '680px',
        width: '100%',
      }}>
        {games.map(game => (
          <Link key={game.slug} to={'/games/' + game.slug} style={{
            background: C.card,
            border: '1px solid ' + C.cardBorder,
            borderRadius: '3px',
            padding: '24px 20px',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}
          >
            <div style={{
              fontSize: '18px',
              fontWeight: 400,
              letterSpacing: '2px',
              color: C.white,
              marginBottom: '6px',
            }}>
              {game.title}
            </div>
            <div style={{
              fontSize: '13px',
              color: C.textMuted,
              marginBottom: '12px',
              lineHeight: '1.5',
            }}>
              {game.description}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {game.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  background: C.purpleBg,
                  color: C.purple,
                  border: '1px solid rgba(155,142,196,0.15)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
