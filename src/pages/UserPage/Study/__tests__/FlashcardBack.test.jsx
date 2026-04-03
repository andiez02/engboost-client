import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlashcardBack from '../components/cards/FlashcardBack';

const card = {
  id: '1',
  english: 'serendipity',
  vietnamese: 'sự tình cờ may mắn',
  image_url: 'https://example.com/image.jpg',
};

describe('FlashcardBack', () => {
  it('renders Vietnamese meaning correctly', () => {
    render(<FlashcardBack card={card} />);
    expect(screen.getByText('sự tình cờ may mắn')).toBeInTheDocument();
  });

  it('renders MEANING label', () => {
    render(<FlashcardBack card={card} />);
    expect(screen.getByText('MEANING')).toBeInTheDocument();
  });

  it('renders "Rate your recall below" hint', () => {
    render(<FlashcardBack card={card} />);
    expect(screen.getByText('Rate your recall below')).toBeInTheDocument();
  });

  it('does not render <img> even when card has image_url', () => {
    render(<FlashcardBack card={card} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render <img> when image_url is absent', () => {
    render(<FlashcardBack card={{ english: 'test', vietnamese: 'kiểm tra' }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('returns null when card is null', () => {
    const { container } = render(<FlashcardBack card={null} />);
    expect(container.firstChild).toBeNull();
  });
});
