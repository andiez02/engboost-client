import { Tooltip } from '@mui/material';
import { tokens } from '../../../theme';

export default function BadgeSection({ achievements = [] }) {
  if (!achievements || achievements.length === 0) return null;

  const sorted         = [...achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  const unlockedCount  = achievements.filter(b => b.unlocked).length;
  const allUnlocked    = unlockedCount === achievements.length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: '1.1rem' }}>🏆</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#AFAFAF', flex: 1 }}>
          Huy hiệu của bạn
        </span>
        <div style={{ flex: 1, height: 2, background: '#F0F0F0', borderRadius: 2 }} />
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3D3D3D' }}>
          {unlockedCount} / {achievements.length}
        </span>
      </div>

      {allUnlocked && (
        <div style={{
          marginBottom: 14, padding: '10px 14px', borderRadius: 12, textAlign: 'center',
          background: '#F0FDF4', border: '1.5px solid #86EFAC',
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: tokens.color.success }}>
            🎉 Tuyệt đỉnh! Bạn đã thu thập đủ tất cả huy hiệu!
          </span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: 10,
      }}>
        {sorted.map(badge => <BadgeItem key={badge.id} badge={badge} />)}
      </div>
    </div>
  );
}

function BadgeItem({ badge }) {
  return (
    <Tooltip
      title={
        <div style={{ textAlign: 'center', padding: 4 }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{badge.title}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 4 }}>{badge.description}</div>
          {!badge.unlocked && (
            <div style={{ fontSize: '0.7rem', color: '#FFB84D', marginTop: 6, fontWeight: 700 }}>🔒 Chưa mở khóa</div>
          )}
          {badge.unlocked && badge.unlocked_at && (
            <div style={{ fontSize: '0.65rem', color: tokens.color.success, marginTop: 6, fontWeight: 600 }}>
              ✅ {new Date(badge.unlocked_at).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      }
      arrow
      placement="top"
    >
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 10px', borderRadius: 16, cursor: 'help',
        background: '#fff',
        border: `2px solid ${badge.unlocked ? '#FFD58080' : '#F0F0F0'}`,
        borderBottom: `4px solid ${badge.unlocked ? '#FF9600' : '#E0E0E0'}`,
        opacity: badge.unlocked ? 1 : 0.55,
        filter: badge.unlocked ? 'none' : 'grayscale(1)',
        transition: 'all 0.2s',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: badge.unlocked ? '#FFF8E0' : '#F0F0F0',
            border: `2px solid ${badge.unlocked ? '#FFD700' : '#D0D0D0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: badge.unlocked ? '0 4px 12px #FFD70040' : 'none',
            overflow: 'hidden',
          }}>
            {badge.icon?.startsWith('http') ? (
              <img src={badge.icon} alt={badge.title} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '1.6rem' }}>{badge.icon || '🏆'}</span>
            )}
          </div>
          {!badge.unlocked && (
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              background: '#fff', borderRadius: '50%', padding: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: '0.85rem', lineHeight: 1,
            }}>🔒</div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: badge.unlocked ? '#3D3D3D' : '#AFAFAF', marginBottom: 2 }}>
            {badge.title}
          </div>
          <div style={{
            fontSize: '0.62rem', fontWeight: 500, color: '#AFAFAF',
            display: '-webkit-box', overflow: 'hidden',
            WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
          }}>
            {badge.description}
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
