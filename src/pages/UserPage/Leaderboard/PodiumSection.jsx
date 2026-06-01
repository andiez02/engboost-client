const RANK_COLORS = {
  1: { badge: '#F7C61A', block: 'linear-gradient(180deg, #FFE566 0%, #F7C61A 100%)', height: 90 },
  2: { badge: '#B0BEC5', block: 'linear-gradient(180deg, #E0E7EA 0%, #B0BEC5 100%)', height: 68 },
  3: { badge: '#E07C42', block: 'linear-gradient(180deg, #F2B97A 0%, #E07C42 100%)', height: 52 },
};

// Display order: 2nd, 1st, 3rd
const DISPLAY_ORDER = [1, 0, 2];
const DISPLAY_RANKS = [2, 1, 3];

export default function PodiumSection({ list, me, mode = 'weekly' }) {
  return (
    <div className="lb-podium-wrap">
      {DISPLAY_ORDER.map((idx, i) => {
        const entry = list[idx];
        if (!entry) return null;
        const rank = DISPLAY_RANKS[i];
        const cfg = RANK_COLORS[rank];
        const isMe = entry.userId === me?.userId;

        return (
          <div key={entry.userId} className="lb-podium-item">
            {rank === 1 && <span style={{ fontSize: '1.6rem', marginBottom: 2 }}>👑</span>}
            <div className="lb-podium-avatar-wrap">
              <img
                src={entry.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${entry.userId}`}
                className="lb-podium-avatar"
                style={{
                  width: rank === 1 ? 64 : 52,
                  height: rank === 1 ? 64 : 52,
                  border: isMe ? '3px solid #FF9600' : '3px solid #fff',
                }}
                alt={entry.name}
              />
              <div className="lb-podium-rank-badge" style={{ background: cfg.badge }}>
                {rank}
              </div>
            </div>
            <div className="lb-podium-name">{entry.name || 'Ẩn danh'}</div>
            <div className="lb-podium-xp">
              {mode === 'streak'
                ? `🔥 ${entry.streak ?? 0} ngày`
                : `⚡ ${(entry.weeklyXp ?? entry.xp ?? 0).toLocaleString()}`}
            </div>
            <div className="lb-podium-block" style={{ background: cfg.block, height: cfg.height }} />
          </div>
        );
      })}
    </div>
  );
}
