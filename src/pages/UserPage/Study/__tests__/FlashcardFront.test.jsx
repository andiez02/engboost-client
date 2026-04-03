import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlashcardFront from '../components/cards/FlashcardFront';

const fullCard = {
  id: '1',
  english: 'serendipity',
  vietnamese: 'sự tình cờ may mắn',
  object: 'noun',
  example: 'It was pure serendipity that we met.',
  image_url: 'https://example.com/image.jpg',
};

const minimalCard = {
  english: 'hello',
  vietnamese: 'xin chào',
};

describe('FlashcardFront', () => {
  it('renders correctly with a full card (all fields present)', () => {
    render(<FlashcardFront card={fullCard} />);

    // The word appears in both the h2 and the highlighted span — use getAllByText
    expect(screen.getAllByText('serendipity').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
    expect(screen.getByText('noun')).toBeInTheDocument();
    expect(screen.getByText('Tap to reveal')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    // Example sentence text should be present (may be split across spans)
    expect(screen.getByText(/pure/i)).toBeInTheDocument();
  });

  it('renders correctly with a minimal card (only english and vietnamese)', () => {
    render(<FlashcardFront card={minimalCard} />);

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
    expect(screen.getByText('Tap to reveal')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render <img> when image_url is absent', () => {
    render(<FlashcardFront card={{ english: 'test', vietnamese: 'kiểm tra' }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render <img> when image_url is null', () => {
    render(<FlashcardFront card={{ english: 'test', vietnamese: 'kiểm tra', image_url: null }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render <img> when image_url is empty string', () => {
    render(<FlashcardFront card={{ english: 'test', vietnamese: 'kiểm tra', image_url: '' }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render example section when example is absent', () => {
    render(<FlashcardFront card={{ english: 'test', vietnamese: 'kiểm tra' }} />);
    expect(screen.queryByText(/It was/i)).not.toBeInTheDocument();
  });

  it('does not render example section when example is null', () => {
    render(<FlashcardFront card={{ english: 'test', vietnamese: 'kiểm tra', example: null }} />);
    // Only the word "test" and "ENGLISH" label and "Tap to reveal" should be present
    expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
  });

  it('renders example sentence when example is present', () => {
    render(
      <FlashcardFront
        card={{ english: 'cat', vietnamese: 'con mèo', example: 'The cat sat on the mat.' }}
      />
    );
    expect(screen.getByText(/sat on the mat/i)).toBeInTheDocument();
  });
});
