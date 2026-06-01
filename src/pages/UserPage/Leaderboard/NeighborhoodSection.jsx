// Shows 2 users above + current user + 2 users below when user is outside top 50
export default function NeighborhoodSection({ neighbors, me, mode }) {
  if (!neighbors || neighbors.length === 0) return null;

  return (
    <div style={{ marginTop: 8 }}>
      {/* Separator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px',
      }}>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, transparent, #E0E0E0)' }} />
        <span style={{
          fontSize: '0.75rem', fontWeight: 800, color: '#AFAFAF',
          letterSpacing: '0.08em', whiteSpace: 'nowrap',
        }}>
          ··· Vị trí của bạn ···
        </span>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #E0E0E0, transparent)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {neighbors.map((entry, i) => {
          const isMe = entry.userId === me?.userId;
          const xp = mode === 'weekly' ? entry.weeklyXp : entry.xp;

          return (
            <div
              key={entry.userId}
              className={`lb-list-item lb-animate-in${isMe ? ' is-me' : ''}`}
              style={{
                animationDelay: `${i * 0.04}s`,
                opacity: isMe ? 1 : 0.72,
                transform: isMe ? 'scale(1.01)' : undefined,
              }}
            >
              <div className={`lb-rank-num${entry.rank <= 3 ? ' top3' : ''}`}>
                {entry.rank}
              </div>
              <img
                src={entry.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${entry.userId}`}
                className="lb-item-avatar"
                style={isMe ? { border: '2.5px solid #FF9600' } : undefined}
                alt={entry.name}
              />
              <div className="lb-item-info">
                <div className="lb-item-name">
                  {entry.name || 'Ẩn danh'}
                  {isMe && <span className="lb-item-me-badge">Bạn</span>}
                </div>
                <div className="lb-item-sub">
                  {mode === 'level' ? `Level ${entry.level ?? '—'}` : 'Học viên'}
                </div>
              </div>
              <div className="lb-item-xp">⚡ {(xp ?? 0).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
