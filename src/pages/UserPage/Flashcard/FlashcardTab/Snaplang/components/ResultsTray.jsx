import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FlashcardItem from './FlashcardItem';

const ResultsTray = ({
  flashcards,
  onClear,
  onSaveAll,
  onRemoveCard,
  saving,
}) => {
  const isEmpty = flashcards.length === 0;

  // Animation variants for pulse rings
  const ringVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.6, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden relative shadow-sm transition-all">
      
      {/* ── HEADER ── */}
      <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-500 shrink-0">
            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[17px] font-black text-slate-900 leading-none tracking-tight uppercase">Khay kết quả</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${isEmpty ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'}`} />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {isEmpty ? 'Chờ nhận diện' : `${flashcards.length} mục sẵn sàng`}
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
              className="flex items-center gap-3"
            >
              <button 
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90" 
                onClick={onClear}
                title="Xóa tất cả"
              >
                <DeleteOutlineIcon sx={{ fontSize: 20 }} />
              </button>
              
              <button
                className="h-11 px-6 rounded-2xl bg-slate-900 text-white flex items-center gap-2.5 font-black text-[13px] uppercase tracking-tighter hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-slate-900/10"
                onClick={onSaveAll}
                disabled={saving}
              >
                <SaveAltIcon sx={{ fontSize: 18 }} />
                <span>Lưu tất cả</span>
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-black text-[11px]">
                  {flashcards.length}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── BODY ── */}
      <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {isEmpty ? (
          <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative w-24 h-24 mb-10">
              <motion.div variants={ringVariants} animate="animate" className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200" />
              <motion.div variants={ringVariants} animate="animate" transition={{ delay: 0.8 }} className="absolute -inset-4 rounded-full border-2 border-dashed border-slate-100" />
              <motion.div variants={ringVariants} animate="animate" transition={{ delay: 1.6 }} className="absolute -inset-8 rounded-full border-2 border-dashed border-slate-50" />
              <div className="absolute inset-0 flex items-center justify-center bg-white rounded-[2rem] border-2 border-slate-100/50 text-slate-300 shadow-xl shadow-slate-100/20">
                <AutoAwesomeIcon sx={{ fontSize: 32 }} />
              </div>
            </div>

            <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Khu vực hiển thị</h4>
            <p className="text-[14px] font-bold text-slate-400 leading-relaxed max-w-[260px] mx-auto">
              Sử dụng bảng bên trái để tải ảnh lên. Những tấm thẻ học mới sẽ xuất hiện tại đây.
            </p>
            
            <div className="flex gap-2 mt-10">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  variants={dotVariants} 
                  animate="animate" 
                  transition={{ delay: i * 0.4 }}
                  className="w-1.5 h-1.5 bg-slate-200 rounded-full" 
                />
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {flashcards.map((card, index) => (
              <motion.div
                key={card.id}
                className="mb-4 last:mb-0"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <FlashcardItem card={card} onRemove={onRemoveCard} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default React.memo(ResultsTray);