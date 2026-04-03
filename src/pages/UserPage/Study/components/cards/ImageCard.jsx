import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import FlashcardView from './FlashcardView';
import { getResponseTimeLabel, formatResponseTime } from '../../utils/responseTimeLabel';

/**
 * ImageCard — fixed-height slot: 420px
 * Shows image → pick mode (type / reveal) → answer → feedback
 * Rating is handled externally by StudyPage
 */
export default function ImageCard({
  card,
  onAnswer,
  onSubmit,
  responseTimeMs,
  lastRating,
  isTransitioning,
  nextCard,
}) {
  const [mode, setMode]         = useState(null); // 'typing' | 'flip'
  const [userInput, setInput]   = useState('');
  const [submitted, setSubmit]  = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setCorrect] = useState(false);
  const controls = useAnimation();

  if (!card) return null;

  const imageUrl = card.lexicalEntry?.imageUrl;
  const headword = card.lexicalEntry?.headword || '';

  if (!imageUrl) {
    return (
      <FlashcardView
        card={card}
        isTransitioning={isTransitioning}
        nextCard={nextCard}
        responseTimeMs={responseTimeMs}
        lastRating={lastRating}
      />
    );
  }

  const handleTypingSubmit = () => {
    if (submitted || !userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === headword.trim().toLowerCase();
    setCorrect(correct);
    setSubmit(true);
    onSubmit?.();
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

  const timeLabel   = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;
  const showFeedback = (mode === 'typing' && submitted) || (mode === 'flip' && revealed);

  return (
    <motion.div
      animate={controls}
      className="w-full h-full flex flex-col items-center justify-between px-5 py-3 gap-2 relative overflow-hidden"
    >
      {/* Time badge */}
      {timeLabel && showFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full"
          style={{ background: '#EEF2FF' }}
        >
          <span style={{ fontSize: '0.7rem' }}>{timeLabel.emoji}</span>
          <span className="text-[10px] font-black" style={{ color: '#4F46E5' }}>
            {formatResponseTime(responseTimeMs)}
          </span>
        </motion.div>
      )}

      {/* Label */}
      <span
        className="flex-shrink-0 text-[10px] font-black tracking-[0.18em] uppercase"
        style={{ color: '#AFAFAF' }}
      >
        What is this?
      </span>

      {/* Image */}
      <motion.img
        src={imageUrl}
        alt="vocabulary"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28 }}
        className="flex-shrink-0 rounded-2xl object-contain"
        style={{
          width: '100%',
          maxWidth: 280,
          height: 150,
          background: '#F7F7F7',
        }}
      />

      {/* Interactive zone */}
      <div className="w-full flex flex-col items-center justify-center gap-2 flex-1 min-h-0">

        {/* Mode Selection */}
        {!mode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2"
          >
            <motion.button
              onClick={() => setMode('typing')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, scale: 0.97 }}
              className="px-5 py-2.5 font-black text-white text-sm rounded-2xl uppercase tracking-wide"
              style={{ background: '#4F46E5', border: '2px solid #4F46E5', borderBottom: '4px solid #3730A3' }}
            >
              ✏️ Type
            </motion.button>
            <motion.button
              onClick={() => setMode('flip')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, scale: 0.97 }}
              className="px-5 py-2.5 font-black text-sm rounded-2xl uppercase tracking-wide"
              style={{ background: '#F7F7F7', border: '2px solid #E5E5E5', borderBottom: '4px solid #D5D5D5', color: '#4B4B4B' }}
            >
              👁 Reveal
            </motion.button>
          </motion.div>
        )}

        {/* Typing input */}
        {mode === 'typing' && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-xs flex flex-col gap-2"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTypingSubmit()}
              placeholder="Type the English word…"
              autoFocus
              className="w-full px-4 py-2.5 text-base font-bold text-center rounded-2xl"
              style={{
                border: '2px solid #E5E5E5',
                borderBottom: '4px solid #D5D5D5',
                background: '#fff',
                color: '#4B4B4B',
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.border = '2px solid #4F46E5'; e.target.style.borderBottom = '4px solid #3730A3'; }}
              onBlur={(e)  => { e.target.style.border = '2px solid #E5E5E5'; e.target.style.borderBottom = '4px solid #D5D5D5'; }}
            />
            <motion.button
              onClick={handleTypingSubmit}
              whileHover={{ y: -1 }}
              whileTap={{ y: 2, scale: 0.98 }}
              className="w-full py-2 font-black text-white text-sm rounded-2xl uppercase tracking-wide"
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

        {/* Typing feedback */}
        {mode === 'typing' && submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="px-5 py-1.5 rounded-2xl font-black text-white text-base"
              style={{ background: isCorrect ? '#58CC02' : '#FF4B4B' }}
            >
              {isCorrect ? '✓ Tuyệt vời!' : '✗ Sai rồi!'}
            </div>
            {!isCorrect && (
              <p className="text-center text-sm" style={{ color: '#AFAFAF' }}>
                Đáp án:{' '}
                <strong style={{ color: '#4F46E5' }}>{headword}</strong>
              </p>
            )}
          </motion.div>
        )}

        {/* Flip reveal button */}
        {mode === 'flip' && !revealed && (
          <motion.button
            onClick={() => { setRevealed(true); onSubmit?.(); }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 2, scale: 0.97 }}
            className="px-7 py-2.5 font-black text-white text-sm rounded-2xl uppercase tracking-wide"
            style={{ background: '#4F46E5', border: '2px solid #4F46E5', borderBottom: '4px solid #3730A3' }}
          >
            👁 Reveal Answer
          </motion.button>
        )}

        {/* Flip headword */}
        {mode === 'flip' && revealed && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
            className="font-black text-center leading-none"
            style={{ fontSize: '2.6rem', color: '#1A1A2E' }}
          >
            {headword}
          </motion.p>
        )}

        {!showFeedback && mode && (
          <p className="text-[11px] font-bold" style={{ color: '#AFAFAF', opacity: 0.55 }}>
            {mode === 'typing' ? 'Nhấn Enter hoặc Submit' : 'Bấm để xem đáp án'}
          </p>
        )}
      </div>
    </motion.div>
  );
}
