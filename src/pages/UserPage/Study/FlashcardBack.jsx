import { motion } from 'framer-motion';
import { highlightWord } from './utils/highlightWord';
import { getResponseTimeLabel, formatResponseTime } from './utils/responseTimeLabel';
import { getFlashcardViewModel } from '../../../utils/flashcardSelectors';

export default function FlashcardBack({ card, responseTimeMs }) {
  if (!card) return null;

  const viewModel = getFlashcardViewModel(card);
  const { translation, definition, example, headword } = viewModel || {};

  const timeLabel = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="flex flex-col items-center justify-center w-full h-full px-8 py-5 relative gap-3"
    >
      {/* Response time badge */}
      {timeLabel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-sm">{timeLabel.emoji}</span>
          <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {formatResponseTime(responseTimeMs)}
          </span>
        </motion.div>
      )}

      {/* Label */}
      <span
        className="eb-label flex-shrink-0"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Meaning
      </span>

      {/* Translation — primary */}
      <p
        className="font-black text-white text-center leading-tight flex-shrink-0"
        style={{ fontSize: '2.6rem', wordBreak: 'break-word' }}
      >
        {translation || ''}
      </p>

      {/* Definition */}
      {definition ? (
        <p
          className="eb-body text-center leading-relaxed flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 280, fontSize: '0.9rem' }}
        >
          {definition}
        </p>
      ) : null}

      {/* Divider */}
      {(definition || example) ? (
        <div className="w-10 h-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }} />
      ) : null}

      {/* Example */}
      {example ? (
        <p
          className="eb-hint italic text-center leading-relaxed flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 280 }}
        >
          {highlightWord(example, headword, {
            color: '#FFFFFF',
            fontWeight: 900,
            textDecoration: 'underline',
          })}
        </p>
      ) : null}

      <p
        className="eb-hint flex-shrink-0"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        Rate your recall below
      </p>
    </motion.div>
  );
}
