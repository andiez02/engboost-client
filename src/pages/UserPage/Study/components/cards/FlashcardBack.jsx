import { motion } from 'framer-motion';
import { highlightWord } from '../../utils/highlightWord';
import { getResponseTimeLabel, formatResponseTime } from '../../utils/responseTimeLabel';
import { getFlashcardViewModel } from '../../../../../utils/flashcardSelectors';

export default function FlashcardBack({ card, responseTimeMs }) {
  if (!card) return null;

  const viewModel = getFlashcardViewModel(card);
  const { translation, definition, example, headword } = viewModel || {};

  const timeLabel = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, delay: 0.06 }}
      className="flex flex-col items-center justify-center w-full h-full px-8 py-6 relative gap-3"
    >
      {/* Response time badge */}
      {timeLabel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
        >
          <span style={{ fontSize: '0.72rem' }}>{timeLabel.emoji}</span>
          <span className="text-[10px] font-black" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {formatResponseTime(responseTimeMs)}
          </span>
        </motion.div>
      )}

      {/* Meaning label */}
      <span
        className="flex-shrink-0 text-[10px] font-black tracking-[0.22em] uppercase"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        Meaning
      </span>

      {/* Translation — hero */}
      <p
        className="font-black text-white text-center leading-none flex-shrink-0"
        style={{
          fontSize: '3rem',
          wordBreak: 'break-word',
          letterSpacing: '-0.02em',
        }}
      >
        {translation || ''}
      </p>

      {/* Definition */}
      {definition ? (
        <p
          className="text-center leading-snug flex-shrink-0"
          style={{
            color: 'rgba(255,255,255,0.68)',
            maxWidth: 290,
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          {definition}
        </p>
      ) : null}

      {/* Divider */}
      {example ? (
        <div
          className="flex-shrink-0"
          style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.18)' }}
        />
      ) : null}

      {/* Example */}
      {example ? (
        <p
          className="italic text-center leading-snug flex-shrink-0"
          style={{
            color: 'rgba(255,255,255,0.52)',
            maxWidth: 290,
            fontSize: '0.82rem',
          }}
        >
          {highlightWord(example, headword, {
            color: '#fff',
            fontWeight: 900,
            textDecoration: 'underline',
            fontStyle: 'normal',
          })}
        </p>
      ) : null}

      {/* Rate hint */}
      <p
        className="flex-shrink-0 text-[11px] font-bold mt-2"
        style={{ color: 'rgba(255,255,255,0.22)' }}
      >
        Rate your recall below
      </p>
    </motion.div>
  );
}
