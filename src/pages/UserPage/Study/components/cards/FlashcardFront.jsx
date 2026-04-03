import { motion } from 'framer-motion';
import { maskWord } from '../../utils/maskWord';
import { getFlashcardViewModel } from '../../../../../utils/flashcardSelectors';

export default function FlashcardFront({ card }) {
  if (!card) return null;

  const viewModel = getFlashcardViewModel(card);
  const { headword, pos, example, imageUrl } = viewModel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col items-center justify-center w-full h-full px-8 py-6 gap-3"
    >
      {/* POS pill */}
      {pos && (
        <span
          className="flex-shrink-0 px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase"
          style={{ background: '#EEF2FF', color: '#4F46E5' }}
        >
          {pos}
        </span>
      )}

      {/* Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={headword || ''}
          loading="lazy"
          className="flex-shrink-0 w-full object-contain rounded-2xl"
          style={{
            maxHeight: 160,
            maxWidth: 340,
            background: '#F7F7F7',
          }}
        />
      ) : null}

      {/* Headword */}
      <p
        className="font-black text-center leading-none tracking-tight flex-shrink-0"
        style={{
          color: '#1A1A2E',
          fontSize: imageUrl ? '2.2rem' : '3.2rem',
          wordBreak: 'break-word',
        }}
      >
        {headword || ''}
      </p>

      {/* Masked example */}
      {example ? (
        <p
          className="italic text-center leading-snug flex-shrink-0 px-2"
          style={{
            color: '#AFAFAF',
            maxWidth: 300,
            fontSize: '0.85rem',
            fontStyle: 'italic',
          }}
        >
          {maskWord(example, headword)}
        </p>
      ) : null}

      {/* Tap to reveal pill */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-2xl select-none mt-2"
        style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#AFAFAF',
          background: '#F7F7F7',
          border: '2px solid #E5E5E5',
          borderBottom: '4px solid #D5D5D5',
          letterSpacing: '0.02em',
        }}
      >
        <span>👆</span> Tap to reveal
      </div>
    </motion.div>
  );
}
