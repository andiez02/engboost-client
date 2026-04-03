import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getResponseTimeLabel, formatResponseTime } from './utils/responseTimeLabel';

export default function MCQCard({ card, options, onAnswer, responseTimeMs, lastRating, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const controls = useAnimation();

  if (!card || !options || options.length < 4) {
    console.warn('[MCQCard] Invalid props, missing card or options');
    return null;
  }

  const headword = card.lexicalEntry?.headword || '—';
  const correctAnswer = card.lexicalEntry?.senses?.[0]?.translation || '';
  const isCorrect = selectedIndex !== null && options[selectedIndex] === correctAnswer;

  const timeLabel = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  const handleSelect = (index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    onSelect?.();
  };

  useEffect(() => {
    if (lastRating === null || lastRating === undefined) return;
    const animations = {
      0: { x: [-3, 3, -3, 3, 0], transition: { duration: 0.25 } },
      1: { scale: [1, 1.02, 1], transition: { duration: 0.2 } },
      2: { scale: [1, 1.02, 1], transition: { duration: 0.2 } },
      3: { scale: [1, 1.03, 1], transition: { duration: 0.25 } },
    };
    const anim = animations[lastRating];
    if (anim) controls.start(anim);
  }, [lastRating, controls]);

  const getOptionStyle = (index) => {
    if (selectedIndex === null) {
      return {
        background: 'var(--color-white)',
        border: '2px solid var(--color-border)',
        borderBottom: '4px solid var(--color-border-dark)',
        color: 'var(--color-text)',
        cursor: 'pointer',
      };
    }
    const isThisCorrect = options[index] === correctAnswer;
    const isThisSelected = index === selectedIndex;
    if (isThisCorrect) {
      return {
        background: 'var(--color-success-bg)',
        border: '2px solid var(--color-success)',
        borderBottom: '4px solid var(--color-success)',
        color: 'var(--color-success)',
        cursor: 'default',
      };
    }
    if (isThisSelected && !isThisCorrect) {
      return {
        background: 'var(--color-error-bg)',
        border: '2px solid var(--color-error)',
        borderBottom: '4px solid var(--color-error)',
        color: 'var(--color-error)',
        cursor: 'default',
      };
    }
    return {
      background: 'var(--color-surface)',
      border: '2px solid var(--color-border)',
      borderBottom: '4px solid var(--color-border)',
      color: 'var(--color-text-sub)',
      opacity: 0.55,
      cursor: 'default',
    };
  };

  return (
    <motion.div
      animate={controls}
      className="flex flex-col items-center justify-center w-full h-full px-6 py-4 gap-3 relative"
    >
      {/* Response time badge */}
      {timeLabel && selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'var(--color-primary-light)' }}
        >
          <span className="text-sm">{timeLabel.emoji}</span>
          <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            {formatResponseTime(responseTimeMs)}
          </span>
        </motion.div>
      )}

      {/* Label */}
      <span className="eb-label flex-shrink-0">Chọn nghĩa đúng</span>

      {/* Question: Headword */}
      <p
        className="font-black text-center leading-tight flex-shrink-0"
        style={{ color: 'var(--color-text)', fontSize: '2rem', wordBreak: 'break-word' }}
      >
        {headword}
      </p>

      {/* Options */}
      <div className="w-full flex flex-col gap-2">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={selectedIndex !== null}
            whileHover={selectedIndex === null ? { scale: 1.02 } : {}}
            whileTap={selectedIndex === null ? { scale: 0.97, y: 1 } : {}}
            className="w-full px-4 py-3 rounded-2xl font-bold text-sm text-left flex-shrink-0"
            style={getOptionStyle(index)}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Result badge */}
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className={`eb-badge flex-shrink-0 font-black ${isCorrect ? 'eb-badge-success' : 'eb-badge-error'}`}
          style={{ fontSize: '0.875rem', padding: '5px 16px' }}
        >
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </motion.div>
      )}

      {selectedIndex === null && (
        <p className="eb-hint flex-shrink-0" style={{ opacity: 0.45 }}>Select an answer to continue</p>
      )}
    </motion.div>
  );
}
