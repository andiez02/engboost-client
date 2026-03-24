import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const FlashcardItem = React.memo(({ card, onRemove }) => (
  <motion.div
    layout
    className="group relative flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/60 transition-all duration-200"
  >
    {/* Thumbnail */}
    <div className="w-[68px] h-[68px] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
      {card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt={card.object || card.english}
          className="w-[90%] h-[90%] object-contain"
        />
      ) : (
        <span className="text-2xl">🖼️</span>
      )}
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
      {card.object && (
        <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
          {card.object}
        </span>
      )}
      <span className="text-[15px] font-bold text-slate-900 tracking-tight truncate leading-snug">
        {card.english}
      </span>
      <span className="text-[13px] text-slate-400 font-medium italic truncate">
        {card.vietnamese}
      </span>
    </div>

    {/* Remove button */}
    {onRemove && (
      <button
        onClick={() => onRemove(card.id)}
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150"
        aria-label="Xóa flashcard"
      >
        <X size={13} strokeWidth={2.5} />
      </button>
    )}
  </motion.div>
));

export default FlashcardItem;
