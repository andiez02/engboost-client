import { Component } from 'react';
import FlashcardView from './components/cards/FlashcardView';

/**
 * Error Boundary for study mode components
 * Falls back to FlashcardView (recall mode) on error
 */
class StudyModeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[StudyModeErrorBoundary] Component error:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      card: this.props.card,
      mode: this.props.card?.studyMode,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback to FlashcardView
      return (
        <FlashcardView
          card={this.props.card}
          isTransitioning={this.props.isTransitioning}
          nextCard={this.props.nextCard}
          responseTimeMs={this.props.responseTimeMs}
          lastRating={this.props.lastRating}
        />
      );
    }

    return this.props.children;
  }
}

export default StudyModeErrorBoundary;
