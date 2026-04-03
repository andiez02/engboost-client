import { AnimatePresence, motion } from 'framer-motion';
import { tokens } from '../../../theme';

/**
 * Floating "+XP ✨" text that animates upward and fades out.
 * Rendered absolutely above the parent card.
 */
export default function FloatingXP({ show, xp }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: -8,
            right: 16,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'linear-gradient(135deg, #FF9600, #FFB84D)',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1rem',
              padding: '6px 14px',
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(255, 150, 0, 0.35)',
            }}
          >
            +{xp} XP ✨
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
