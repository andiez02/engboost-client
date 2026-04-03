import { motion } from 'framer-motion';
import FlashcardView from './FlashcardView';
import MCQCard from './MCQCard';
import TypingCard from './TypingCard';
import ImageCard from './ImageCard';
import StudyModeErrorBoundary from './StudyModeErrorBoundary';

/**
 * StudyRenderer - Routes flashcards to appropriate study mode components.
 * Cards render ONLY their content area (no wrapper, no RatingButtons).
 * RatingButtons are managed by StudyPage below the card container.
 */
export default function StudyRenderer({ 
  card, 
  isTransitioning, 
  nextCard, 
  responseTimeMs, 
  lastRating, 
  onAnswer,
  onTypingSubmit,
  onMCQSelect,
  className = '',
}) {
  if (!card) return null;

  const mode = card.studyMode || 'recall';

  const renderMode = () => {
    switch (mode) {
      case 'recall':
        return (
          <FlashcardView
            card={card}
            isTransitioning={isTransitioning}
            nextCard={nextCard}
            responseTimeMs={responseTimeMs}
            lastRating={lastRating}
          />
        );

      case 'multiple_choice':
        if (!card.options || card.options.length < 4) {
          console.warn('[StudyRenderer] MCQ mode but invalid options, falling back to recall');
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
        return (
          <MCQCard
            card={card}
            options={card.options}
            onAnswer={onAnswer}
            responseTimeMs={responseTimeMs}
            lastRating={lastRating}
            onSelect={onMCQSelect}
          />
        );

      case 'typing':
        return (
          <TypingCard
            card={card}
            onAnswer={onAnswer}
            responseTimeMs={responseTimeMs}
            lastRating={lastRating}
            onSubmit={onTypingSubmit}
          />
        );

      case 'image':
        return (
          <ImageCard
            card={card}
            onAnswer={onAnswer}
            responseTimeMs={responseTimeMs}
            lastRating={lastRating}
            isTransitioning={isTransitioning}
            nextCard={nextCard}
          />
        );

      default:
        console.warn(`[StudyRenderer] Invalid studyMode: ${mode}, falling back to recall`);
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
  };

  return (
    <StudyModeErrorBoundary
      card={card}
      isTransitioning={isTransitioning}
      nextCard={nextCard}
      responseTimeMs={responseTimeMs}
      lastRating={lastRating}
    >
      <motion.div
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full ${className}`}
      >
        {renderMode()}
      </motion.div>
    </StudyModeErrorBoundary>
  );
}
