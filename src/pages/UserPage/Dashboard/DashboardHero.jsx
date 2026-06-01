import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import Lottie from 'lottie-react';
import { gamify } from '../../../theme';
import studyingAnim from '../../../assets/lotties/studying.json';
import trophyAnim from '../../../assets/lotties/trophy.json';

export default function DashboardHero({ userName, due, isLoading, error, onRetry }) {
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton variant="rounded" height={180} sx={{ borderRadius: '20px' }} />;
  }

  if (error) {
    return (
      <div style={{
        borderRadius: 20, padding: '20px 24px',
        background: gamify.red, color: '#fff',
        border: `2px solid ${gamify.redDark}`,
        borderBottom: `5px solid ${gamify.redDark}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: 4 }}>Ôi không! Có lỗi xảy ra 😢</div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', opacity: 0.9 }}>Không thể tải dữ liệu học tập.</div>
        </div>
        <button
          onClick={onRetry}
          style={{
            flexShrink: 0, padding: '10px 20px', borderRadius: 12, border: 'none',
            background: '#fff', color: gamify.red, fontWeight: 900, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'inherit',
            borderBottom: '4px solid #E5E5E5',
          }}
        >
          THỬ LẠI
        </button>
      </div>
    );
  }

  const hasDue = due > 0;

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden', position: 'relative',
      background: hasDue
        ? `linear-gradient(135deg, #1CB0F6 0%, #0E8FCC 100%)`
        : `linear-gradient(135deg, #58CC02 0%, #46A302 100%)`,
      border: `2px solid ${hasDue ? '#1899D6' : '#46A302'}`,
      borderBottom: `5px solid ${hasDue ? '#1276A8' : '#358A00'}`,
      color: '#fff',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -24, right: -24,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -32, left: '45%',
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
      }} />

      <div style={{ padding: '32px 36px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.2)', borderRadius: 999,
            padding: '4px 12px', marginBottom: 14,
            fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em',
          }}>
            {hasDue ? '🎯 MỤC TIÊU HÔM NAY' : '🎉 HOÀN THÀNH!'}
          </div>

          {/* Title */}
          <div style={{ fontWeight: 900, fontSize: '1.8rem', lineHeight: 1.15, marginBottom: 8 }}>
            {hasDue ? `Chào ${userName || 'bạn'}! 👋` : 'Tuyệt vời! 🎉'}
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', opacity: 0.92, lineHeight: 1.55, marginBottom: 24, maxWidth: 340 }}>
            {hasDue
              ? `Bạn có ${due} thẻ đang chờ. Chỉ mất vài phút để giải quyết hết thôi!`
              : 'Bạn không có thẻ chờ nào. Hãy học thêm từ mới để giữ lửa nhé!'}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate(hasDue ? '/study' : '/flashcard/discover')}
            style={{
              padding: '13px 28px', borderRadius: 14, border: 'none',
              background: '#fff',
              color: hasDue ? '#1CB0F6' : '#46A302',
              fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.05em',
              cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: '4px solid rgba(0,0,0,0.12)',
              transition: 'all 0.1s',
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; }}
            onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
          >
            {hasDue ? 'BẮT ĐẦU HỌC →' : 'HỌC TỪ MỚI →'}
          </button>
        </div>

        {/* Lottie illustration */}
        <div style={{ flexShrink: 0, width: 200, height: 200, display: 'none' }} className="db-hero-lottie">
          <Lottie
            animationData={hasDue ? studyingAnim : trophyAnim}
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
