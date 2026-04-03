import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getResponseTimeLabel, formatResponseTime } from '../../utils/responseTimeLabel';

export default function TypingCard({ card, onAnswer, responseTimeMs, lastRating, onSubmit, isSubmitted: externalSubmitted }) {
  const [userInput, setUserInput]     = useState('');
  const [localSubmitted, setLocalSub] = useState(false);
  const [isCorrect, setIsCorrect]     = useState(false);
  const controls = useAnimation();

  const submitted = externalSubmitted ?? localSubmitted;

  if (!card) return null;

  const headword    = card.lexicalEntry?.headword || '';
  const translation = card.lexicalEntry?.senses?.[0]?.translation || '—';

  const handleSubmit = () => {
    if (submitted || !userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === headword.trim().toLowerCase();
    setIsCorrect(correct);
    setLocalSub(true);
    onSubmit?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  useEffect(() => {
    if (lastRating === null || lastRating === undefined) return;
    const anims = {
      0: { x: [-4, 4, -4, 4, 0], transition: { duration: 0.25 } },
      1: { scale: [1, 1.02, 1], transition: { duration: 0.2 } },
      2: { scale: [1, 1.02, 1], transition: { duration: 0.2 } },
      3: { scale: [1, 1.03, 1], transition: { duration: 0.25 } },
    };
    if (anims[lastRating]) controls.start(anims[lastRating]);
  }, [lastRating, controls]);

  const timeLabel = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  return (
    <motion.div
      animate={controls}
      className="flex flex-col items-center justify-center w-full h-full px-6 py-4 gap-3 relative"
    >
      {/* Response time badge */}
      {timeLabel && submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full"
          style={{ background: '#EEF2FF' }}
        >
          <span style={{ fontSize: '0.7rem' }}>{timeLabel.emoji}</span>
          <span className="text-[10px] font-black" style={{ color: '#4F46E5' }}>
            {formatResponseTime(responseTimeMs)}
          </span>
        </motion.div>
      )}

      {/* Top label */}
      <span
        className="flex-shrink-0 text-[10px] font-black tracking-[0.18em] uppercase"
        style={{ color: '#AFAFAF' }}
      >
        Nhập từ tiếng Anh
      </span>

      {/* Prompt — Vietnamese word */}
      <p
        className="font-black text-center leading-none tracking-tight flex-shrink-0"
        style={{ color: '#1A1A2E', fontSize: '2.8rem', wordBreak: 'break-word' }}
      >
        {translation}
      </p>

      {/* Input field */}
      {!submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-xs flex flex-col gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer…"
            autoFocus
            className="w-full px-5 py-3 text-base font-bold text-center rounded-2xl transition-all"
            style={{
              border: '2px solid #E5E5E5',
              borderBottom: '4px solid #D5D5D5',
              background: '#FFFFFF',
              color: '#4B4B4B',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #4F46E5';
              e.target.style.borderBottom = '4px solid #3730A3';
            }}
            onBlur={(e) => {
              e.target.style.border = '2px solid #E5E5E5';
              e.target.style.borderBottom = '4px solid #D5D5D5';
            }}
          />
          <motion.button
            onClick={handleSubmit}
            whileHover={{ y: -2 }}
            whileTap={{ y: 2, scale: 0.98 }}
            className="w-full py-2.5 rounded-2xl font-black text-white text-sm uppercase tracking-wide"
            style={{
              background: '#4F46E5',
              border: '2px solid #4F46E5',
              borderBottom: '4px solid #3730A3',
              opacity: userInput.trim() ? 1 : 0.5,
            }}
          >
            Submit
          </motion.button>
        </motion.div>
      )}

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 380, damping: 22 }}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div
            className="px-5 py-1.5 rounded-2xl font-black text-white text-base"
            style={{ background: isCorrect ? '#58CC02' : '#FF4B4B' }}
          >
            {isCorrect ? '✓ Tuyệt vời!' : '✗ Sai rồi!'}
          </div>
          {!isCorrect && (
            <p className="text-center" style={{ fontSize: '0.85rem', color: '#AFAFAF' }}>
              Đáp án đúng:{' '}
              <strong style={{ color: '#4F46E5', fontSize: '1rem' }}>{headword}</strong>
            </p>
          )}
        </motion.div>
      )}

      {!submitted && (
        <p className="flex-shrink-0 text-[11px] font-bold" style={{ color: '#AFAFAF', opacity: 0.55 }}>
          Nhấn Enter hoặc bấm Submit
        </p>
      )}
    </motion.div>
  );
}
