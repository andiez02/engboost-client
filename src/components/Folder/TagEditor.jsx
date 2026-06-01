import React, { useState, useRef } from 'react';
import { gamify as t } from '../../theme';

const TAG_COLORS = [
  { bg: '#DDF4FF', border: '#1CB0F6', text: '#1CB0F6' },
  { bg: '#D7FFB8', border: '#58CC02', text: '#46A302' },
  { bg: '#FFF0F0', border: '#FF4B4B', text: '#EA2B2B' },
  { bg: '#FFF8EE', border: '#FF9600', text: '#E68600' },
  { bg: '#F6E5FF', border: '#CE82FF', text: '#A568CC' },
  { bg: '#F0F0F0', border: '#AFAFAF', text: '#6B6B6B' },
];

function tagColor(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function TagChip({ tag, onRemove, size = 'md' }) {
  const c = tagColor(tag);
  const small = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: small ? 3 : 4,
      padding: small ? '2px 8px' : '4px 10px',
      borderRadius: 999,
      background: c.bg,
      border: `2px solid ${c.border}`,
      fontSize: small ? '0.65rem' : '0.72rem',
      fontWeight: 800, color: c.text,
      whiteSpace: 'nowrap',
    }}>
      {tag}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, lineHeight: 1, color: c.text, fontSize: small ? '0.7rem' : '0.8rem',
            opacity: 0.7, fontWeight: 900,
          }}
        >×</button>
      )}
    </span>
  );
}

export default function TagEditor({ tags = [], onChange, allTags = [] }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const suggestions = allTags.filter(
    (t) => t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
  );

  const addTag = (tag) => {
    const clean = tag.trim().slice(0, 30);
    if (!clean || tags.includes(clean)) return;
    onChange([...tags, clean]);
    setInput('');
    inputRef.current?.focus();
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      {/* Tag input area */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
          minHeight: 42, padding: '6px 10px',
          borderRadius: 10, border: `2px solid ${t.gray}`,
          background: '#fff', cursor: 'text',
        }}
      >
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={removeTag} />
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Thêm nhãn... (Enter để xác nhận)' : ''}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: '0.82rem', fontWeight: 700, color: t.text,
            fontFamily: 'inherit', minWidth: 120, flex: 1,
          }}
        />
      </div>

      {/* Suggestions */}
      {input && suggestions.length > 0 && (
        <div style={{
          marginTop: 4, borderRadius: 10,
          border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
          background: '#fff', overflow: 'hidden',
        }}>
          {suggestions.slice(0, 6).map((s) => (
            <div
              key={s}
              onClick={() => addTag(s)}
              style={{
                padding: '8px 12px', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 700, color: t.text,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = t.surface}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 6, fontSize: '0.7rem', fontWeight: 700, color: t.sub }}>
        Nhấn Enter hoặc dấu phẩy để thêm nhãn
      </div>
    </div>
  );
}
