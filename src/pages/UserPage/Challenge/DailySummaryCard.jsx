import { tokens } from '../../../theme';

// Compact inline summary — low visual priority
export default function DailySummaryCard({ reviewedToday = 0, streak = 0, challenges = [] }) {
  const earnedXp       = challenges.filter(c => c.completed).reduce((s, c) => s + (c.rewardXp ?? 0), 0);
  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount     = challenges.length;
  const allDone        = completedCount === totalCount && totalCount > 0;

  return (
    <div style={{
      borderRadius: 14, padding: '10px 16px',
      background: allDone ? '#F0FDF4' : '#FAFAFA',
      border: `1.5px solid ${allDone ? '#86EFAC' : '#EBEBEB'}`,
      display: 'flex', alignItems: 'center', gap: 0,
    }}>
      <Stat icon="📚" value={reviewedToday} label="từ học" />
      <Divider />
      <Stat icon="⚡" value={`+${earnedXp}`} label="XP" accent={tokens.color.xp} />
      <Divider />
      <Stat icon="🔥" value={streak} label="ngày" accent={tokens.color.streak} />
      <Divider />
      <Stat icon="🎯" value={`${completedCount}/${totalCount}`} label="xong" accent={allDone ? tokens.color.success : undefined} />
    </div>
  );
}

function Stat({ icon, value, label, accent }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: '0.85rem', marginBottom: 2 }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: '1rem', color: accent ?? '#3D3D3D', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, color: '#AFAFAF', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 32, background: '#EBEBEB', flexShrink: 0 }} />;
}
