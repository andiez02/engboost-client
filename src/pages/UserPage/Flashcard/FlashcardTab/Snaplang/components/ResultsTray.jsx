import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FlashcardItem from './FlashcardItem';
import { gamify as t } from '../../../../../../theme';

const ResultsTray = ({
  flashcards,
  onClear,
  onSaveAll,
  onRemoveCard,
  saving,
}) => {
  const isEmpty = flashcards.length === 0;

  const floatVariants = {
    animate: {
      y: [0, -6, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="flex flex-col min-h-full bg-white border-2 border-b-[4px] rounded-3xl overflow-hidden relative transition-all"
      style={{ borderColor: t.gray, borderBottomColor: t.grayDark }}>

      {/* ── HEADER ── */}
      <header className="px-5 py-4 bg-white border-b-2 flex items-center justify-between sticky top-0 z-20"
        style={{ borderBottomColor: t.gray }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <h3 className="text-[15px] font-black leading-none tracking-tight uppercase"
              style={{ color: t.text }}>
              Kết quả
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isEmpty ? t.gray : t.green }} />
              <p className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: t.sub }}>
                {isEmpty ? 'Chờ tạo thẻ' : `${flashcards.length} thẻ`}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!isEmpty && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ color: t.sub }}
                onMouseEnter={(e) => { e.currentTarget.style.color = t.red; e.currentTarget.style.backgroundColor = t.redBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.sub; e.currentTarget.style.backgroundColor = 'transparent'; }}
                onClick={onClear}
                title="Xóa tất cả"
              >
                <DeleteOutlineIcon sx={{ fontSize: 20 }} />
              </button>

              <button
                className="h-10 px-4 rounded-xl text-white flex items-center gap-2 font-black text-[12px] uppercase border-b-[3px] active:border-b-0 active:translate-y-[3px] disabled:opacity-50 disabled:pointer-events-none transition-all"
                style={{ backgroundColor: t.green, borderBottomColor: t.greenDark }}
                onClick={() => onSaveAll({ autoStudy: true })}
                disabled={saving}
              >
                <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
                <span className="hidden sm:inline">LƯU & HỌC</span>
              </button>

              <button
                className="h-10 px-4 rounded-xl bg-white flex items-center gap-2 font-black text-[12px] uppercase border-2 border-b-[4px] active:border-b-0 active:translate-y-[4px] disabled:opacity-50 disabled:pointer-events-none transition-all"
                style={{ color: t.text, borderColor: t.gray, borderBottomColor: t.grayDark }}
                onClick={onSaveAll}
                disabled={saving}
              >
                <SaveAltIcon sx={{ fontSize: 16 }} />
                <span className="hidden sm:inline">LƯU</span>
                <span className="min-w-[22px] h-[22px] rounded-md flex items-center justify-center font-black text-[11px]"
                  style={{ backgroundColor: t.surface, color: t.sub }}>
                  {flashcards.length}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── BODY ── */}
      <main className="flex-1 overflow-y-auto px-4 py-5 md:px-5 scroll-smooth scrollbar-thin scrollbar-thumb-[#E5E5E5] scrollbar-track-transparent">
        {isEmpty ? (
          <div className="min-h-[380px] flex flex-col items-center justify-center text-center px-6 relative">
            {/* Floating mascot */}
             <motion.div variants={floatVariants} animate="animate" className="mb-6">
              <div className="w-20 h-20 rounded-[1.4rem] bg-white border-2 border-b-[4px] flex items-center justify-center"
                style={{ backgroundColor: t.surface, borderColor: t.gray, borderBottomColor: t.grayDark }}>
                <span className="text-[2.5rem] leading-none">🦉</span>
              </div>
            </motion.div>

             <h4 className="text-lg font-black mb-2" style={{ color: t.text }}>Chưa có thẻ nào</h4>
            <p className="text-[13px] font-bold leading-relaxed max-w-[280px]" style={{ color: t.sub }}>
              Tải ảnh lên hoặc chọn chủ đề AI để bắt đầu tạo thẻ từ vựng!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence initial={false}>
              {flashcards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{
                    duration: 0.18,
                    delay: index * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <FlashcardItem card={card} onRemove={onRemoveCard} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(ResultsTray);