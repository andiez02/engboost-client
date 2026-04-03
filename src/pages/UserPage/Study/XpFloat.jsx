import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function XpFloat({ sessionXp, lastXpEvent }) {
  const [floats, setFloats] = useState([]);

  useEffect(() => {
    if (lastXpEvent) {
      const id = Date.now() + Math.random();
      setFloats((prev) => [...prev, { id, amount: lastXpEvent.amount, isCombo: lastXpEvent.isCombo }]);

      const timer = setTimeout(() => {
        setFloats((prev) => prev.filter((f) => f.id !== id));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [lastXpEvent]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Static Total XP Display */}
      <div className="flex items-center gap-2 font-black text-[#FF9600] bg-[#FFF4E5] px-4 py-2 rounded-[14px] border-2 border-[#FFD8A8]">
        <span className="text-[13px] uppercase tracking-wider text-[#FFD8A8]">XP</span>
        <span className="text-xl tabular-nums leading-none mb-[2px]">{sessionXp}</span>
      </div>

      {/* Floating Animations */}
      <AnimatePresence>
        {floats.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -45 }}
            className={`absolute left-1/2 -translate-x-1/2 text-center flex flex-col items-center justify-center pointer-events-none z-50`}
          >
            <div 
              className={`font-black text-xl px-3 py-1 bg-white/90 backdrop-blur-sm rounded-[14px] border-2 ${
                f.isCombo ? 'border-[#FFD8A8] text-[#FF9600]' : 'border-green-200 text-[#58CC02]'
              } border-b-[4px] shadow-sm flex items-center gap-1.5 whitespace-nowrap`}
            >
              <span>+{f.amount} XP</span>
              {f.isCombo && (
                <span className="text-[10px] uppercase bg-[#FF9600] text-white px-1.5 py-0.5 rounded leading-none mt-[2px]">
                  Combo
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
