import { motion, AnimatePresence } from 'framer-motion';

export default function ComboIndicator({ combo }) {
  if (combo < 2) return null;

  const isExplosion = combo >= 10;
  const isPulse = combo >= 5 && combo < 10;
  const isGlow = combo >= 3 && combo < 5;

  const glowStyle = isExplosion ? 'drop-shadow(0 0 15px rgba(255,75,75,0.8))'
                  : isPulse ? 'drop-shadow(0 0 10px rgba(255,150,0,0.6))'
                  : isGlow ? 'drop-shadow(0 0 5px rgba(255,150,0,0.4))'
                  : 'none';

  return (
    <AnimatePresence>
      <div className="absolute -top-14 left-0 right-0 flex justify-center pointer-events-none z-50">
        <motion.div
          key={combo}
          initial={{ opacity: 0, y: 15, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <motion.div
            animate={
              isExplosion ? { scale: [1, 1.15, 1], rotate: [-2, 2, 0] } :
              isPulse ? { scale: [1, 1.05, 1] } :
              { scale: 1 }
            }
            transition={
              isExplosion || isPulse 
                ? { repeat: Infinity, duration: 0.6, repeatType: 'reverse' } 
                : {}
            }
            className="flex items-center gap-2 font-black bg-white/90 backdrop-blur-sm px-5 py-2 rounded-2xl border-2 border-[#E5E5E5] border-b-[4px]"
            style={{ filter: glowStyle }}
          >
            <span className="text-2xl">🔥</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9600] to-[#FF4B4B] text-xl uppercase tracking-widest leading-none mt-1">
              {combo} COMBO
            </span>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
