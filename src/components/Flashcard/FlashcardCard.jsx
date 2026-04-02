import React from 'react';
import { IconButton, alpha } from '@mui/material';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { getFlashcardViewModel } from '../../utils/flashcardSelectors';

function safeSpeak(text) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch { /* noop */ }
}

/** Highlight the headword inside the example sentence */
function HighlightedExample({ text, word }) {
  if (!text) return null;
  if (!word) return <span>{text}</span>;
  const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <strong key={i} className="font-bold text-gray-800 not-italic">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

const FlashcardCard = React.memo(function FlashcardCard({
  card,
  onRemove,
  isPublic = false,
  isFavorite = false,
  onToggleFavorite,
  onEdit,
  badgeText,
  onCardClick,
  compact = false,
  dense = false,
  hideAudio = false,
}) {
  const viewModel = getFlashcardViewModel(card);
  const { headword, pos, example, translation, senses, imageUrl } = viewModel || {};

  return (
    <div className={`group flex flex-row w-full bg-white border border-slate-200 shadow-sm hover:shadow transition-all duration-150 overflow-hidden ${compact ? 'rounded-md' : 'rounded-xl'}`}>

      {/* ── Left: text content (clickable) — full mode only ── */}
      {!compact && (
      <div
        className="flex-1 min-w-0 p-3.5 flex flex-col gap-1 cursor-pointer"
        onClick={() => onCardClick?.(card)}
      >

        {/* Row 1: headword + audio */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[22px] font-bold text-slate-900 leading-tight">
            {headword || '—'}
          </span>

          {badgeText && (
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              {badgeText}
            </span>
          )}

          {!hideAudio && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); safeSpeak(headword); }}
              sx={{ width: 26, height: 26, borderRadius: 1.5, color: alpha('#475569', 0.7), '&:hover': { bgcolor: 'rgba(148,163,184,0.15)', color: '#334155' } }}
            >
              <VolumeUpOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </div>

        {/* Row 2: pos + meaning */}
        <p className="text-[15px] font-semibold text-slate-700 leading-snug">
          {pos && <span className="text-[11px] uppercase tracking-wide text-slate-500 font-medium mr-2">{pos}</span>}
          {translation || '—'}
        </p>

        {/* Row 3: senses / definition / example sentence — hidden in compact mode */}
        {!compact && (
          senses?.length ? (
            <div className="flex flex-col gap-2 mt-1.5">
              {senses.map((s, i) => (
                <div key={i} className="flex flex-col gap-1 border-l border-slate-300 pl-2.5">
                  <span className="text-[13px] font-semibold text-slate-800">{s.definition}</span>
                  {s.examples?.[0]?.sentence && (
                     <span className="text-[12px] italic text-slate-500">
                       <HighlightedExample text={s.examples[0].sentence} word={headword} />
                     </span>
                  )}
                </div>
              ))}
            </div>
          ) : example ? (
            <div className="border-l border-slate-300 pl-2.5 mt-0.5">
              <p className="text-[12px] italic text-slate-500 leading-relaxed">
                <HighlightedExample text={example} word={headword} />
              </p>
            </div>
          ) : null
        )}
      </div>
      )} {/* end !compact left column */}

      {/* ── Right: thumbnail + actions — full mode only ── */}
      {!compact && (
        <div className="shrink-0 flex flex-col items-end justify-between p-2.5 gap-1.5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={headword || ''}
              className="w-20 h-20 object-cover rounded-md border border-slate-200"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <ImageOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
          )}

          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(card.id); }}
                sx={{ width: 26, height: 26, borderRadius: 1.5, color: isFavorite ? '#D97706' : alpha('#64748B', 0.5), '&:hover': { bgcolor: 'rgba(217,119,6,0.1)', color: '#B45309' } }}
              >
                {isFavorite ? <StarRoundedIcon sx={{ fontSize: 16 }} /> : <StarBorderRoundedIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            )}

            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onEdit?.(card); }}
                sx={{ width: 26, height: 26, borderRadius: 1.5, color: alpha('#64748B', 0.5), '&:hover': { bgcolor: 'rgba(148,163,184,0.15)', color: '#334155' } }}
              >
                <EditRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}

            {!isPublic && onRemove && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onRemove?.(card.id); }}
                sx={{ width: 26, height: 26, borderRadius: 1.5, color: alpha('#64748B', 0.5), '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', color: '#DC2626' } }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </div>
        </div>
      )}

      {/* ── Compact mode: word list row ── */}
      {compact && (
        <div
          className={`flex-1 min-w-0 flex items-center gap-2 cursor-pointer transition-colors duration-150 group-hover:bg-slate-50/70 ${dense ? 'px-2 py-1.5' : 'px-3 py-2'}`}
          onClick={() => onCardClick?.(card)}
        >
          {/* Left: English + meaning stacked */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <span className={`font-semibold text-slate-900 leading-tight truncate transition-colors duration-150 group-hover:text-slate-950 ${dense ? 'text-[12px]' : 'text-[13px]'}`}>
              {headword || '—'}
            </span>
            <span className={`text-slate-500 font-medium leading-tight truncate ${dense ? 'text-[10px]' : 'text-[11px]'}`}>
              {pos ? `[${pos}] ` : ''}{translation || '—'}
            </span>
          </div>

          {/* Audio */}
          {!hideAudio && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); safeSpeak(headword); }}
              sx={{ width: dense ? 20 : 22, height: dense ? 20 : 22, borderRadius: 1.5, flexShrink: 0, color: alpha('#64748B', 0.55), '&:hover': { bgcolor: 'rgba(148,163,184,0.15)', color: '#334155' } }}
            >
              <VolumeUpOutlinedIcon sx={{ fontSize: dense ? 11 : 13 }} />
            </IconButton>
          )}

          {/* Delete */}
          {!isPublic && onRemove && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onRemove?.(card.id); }}
              sx={{ width: dense ? 20 : 22, height: dense ? 20 : 22, borderRadius: 1.5, flexShrink: 0, color: alpha('#64748B', 0.35), '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', color: '#DC2626' } }}
            >
              <CloseIcon sx={{ fontSize: dense ? 11 : 13 }} />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
});

export default FlashcardCard;
