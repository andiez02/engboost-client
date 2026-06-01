export default function ListSection({ list, me, mode }) {
  const tail = list.slice(3);

  if (tail.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tail.map((entry, i) => {
        const rank = i + 4;
        const isMe = entry.userId === me?.userId;
        const xp = mode === 'weekly' ? entry.weeklyXp : mode === 'streak' ? entry.streak : entry.xp;

        return (
          <div
            key={entry.userId}
            className={`lb-list-item lb-animate-in${isMe ? ' is-me' : ''}`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className={`lb-rank-num${rank <= 3 ? ' top3' : ''}`}>{rank}</div>
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
                {mode === 'level'
                  ? `Level ${entry.level ?? '—'}`
                  : mode === 'streak'
                    ? `🔥 ${entry.streak ?? 0} ngày liên tiếp`
                    : entry.streak
                      ? `🔥 ${entry.streak} ngày`
                      : 'Học viên'}
              </div>
            </div>
            <div className="lb-item-xp">
              {mode === 'streak'
                ? `🔥 ${(xp ?? 0)} ngày`
                : `⚡ ${(xp ?? 0).toLocaleString()}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
