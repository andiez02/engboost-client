import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, X } from 'lucide-react';
import { gamify as t } from '../../../../../../theme';

const MotionDiv = motion.div;

const FlashcardItem = React.memo(({ card, onRemove }) => {
  const speak = () => {
    const text = card?.english;
    if (!text) return;
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {
      // No-op: some browsers might block TTS.
    }
  };

  return (
    <MotionDiv
      layout
      className="group relative p-4 bg-white rounded-3xl border-2 border-b-[4px] transition-all duration-150"
      style={{ borderColor: t.gray, borderBottomColor: t.grayDark }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.blue;
        e.currentTarget.style.borderBottomColor = t.blueDark;
        e.currentTarget.style.backgroundColor = '#F2FCFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.gray;
        e.currentTarget.style.borderBottomColor = t.grayDark;
        e.currentTarget.style.backgroundColor = '#fff';
      }}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={() => onRemove(card.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10"
          style={{ color: t.sub }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = t.red; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = t.sub; e.currentTarget.style.backgroundColor = 'transparent'; }}
          aria-label="Xóa flashcard"
        >
          <X size={16} strokeWidth={3} />
        </button>
      )}

      {/* Image (top) */}
      <div className="h-[140px] rounded-2xl overflow-hidden border-2 flex items-center justify-center relative"
        style={{ backgroundColor: t.surface, borderColor: t.gray }}>
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.object || card.english}
            className="w-[92%] h-[92%] object-contain"
          />
        ) : (
          <span className="text-4xl opacity-50">🖼️</span>
        )}
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
        {card.object && (
          <span className="text-[11px] font-black uppercase tracking-widest leading-none"
            style={{ color: t.blue }}>
            {card.object}
          </span>
        )}

        <div className="flex items-start justify-between gap-2">
          <span className="text-[17px] font-black tracking-tight leading-snug truncate"
            style={{ color: t.text }}>
            {card.english}
          </span>

          {/* Speaker (optional) */}
          <button
            onClick={speak}
            className="w-9 h-9 -mt-1 -mr-1 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0"
            style={{ color: t.sub }}
            onMouseEnter={(e) => { e.currentTarget.style.color = t.blue; e.currentTarget.style.backgroundColor = t.blueBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.sub; e.currentTarget.style.backgroundColor = 'transparent'; }}
            aria-label="Phát âm"
            type="button"
          >
            <Volume2 size={20} strokeWidth={2.5} />
          </button>
        </div>

        <span className="text-[14px] font-bold leading-snug line-clamp-2"
          style={{ color: t.sub }}>
          {card.vietnamese}
        </span>
      </div>
    </MotionDiv>
  );
});

export default FlashcardItem;
