import { motion } from 'framer-motion';
import { maskWord } from './utils/maskWord';
import { getFlashcardViewModel } from '../../../utils/flashcardSelectors';

export default function FlashcardFront({ card }) {
  if (!card) return null;

  const viewModel = getFlashcardViewModel(card);
  const { headword, pos, example, imageUrl } = viewModel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center w-full h-full px-6 py-5 gap-3"
    >
      {/* Image — compact */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={headword || ''}
          loading="lazy"
          className="w-full flex-shrink-0 object-contain rounded-2xl mb-3"
          style={{ maxHeight: 130, background: 'var(--color-surface)' }}
        />
      ) : null}

      {/* Headword */}
      <div className="flex flex-col items-center gap-2">
        <span className="eb-label">English</span>
        <p
          className="font-black text-center leading-tight tracking-tight"
          style={{
            color: 'var(--color-text)',
            fontSize: imageUrl ? '2rem' : '2.8rem',
            wordBreak: 'break-word',
          }}
        >
          {headword || ''}
        </p>
        {pos ? (
          <span className="eb-hint italic">{pos}</span>
        ) : null}
      </div>

      {/* Example hint */}
      {example ? (
        <p className="eb-hint italic text-center leading-relaxed px-4" style={{ opacity: 0.65, maxWidth: 320 }}>
          {maskWord(example, headword)}
        </p>
      ) : null}

      {/* Tap hint */}
      <p className="eb-hint flex items-center gap-1" style={{ opacity: 0.4 }}>
        <span>👆</span> Tap to reveal
      </p>
    </motion.div>
  );
}
