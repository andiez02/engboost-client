import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RATINGS = [
  { label: 'Again', value: 0, key: '1', emoji: '\u274C', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', shadow: 'rgba(220,38,38,0.25)', xp: 1 },
  { label: 'Hard',  value: 1, key: '2', emoji: '\uD83D\uDE2C', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', shadow: 'rgba(217,119,6,0.25)',  xp: 3 },
  { label: 'Good',  value: 2, key: '3', emoji: '\uD83D\uDE42', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', shadow: 'rgba(22,163,74,0.25)',  xp: 5 },
  { label: 'Easy',  value: 3, key: '4', emoji: '\uD83D\uDE0E', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', shadow: 'rgba(37,99,235,0.25)', xp: 8 },
];

const FEEDBACK = [
  { rating: 0, messages: ['Keep trying!', 'You got this!', "Don't give up!"] },
  { rating: 1, messages: ['Getting there!', 'Almost!', 'Keep practicing!'] },
  { rating: 2, messages: ['Nice!', 'Good job!', 'Keep going!'] },
  { rating: 3, messages: ['Excellent!', 'You nailed it!', 'Outstanding!'] },
];

function getFeedback(rating) {
  const group = FEEDBACK.find((f) => f.rating === rating);
  const msgs = group?.messages ?? ['Good!'];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function FloatingToasts({ xpItems, feedbackItems }) {
  return createPortal(
    <>
      <AnimatePresence>
        {xpItems.map(({ id, xp, x, y }) => (
          <motion.span
            key={id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -20, scale: 1.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: x,
              top: y - 8,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 9999,
              fontWeight: 900,
              fontSize: '1.15rem',
              color: '#F59E0B',
              textShadow: '0 1px 6px rgba(0,0,0,0.18)',
              whiteSpace: 'nowrap',
            }}
          >
            +{xp} XP
          </motion.span>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackItems.map(({ id, text, rating, x, y }) => {
          const isCorrect = rating !== undefined ? rating >= 2 : true;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 0, scale: 0.9 }}
              animate={
                isCorrect
                  ? { opacity: 1, y: -20, scale: 1.1 }
                  : { opacity: 1, y: -20, x: [-2, 4, -4, 4, 0], scale: 1 }
              }
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'fixed',
                left: x,
                top: y - 48,
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: 9998,
                whiteSpace: 'nowrap',
              }}
              className={`text-base font-black px-4 py-1.5 rounded-full shadow-lg border-2 ${
                isCorrect
                  ? 'text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]'
                  : 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]'
              }`}
            >
              {text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>,
    document.body
  );
}

export default function RatingButtons({ onRate, disabled, combo = 0 }) {
  const [xpFloats, setXpFloats] = useState([]);
  const [feedbackFloats, setFeedbackFloats] = useState([]);

  const handleRate = (value, e) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    const baseXp = RATINGS[value].xp;
    const earnedXp = value >= 2 ? Math.floor(baseXp * (1 + combo * 0.1)) : baseXp;
    const id = Date.now();

    // XP float — stays 600ms
    setXpFloats((prev) => [...prev, { id, xp: earnedXp, x, y }]);
    setTimeout(() => setXpFloats((prev) => prev.filter((f) => f.id !== id)), 600);

    // Feedback toast — stays 600ms
    const text = getFeedback(value);
    const fid = id + 1;
    setFeedbackFloats((prev) => [...prev, { id: fid, text, rating: value, x, y }]);
    setTimeout(() => setFeedbackFloats((prev) => prev.filter((f) => f.id !== fid)), 600);

    onRate(value);
  };

  return (
    <>
      <FloatingToasts xpItems={xpFloats} feedbackItems={feedbackFloats} />

      <div className="w-full flex flex-col items-center gap-3">
        {/* placeholder so layout height stays stable */}
        <div className="h-8" />

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {RATINGS.map(({ label, value, key, emoji, bg, color, border, shadow }) => (
            <motion.button
              key={value}
              disabled={disabled}
              onClick={(e) => handleRate(value, e)}
              whileHover={{ scale: disabled ? 1 : 1.04, y: disabled ? 0 : -2 }}
              whileTap={{ scale: disabled ? 1 : 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl font-bold text-sm transition-opacity"
              style={{
                background: bg,
                border: `2px solid ${border}`,
                borderBottomWidth: 4,
                color,
                opacity: disabled ? 0.45 : 1,
                boxShadow: disabled ? 'none' : `0 4px 12px ${shadow}`,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span className="text-xs font-black">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
