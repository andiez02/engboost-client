import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { flipCard } from '../../../../../redux/study/studySlice';
import FlashcardFront from './FlashcardFront';
import FlashcardBack from './FlashcardBack';

export default function FlashcardView({ card, isTransitioning, nextCard, responseTimeMs, lastRating }) {
  const dispatch  = useDispatch();
  const isFlipped = useSelector((state) => state.study.isFlipped);
  const controls  = useAnimation();

  const lastFlipRef = useRef(0);
  const handleClick = () => {
    const now = Date.now();
    if (now - lastFlipRef.current < 300) return;
    lastFlipRef.current = now;
    dispatch(flipCard());
  };

  // Preload next card image
  useEffect(() => {
    if (!nextCard?.lexicalEntry?.imageUrl) return;
    const img = new Image();
    img.src = nextCard.lexicalEntry.imageUrl;
  }, [nextCard]);

  // Rating feedback animation
  useEffect(() => {
    if (lastRating === null || lastRating === undefined) return;
    const animations = {
      0: { x: [-4, 4, -4, 4, 0], transition: { duration: 0.25 } },
      1: { scale: [1, 1.025, 1], transition: { duration: 0.2 } },
      2: { scale: [1, 1.025, 1], transition: { duration: 0.2 } },
      3: { scale: [1, 1.035, 1], transition: { duration: 0.25 } },
    };
    const anim = animations[lastRating];
    if (anim) controls.start(anim);
  }, [lastRating, controls]);

  if (!card) return null;

  return (
    <motion.div
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.15 }}
      onClick={handleClick}
      className="w-full h-full cursor-pointer select-none"
      style={{ perspective: 1200 }}
    >
      {/* Flip container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1], // snappy over-shoot feel
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── FRONT ── */}
        <motion.div
          animate={controls}
          className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <FlashcardFront card={card} />
        </motion.div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 60%, #6D28D9 100%)',
            boxShadow: '0 12px 48px rgba(79,70,229,0.4)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <FlashcardBack card={card} responseTimeMs={responseTimeMs} />
        </div>
      </motion.div>
    </motion.div>
  );
}
