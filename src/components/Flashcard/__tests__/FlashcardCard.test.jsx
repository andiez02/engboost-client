import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlashcardCard from '../FlashcardCard';

describe('FlashcardCard', () => {
  describe('with pos and example fields', () => {
    it('should display pos and example when both are populated', () => {
      const card = {
        id: '1',
        english: 'run',
        vietnamese: 'chạy',
        pos: 'verb',
        example: 'I run every morning.',
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getAllByText('run')[0]).toBeInTheDocument(); // First occurrence (headword)
      expect(screen.getByText('chạy')).toBeInTheDocument();
      expect(screen.getByText('verb')).toBeInTheDocument();
      expect(screen.getAllByText((content, element) => {
        return element?.textContent === 'I run every morning.';
      })[0]).toBeInTheDocument();
    });

    it('should display only pos when example is null', () => {
      const card = {
        id: '1',
        english: 'hello',
        vietnamese: 'xin chào',
        pos: 'interjection',
        example: null,
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getByText('hello')).toBeInTheDocument();
      expect(screen.getByText('xin chào')).toBeInTheDocument();
      expect(screen.getByText('interjection')).toBeInTheDocument();
      expect(screen.queryByText(/example/i)).not.toBeInTheDocument();
    });

    it('should display only example when pos is null', () => {
      const card = {
        id: '1',
        english: 'goodbye',
        vietnamese: 'tạm biệt',
        pos: null,
        example: 'Goodbye, see you tomorrow!',
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getByText('goodbye')).toBeInTheDocument();
      expect(screen.getByText('tạm biệt')).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Goodbye, see you tomorrow!';
      })).toBeInTheDocument();
    });
  });

  describe('with legacy object field', () => {
    it('should use object as pos when it is not a sentence', () => {
      const card = {
        id: '1',
        english: 'car',
        vietnamese: 'xe hơi',
        object: 'noun',
        pos: null,
        example: null,
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getByText('car')).toBeInTheDocument();
      expect(screen.getByText('xe hơi')).toBeInTheDocument();
      expect(screen.getByText('noun')).toBeInTheDocument();
    });

    it('should use object as example when it is a sentence', () => {
      const card = {
        id: '1',
        english: 'work',
        vietnamese: 'làm việc',
        object: 'I work five days a week.',
        pos: null,
        example: null,
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getAllByText('work')[0]).toBeInTheDocument(); // First occurrence (headword)
      expect(screen.getByText('làm việc')).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'I work five days a week.';
      })).toBeInTheDocument();
    });
  });

  describe('field priority', () => {
    it('should prioritize pos field over object field', () => {
      const card = {
        id: '1',
        english: 'test',
        vietnamese: 'thử nghiệm',
        pos: 'verb',
        object: 'noun',
        example: null,
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getByText('verb')).toBeInTheDocument();
      expect(screen.queryByText('noun')).not.toBeInTheDocument();
    });

    it('should prioritize example field over object field', () => {
      const card = {
        id: '1',
        english: 'test',
        vietnamese: 'thử nghiệm',
        pos: null,
        example: 'This is a test.',
        object: 'This is an old example.',
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getByText((content, element) => {
        return element?.textContent === 'This is a test.';
      })).toBeInTheDocument();
      expect(screen.queryByText((content, element) => {
        return element?.textContent === 'This is an old example.';
      })).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should handle missing pos and example gracefully', () => {
      const card = {
        id: '1',
        english: 'word',
        vietnamese: 'từ',
        pos: null,
        example: null,
        object: null,
        image_url: null,
      };

      render(<FlashcardCard card={card} />);

      expect(screen.getByText('word')).toBeInTheDocument();
      expect(screen.getByText('từ')).toBeInTheDocument();
    });
  });
});
