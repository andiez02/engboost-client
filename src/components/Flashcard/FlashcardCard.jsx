import React from 'react';
import { IconButton, alpha } from '@mui/material';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

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
  const imageUrl = card?.imageUrl || card?.image_url || null;
  const example =
    card?.example ||
    card?.example_sentence ||
    card?.exampleSentence ||
    card?.sentence ||
    card?.object ||
    '';

  return (
    <div className={`flex flex-row w-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${compact ? 'rounded-lg' : 'rounded-2xl'}`}>

      {/* ── Left: text content (clickable) — full mode only ── */}
      {!compact && (
      <div
        className="flex-1 min-w-0 p-4 flex flex-col gap-1.5 cursor-pointer"
        onClick={() => onCardClick?.(card)}
      >

        {/* Row 1: headword + audio */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl font-bold text-gray-900 leading-tight">
            {card?.english || '—'}
          </span>

          {badgeText && (
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              {badgeText}
            </span>
          )}

          {!hideAudio && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); safeSpeak(card?.english); }}
              sx={{ width: 28, height: 28, borderRadius: 2, color: alpha('#4F46E5', 0.55), '&:hover': { bgcolor: 'rgba(79,70,229,0.08)', color: '#4F46E5' } }}
            >
              <VolumeUpOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </div>

        {/* Row 2: meaning */}
        <p className="text-base font-semibold text-gray-700 leading-snug">
          {card?.vietnamese || '—'}
        </p>

        {/* Row 3: example sentence — hidden in compact mode */}
        {!compact && example ? (
          <div className="border-l-2 border-blue-200 pl-3 mt-0.5">
            <p className="text-sm italic text-gray-500 leading-relaxed">
              <HighlightedExample text={example} word={card?.english} />
            </p>
          </div>
        ) : null}
      </div>
      )} {/* end !compact left column */}

      {/* ── Right: thumbnail + actions — full mode only ── */}
      {!compact && (
        <div className="shrink-0 flex flex-col items-end justify-between p-3 gap-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card?.english || ''}
              className="w-24 h-24 object-cover rounded-xl border border-gray-100"
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
              <ImageOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
          )}

          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(card.id); }}
                sx={{ width: 28, height: 28, borderRadius: 2, color: isFavorite ? '#F59E0B' : alpha('#64748B', 0.5), '&:hover': { bgcolor: 'rgba(245,158,11,0.1)', color: '#F59E0B' } }}
              >
                {isFavorite ? <StarRoundedIcon sx={{ fontSize: 16 }} /> : <StarBorderRoundedIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            )}

            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onEdit?.(card); }}
                sx={{ width: 28, height: 28, borderRadius: 2, color: alpha('#64748B', 0.5), '&:hover': { bgcolor: 'rgba(2,132,199,0.08)', color: '#0284C7' } }}
              >
                <EditRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}

            {!isPublic && onRemove && (
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onRemove?.(card.id); }}
                sx={{ width: 28, height: 28, borderRadius: 2, color: alpha('#64748B', 0.5), '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', color: '#EF4444' } }}
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
          className={`flex-1 min-w-0 flex items-center gap-2 cursor-pointer ${dense ? 'px-2.5 py-1.5' : 'px-4 py-2.5'}`}
          onClick={() => onCardClick?.(card)}
        >
          {/* Left: English + meaning stacked */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <span className={`font-bold text-gray-900 leading-tight truncate ${dense ? 'text-[12px]' : 'text-[14px]'}`}>
              {card?.english || '—'}
            </span>
            <span className={`text-gray-400 font-medium leading-tight truncate ${dense ? 'text-[11px]' : 'text-[12px]'}`}>
              {card?.vietnamese || '—'}
            </span>
          </div>

          {/* Audio */}
          {!hideAudio && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); safeSpeak(card?.english); }}
              sx={{ width: dense ? 20 : 24, height: dense ? 20 : 24, borderRadius: 1.5, flexShrink: 0, color: alpha('#4F46E5', 0.45), '&:hover': { bgcolor: 'rgba(79,70,229,0.08)', color: '#4F46E5' } }}
            >
              <VolumeUpOutlinedIcon sx={{ fontSize: dense ? 11 : 13 }} />
            </IconButton>
          )}

          {/* Delete */}
          {!isPublic && onRemove && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onRemove?.(card.id); }}
              sx={{ width: dense ? 20 : 24, height: dense ? 20 : 24, borderRadius: 1.5, flexShrink: 0, color: alpha('#64748B', 0.3), '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', color: '#EF4444' } }}
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
