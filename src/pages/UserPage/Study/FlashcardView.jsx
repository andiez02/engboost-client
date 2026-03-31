import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { flipCard } from '../../../redux/study/studySlice';
import FlashcardFront from './FlashcardFront';
import FlashcardBack from './FlashcardBack';

export default function FlashcardView({ card, isTransitioning }) {
  const dispatch = useDispatch();
  const isFlipped = useSelector((state) => state.study.isFlipped);

  if (!card) return null;

  return (
    <motion.div
      animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 10 : 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => dispatch(flipCard())}
      className="w-full cursor-pointer select-none hover:scale-[1.01] transition-transform duration-200"
      style={{ minHeight: 420, perspective: 1400 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: 'relative', width: '100%', minHeight: 420, transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-indigo-50 overflow-hidden flex flex-col"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <FlashcardFront card={card} />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0 8px 40px rgba(79,70,229,0.35)',
          }}
        >
          <FlashcardBack card={card} />
        </div>
      </motion.div>
    </motion.div>
  );
}
