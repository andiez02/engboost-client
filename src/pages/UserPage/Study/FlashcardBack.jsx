import { motion } from 'framer-motion';

export default function FlashcardBack({ card }) {
  if (!card) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="flex flex-col items-center justify-center w-full h-full px-8 py-10 gap-4"
    >
      {/* MEANING label */}
      <span className="text-[11px] font-black tracking-[0.2em] text-white/50 uppercase">
        Meaning
      </span>

      {/* Meaning — main focus */}
      <p className="text-5xl font-black text-white text-center leading-tight">
        {card.vietnamese || ''}
      </p>

      {/* Example on back — minimal */}
      {card.example ? (
        <p className="text-sm italic text-white/50 text-center leading-relaxed mt-2 max-w-xs">
          {card.example}
        </p>
      ) : null}

      {/* Hint */}
      <p className="text-xs text-white/30 mt-auto pt-4">Rate your recall below</p>
    </motion.div>
  );
}
