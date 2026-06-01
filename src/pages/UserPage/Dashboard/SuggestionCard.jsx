import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const SUGGESTIONS = {
  due: {
    icon: '🎯', label: 'NHIỆM VỤ', labelColor: '#46A302',
    title: 'Học thẻ chờ', body: 'Giải quyết các thẻ đang vẫy gọi bạn nào.',
    action: 'Học ngay', path: '/study',
    bg: 'rgba(88,204,2,0.07)', border: 'rgba(88,204,2,0.25)',
    btnBg: '#58CC02', btnBorder: '#46A302',
  },
  reviewed: {
    icon: '🔥', label: 'GỢI Ý', labelColor: '#D87A00',
    title: 'Củng cố thẻ khó', body: 'Một lượt ôn thẻ khó sẽ giúp bạn nhớ dai hơn!',
    action: 'Ôn thẻ khó', path: '/study?mode=weak',
    bg: 'rgba(255,150,0,0.07)', border: 'rgba(255,150,0,0.25)',
    btnBg: '#FF9600', btnBorder: '#D87A00',
  },
  waiting: {
    icon: '⏱️', label: 'GỢI Ý', labelColor: '#1899D6',
    title: 'Chuẩn bị tạo đà!', body: 'Học thêm từ vựng mới để giữ phong độ.',
    action: 'Học từ mới', path: '/flashcard/discover',
    bg: 'rgba(28,176,246,0.07)', border: 'rgba(28,176,246,0.25)',
    btnBg: '#1CB0F6', btnBorder: '#1899D6',
  },
  default: {
    icon: '✨', label: 'GỢI Ý', labelColor: '#A568CC',
    title: 'Khởi động vòng học mới', body: 'Thêm những từ vựng thật xịn vào danh sách!',
    action: 'Khám phá ngay', path: '/flashcard/discover',
    bg: 'rgba(206,130,255,0.07)', border: 'rgba(206,130,255,0.25)',
    btnBg: '#CE82FF', btnBorder: '#A568CC',
  },
};

export default function SuggestionCard({ due, reviewedToday, nextReviewAt }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  const s = due > 0 ? SUGGESTIONS.due
    : reviewedToday > 0 ? SUGGESTIONS.reviewed
    : nextReviewAt ? SUGGESTIONS.waiting
    : SUGGESTIONS.default;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            background: s.bg,
            border: `1.5px solid ${s.border}`,
            borderBottom: `4px solid ${s.border}`,
          }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', color: s.labelColor }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#3D3D3D', marginBottom: 4, lineHeight: 1.2 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#AFAFAF', lineHeight: 1.4 }}>
                    {s.body}
                  </div>
                </div>
                <button
                  onClick={() => setVisible(false)}
                  style={{
                    flexShrink: 0, background: 'none', border: 'none',
                    cursor: 'pointer', color: '#AFAFAF', fontSize: '1rem', lineHeight: 1,
                    padding: 2,
                  }}
                >
                  ✕
                </button>
              </div>
              <button
                onClick={() => navigate(s.path)}
                style={{
                  width: '100%', padding: '11px 0', borderRadius: 12, border: 'none',
                  background: s.btnBg, color: '#fff',
                  fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.05em',
                  cursor: 'pointer', fontFamily: 'inherit',
                  borderBottom: `4px solid ${s.btnBorder}`,
                  transition: 'all 0.1s',
                }}
                onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; }}
                onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
              >
                {s.action.toUpperCase()}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
