import { motion } from 'framer-motion';
import { highlightWord } from './utils/highlightWord';

export default function FlashcardFront({ card }) {
  if (!card) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full h-full p-6 gap-4"
    >
      {/* Image — contained, not dominant */}
      {card.image_url ? (
        <img
          src={card.image_url}
          alt={card.english || ''}
          className="w-full h-52 object-contain bg-gray-50 rounded-2xl flex-shrink-0"
        />
      ) : null}

      {/* Word — main focus */}
      <div className="flex flex-col items-center gap-1.5 flex-1 justify-center w-full">
        <span className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase">
          English
        </span>
        <p className="text-4xl font-black text-gray-900 text-center leading-tight tracking-tight">
          {card.english || ''}
        </p>
        {card.object ? (
          <p className="text-xs italic text-gray-400">{card.object}</p>
        ) : null}
      </div>

      {/* Example — supporting */}
      {card.example ? (
        <p className="text-sm italic text-gray-500 text-center leading-relaxed w-full">
          {highlightWord(card.example, card.english)}
        </p>
      ) : null}

      {/* Hint */}
      <p className="text-xs text-gray-300 flex items-center gap-1">
        <span>👆</span> Tap to reveal
      </p>
    </motion.div>
  );
}
