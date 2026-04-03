import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getResponseTimeLabel, formatResponseTime } from './utils/responseTimeLabel';

export default function TypingCard({ card, onAnswer, responseTimeMs, lastRating, onSubmit, isSubmitted: externalSubmitted }) {
  const [userInput, setUserInput] = useState('');
  const [localSubmitted, setLocalSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const controls = useAnimation();

  const submitted = externalSubmitted ?? localSubmitted;

  if (!card) return null;

  const headword = card.lexicalEntry?.headword || '';
  const translation = card.lexicalEntry?.senses?.[0]?.translation || '—';

  const handleSubmit = () => {
    if (submitted) return;
    const normalized = userInput.trim().toLowerCase();
    const expected = headword.trim().toLowerCase();
    setIsCorrect(normalized === expected);
    setLocalSubmitted(true);
    onSubmit?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !submitted) handleSubmit();
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

  const timeLabel = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  if (!headword) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <p className="font-semibold" style={{ color: 'var(--color-error)' }}>Error: Missing headword</p>
      </div>
    );
  }

  return (
    <motion.div
      animate={controls}
      className="flex flex-col items-center justify-center w-full h-full px-6 py-5 gap-4 relative"
    >
      {/* Response time badge */}
      {timeLabel && submitted && (
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
      <span className="eb-label">Nhập từ tiếng Anh</span>

      {/* Prompt */}
      <p
        className="font-black text-center leading-tight"
        style={{ color: 'var(--color-text)', fontSize: '2.4rem', wordBreak: 'break-word' }}
      >
        {translation}
      </p>

      {/* Input */}
      {!submitted && (
        <motion.input
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          autoFocus
          className="w-full max-w-sm px-5 py-3 text-base font-bold text-center rounded-2xl flex-shrink-0"
          style={{
            border: '2px solid var(--color-border)',
            borderBottom: '4px solid var(--color-border-dark)',
            background: 'var(--color-white)',
            color: 'var(--color-text)',
            outline: 'none',
          }}
        />
      )}

      {/* Submit button */}
      {!submitted && (
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98, y: 1 }}
          className="eb-btn eb-btn-primary flex-shrink-0 px-10"
        >
          Submit
        </motion.button>
      )}

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div
            className={`font-black eb-badge ${isCorrect ? 'eb-badge-success' : 'eb-badge-error'}`}
            style={{ fontSize: '1rem', padding: '6px 20px' }}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          {!isCorrect && (
            <div className="text-center">
              <span className="eb-hint">Correct: </span>
              <span className="font-black text-base" style={{ color: 'var(--color-primary)' }}>{headword}</span>
            </div>
          )}
        </motion.div>
      )}

      {!submitted && (
        <p className="eb-hint" style={{ opacity: 0.5 }}>Press Enter or click Submit</p>
      )}
    </motion.div>
  );
}
