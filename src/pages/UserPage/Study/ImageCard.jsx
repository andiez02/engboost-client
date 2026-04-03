import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import FlashcardView from './FlashcardView';
import RatingButtons from './RatingButtons';
import { getResponseTimeLabel, formatResponseTime } from './utils/responseTimeLabel';

/**
 * ImageCard - Image-based study mode
 * 
 * Flow:
 * 1. Display image
 * 2. User chooses: typing or flip-to-reveal
 * 3a. Typing path: input → validate → feedback → rating
 * 3b. Flip path: reveal headword → rating
 */
export default function ImageCard({ card, onAnswer, responseTimeMs, lastRating, isTransitioning, nextCard }) {
  const [mode, setMode] = useState(null); // 'typing' | 'flip'
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const controls = useAnimation();

  if (!card) {
    console.warn('[ImageCard] Invalid props, missing card');
    return null;
  }

  const imageUrl = card.lexicalEntry?.imageUrl;
  const headword = card.lexicalEntry?.headword || '';

  // Fallback to FlashcardView if no image
  if (!imageUrl) {
    console.warn('[ImageCard] No imageUrl, falling back to FlashcardView');
    return (
      <FlashcardView
        card={card}
        isTransitioning={isTransitioning}
        nextCard={nextCard}
        responseTimeMs={responseTimeMs}
        lastRating={lastRating}
      />
    );
  }

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleTypingSubmit = () => {
    if (submitted) return;

    // Normalize: trim and lowercase
    const normalized = userInput.trim().toLowerCase();
    const expected = headword.trim().toLowerCase();
    const correct = normalized === expected;

    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !submitted) {
      handleTypingSubmit();
    }
  };

  const handleFlipReveal = () => {
    setRevealed(true);
  };

  // Rating feedback animation
  useEffect(() => {
    if (lastRating === null || lastRating === undefined) return;

    const animations = {
      0: { x: [-3, 3, -3, 3, 0], backgroundColor: ['#ffffff', '#FEE2E2', '#ffffff'], transition: { duration: 0.25 } },
      1: { scale: [1, 1.02, 1], backgroundColor: ['#ffffff', '#FEF3C7', '#ffffff'], transition: { duration: 0.2 } },
      2: { backgroundColor: ['#ffffff', '#D1FAE5', '#ffffff'], transition: { duration: 0.2 } },
      3: { scale: [1, 1.03, 1], backgroundColor: ['#ffffff', '#DBEAFE', '#ffffff'], transition: { duration: 0.25 } },
    };

    const anim = animations[lastRating];
    if (anim) {
      controls.start(anim);
    }
  }, [lastRating, controls]);

  // Response time feedback
  const timeLabel = responseTimeMs ? getResponseTimeLabel(responseTimeMs) : null;

  const showRating = (mode === 'typing' && submitted) || (mode === 'flip' && revealed);

  return (
    <motion.div
      animate={controls}
      className="w-full bg-white rounded-3xl shadow-xl border border-indigo-50 overflow-hidden"
      style={{ minHeight: 420 }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full px-8 py-8 gap-6">
        {/* Response time badge */}
        {timeLabel && showRating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50"
          >
            <span className="text-sm">{timeLabel.emoji}</span>
            <span className="text-xs font-bold text-indigo-600">
              {formatResponseTime(responseTimeMs)}
            </span>
          </motion.div>
        )}

        {/* Label */}
        <span className="text-[11px] font-black tracking-[0.2em] text-indigo-400 uppercase">
          What is this?
        </span>

        {/* Image */}
        <motion.img
          src={imageUrl}
          alt="vocabulary"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm h-64 object-cover rounded-2xl shadow-lg"
        />

        {/* Mode Selection */}
        {!mode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="flex gap-3 mt-4"
          >
            <motion.button
              onClick={() => handleModeSelect('typing')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Type Answer
            </motion.button>
            <motion.button
              onClick={() => handleModeSelect('flip')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
            >
              Flip to Reveal
            </motion.button>
          </motion.div>
        )}

        {/* Typing Mode */}
        {mode === 'typing' && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md flex flex-col gap-3"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type the English word..."
              autoFocus
              className="w-full px-6 py-4 text-lg font-semibold text-center border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <motion.button
              onClick={handleTypingSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Submit
            </motion.button>
          </motion.div>
        )}

        {/* Typing Feedback */}
        {mode === 'typing' && submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className={`text-center font-bold text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {!isCorrect && (
              <div className="text-center text-gray-600">
                <span className="text-sm">Correct answer: </span>
                <span className="font-bold text-lg text-indigo-900">{headword}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Flip Mode */}
        {mode === 'flip' && !revealed && (
          <motion.button
            onClick={handleFlipReveal}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Reveal Answer
          </motion.button>
        )}

        {/* Flip Revealed */}
        {mode === 'flip' && revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <div className="text-5xl font-black text-indigo-900">{headword}</div>
          </motion.div>
        )}

        {/* Rating Buttons */}
        {showRating && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full max-w-md mt-4"
          >
            <RatingButtons onRate={onAnswer} disabled={false} />
          </motion.div>
        )}

        {!showRating && mode && (
          <p className="text-xs text-gray-400 mt-auto">
            {mode === 'typing' ? 'Press Enter or click Submit' : 'Click to reveal the answer'}
          </p>
        )}
      </div>
    </motion.div>
  );
}
