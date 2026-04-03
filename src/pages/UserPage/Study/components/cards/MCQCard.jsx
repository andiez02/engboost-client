import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getResponseTimeLabel, formatResponseTime } from '../../utils/responseTimeLabel';

const LABEL = ['A', 'B', 'C', 'D'];

export default function MCQCard({ card, options, onAnswer, responseTimeMs, lastRating, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const controls = useAnimation();

  if (!card || !options || options.length < 4) return null;

  const headword     = card.lexicalEntry?.headword || '—';
  const correctAnswer = card.lexicalEntry?.senses?.[0]?.translation || '';
  const isCorrect    = selectedIndex !== null && options[selectedIndex] === correctAnswer;
  const timeLabel    = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  // 2-col grid when all options are short enough to fit side-by-side
  const use2Col = options.every((o) => o.length <= 28);

  const handleSelect = (index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    onSelect?.();
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

  const getOptionStyle = (index) => {
    // Default (unselected)
    if (selectedIndex === null) return {
      background: '#FFFFFF',
      border: '2px solid #E5E5E5',
      borderBottom: '4px solid #D5D5D5',
      color: '#4B4B4B',
      cursor: 'pointer',
    };
    const correct  = options[index] === correctAnswer;
    const selected = index === selectedIndex;
    if (correct)         return { background: '#D7FFB8', border: '2px solid #58CC02', borderBottom: '4px solid #46A302', color: '#2D7A00', cursor: 'default' };
    if (selected)        return { background: '#FFF0F0', border: '2px solid #FF4B4B', borderBottom: '4px solid #EA2B2B', color: '#C20000', cursor: 'default' };
    return               { background: '#F7F7F7', border: '2px solid #E5E5E5', borderBottom: '4px solid #E5E5E5', color: '#AFAFAF', opacity: 0.55, cursor: 'default' };
  };

  const getLabelStyle = (index) => {
    if (selectedIndex === null) return { background: '#EEF2FF', color: '#4F46E5' };
    const correct  = options[index] === correctAnswer;
    const selected = index === selectedIndex;
    if (correct)  return { background: '#58CC02', color: '#fff' };
    if (selected) return { background: '#FF4B4B', color: '#fff' };
    return              { background: '#E5E5E5', color: '#AFAFAF' };
  };

  return (
    <motion.div
      animate={controls}
      className="flex flex-col items-center justify-center w-full h-full px-5 py-5 gap-4 relative overflow-hidden"
    >
      {/* Response time badge */}
      {timeLabel && selectedIndex !== null && (
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
        Chọn nghĩa đúng
      </span>

      {/* Headword */}
      <p
        className="font-black text-center leading-none tracking-tight flex-shrink-0"
        style={{ color: '#1A1A2E', fontSize: '2.4rem', wordBreak: 'break-word' }}
      >
        {headword}
      </p>

      {/* Result badge */}
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18, type: 'spring', stiffness: 400, damping: 20 }}
          className="flex-shrink-0 px-4 py-1 rounded-2xl font-black text-white text-sm"
          style={{ background: isCorrect ? '#58CC02' : '#FF4B4B' }}
        >
          {isCorrect ? '✓ Tuyệt vời!' : '✗ Sai rồi!'}
        </motion.div>
      )}

      {/* Options — 2-col grid when options are short, 1-col otherwise */}
      <div
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: use2Col ? 'repeat(2, 1fr)' : '1fr',
          gap: '8px',
          alignContent: 'start',
        }}
      >
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={selectedIndex !== null}
            whileHover={selectedIndex === null ? { scale: 1.015, y: -1 } : {}}
            whileTap={selectedIndex === null ? { scale: 0.98, y: 2 } : {}}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl font-bold text-sm text-left flex-shrink-0 transition-none"
            style={getOptionStyle(index)}
          >
            {/* Letter pill */}
            <span
              className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black"
              style={getLabelStyle(index)}
            >
              {LABEL[index]}
            </span>
            <span className="flex-1 leading-snug">{option}</span>
          </motion.button>
        ))}
      </div>

      {selectedIndex === null && (
        <p className="flex-shrink-0 text-[11px] font-bold" style={{ color: '#AFAFAF', opacity: 0.6 }}>
          Chọn một đáp án để tiếp tục
        </p>
      )}
    </motion.div>
  );
}
