import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { tokens } from '../../../theme';
import { fetchStats } from '../../../redux/study/studySlice';

function formatCountdown(nextReviewAt) {
  if (!nextReviewAt) return null;
  const diff = new Date(nextReviewAt) - new Date();
  if (diff <= 0) return 'SẴN SÀNG';
  const s = Math.floor((diff / 1000) % 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const h = Math.floor(diff / (1000 * 60 * 60) % 24);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (d > 0) return `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

export default function StatsPanel({
  streak = 0, reviewedToday = 0, dailyGoal = 20,
  due = 0, nextReviewAt = null, challenges = [],
}) {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(() => formatCountdown(nextReviewAt));
  const fetchedRef = useRef(false);

  const goalPercent  = dailyGoal > 0 ? Math.min((reviewedToday / dailyGoal) * 100, 100) : 0;
  const goalComplete = reviewedToday >= dailyGoal;

  useEffect(() => {
    if (!nextReviewAt) { setCountdown(null); return; }
    setCountdown(formatCountdown(nextReviewAt));
    fetchedRef.current = false;
    const id = setInterval(() => {
      const diff = new Date(nextReviewAt) - Date.now();
      if (diff <= 0 && !fetchedRef.current) {
        fetchedRef.current = true;
        setCountdown('SẴN SÀNG');
        dispatch(fetchStats());
        clearInterval(id);
      } else if (diff > 0) {
        setCountdown(formatCountdown(nextReviewAt));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [nextReviewAt, dispatch]);


      console.log('🥦 ~ StatsPanel ~ challenges:', challenges)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── Streak + Goal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{
          background: streak > 0 ? '#FFF8EE' : '#FAFAFA', borderRadius: 16, padding: '12px 14px',
          border: `1.5px solid ${streak > 0 ? '#FFD580' : '#F0F0F0'}`,
          borderBottom: `4px solid ${streak > 0 ? '#FF9600' : '#E0E0E0'}`,
        }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AFAFAF', marginBottom: 6 }}>
            🔥 Streak
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: tokens.color.streak, lineHeight: 1, marginBottom: 4 }}>
            {streak}
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#AFAFAF' }}>
            {streak > 0 ? 'ngày liên tiếp' : 'Bắt đầu hôm nay!'}
          </div>
        </div>

        <div style={{
          background: goalComplete ? '#F0FDF4' : '#FAFAFA', borderRadius: 16, padding: '12px 14px',
          border: `1.5px solid ${goalComplete ? '#86EFAC' : '#F0F0F0'}`,
          borderBottom: `4px solid ${goalComplete ? '#4ADE80' : '#E0E0E0'}`,
        }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AFAFAF', marginBottom: 6 }}>
            🎯 Mục tiêu
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: goalComplete ? tokens.color.success : '#3D3D3D', lineHeight: 1 }}>
              {reviewedToday}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#AFAFAF' }}>/{dailyGoal}</span>
          </div>
          <div style={{ height: 6, background: '#EBEBEB', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalPercent}%` }}
              style={{
                height: '100%', borderRadius: 3,
                background: goalComplete ? tokens.color.success : tokens.color.primary,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Due cards / countdown ── */}
      {due > 0 ? (
        <div style={{
          background: '#FFF0F0', borderRadius: 16, padding: '12px 16px',
          border: '1.5px solid #FECACA', borderBottom: '4px solid #FCA5A5',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: '1.6rem' }}>🎯</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#DC2626', lineHeight: 1 }}>{due}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
              thẻ đang chờ
            </div>¡
          </div>
        </div>
      ) : countdown ? (
        <div style={{
          background: countdown === 'SẴN SÀNG' ? '#F0FDF4' : '#EFF6FF',
          borderRadius: 16, padding: '12px 16px',
          border: `1.5px solid ${countdown === 'SẴN SÀNG' ? '#86EFAC' : '#BFDBFE'}`,
          borderBottom: `4px solid ${countdown === 'SẴN SÀNG' ? '#4ADE80' : '#93C5FD'}`,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AFAFAF', marginBottom: 6 }}>
            {countdown === 'SẴN SÀNG' ? 'ĐÃ ĐẾN GIỜ HỌC' : 'SẴN SÀNG TRONG'}
          </div>
          <div style={{
            fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.1em',
            color: countdown === 'SẴN SÀNG' ? tokens.color.success : '#3B82F6',
          }}>
            {countdown}
          </div>
        </div>
      ) : null}

      {/* ── Challenges ── */}
      {challenges.length > 0 && (
        <div style={{
          background: '#fff', borderRadius: 16, padding: '14px 16px',
          border: '1.5px solid #F0F0F0', borderBottom: '4px solid #E0E0E0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AFAFAF' }}>
              🎯 Thử thách
            </span>
            <div style={{ flex: 1, height: 1, background: '#F0F0F0' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {challenges.map((c, i) => {
              const safeProgress = c.progress ?? 0;
              const pct = c.target > 0 ? Math.min((safeProgress / c.target) * 100, 100) : 0;
              return (
                <div key={c.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: c.completed ? 0.6 : 1 }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{c.completed ? '✅' : (c.icon || '🎯')}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{
                        fontSize: '0.78rem', fontWeight: 700,
                        color: c.completed ? '#AFAFAF' : '#3D3D3D',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        textDecoration: c.completed ? 'line-through' : 'none',
                      }}>
                        {c.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: c.completed ? tokens.color.success : '#AFAFAF', flexShrink: 0, marginLeft: 6 }}>
                        {c.completed ? 'Done' : `${safeProgress}/${c.target}`}
                      </span>
                    </div>
                    <div style={{ height: 5, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{
                          height: '100%', borderRadius: 3,
                          background: c.completed ? tokens.color.success : tokens.color.primary,
                        }}
                      />
                    </div>
                  </div>
                  {!c.completed && (
                    <span style={{
                      flexShrink: 0, fontSize: '0.65rem', fontWeight: 800,
                      color: tokens.color.xp, background: '#FFF4E5',
                      borderRadius: 6, padding: '2px 6px',
                    }}>
                      +{c.rewardXp}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
