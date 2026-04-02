import { motion } from 'framer-motion';
import { highlightWord } from './utils/highlightWord';
import { getFlashcardViewModel } from '../../../utils/flashcardSelectors';

export default function FlashcardFront({ card }) {
  if (!card) return null;

  const viewModel = getFlashcardViewModel(card);
  const { headword, pos: renderPos, example: renderExample, senses, imageUrl } = viewModel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full h-full p-6 gap-4"
    >
      {/* Image — contained, not dominant */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={headword || ''}
          className="w-full h-52 object-contain bg-gray-50 rounded-2xl flex-shrink-0"
        />
      ) : null}

      {/* Word — main focus */}
      <div className="flex flex-col items-center gap-1.5 flex-1 justify-center w-full">
        <span className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase">
          English
        </span>
        <p className="text-4xl font-black text-gray-900 text-center leading-tight tracking-tight">
          {headword || ''}
        </p>
        {renderPos ? (
          <p className="text-xs italic text-gray-400">{renderPos}</p>
        ) : null}
      </div>

      {/* Senses or Fallback */}
      {senses?.length ? (
        <div className="w-full max-h-[140px] overflow-y-auto mt-2 flex flex-col gap-4 text-left p-1" style={{ scrollbarWidth: 'none' }}>
          {senses.map((s, i) => (
            <section key={i} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-black text-indigo-400">{i + 1}.</span>
                <h3 className="text-sm font-bold text-gray-800 leading-tight">
                  {s.definition}
                </h3>
              </div>
              <p className="text-xs font-semibold text-gray-500 ml-4">{s.translation}</p>
              
              {s.examples?.length > 0 && (
                <div className="ml-4 mt-1 flex flex-col gap-1.5">
                  {s.examples.map((e, j) => (
                    <blockquote key={j} className="text-xs italic text-gray-500 border-l-2 border-indigo-200 pl-2">
                      {highlightWord(e.sentence, headword)}
                      {e.translation && <span className="block text-[10px] not-italic text-gray-400 mt-0.5">{e.translation}</span>}
                    </blockquote>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : renderExample ? (
        <p className="text-sm italic text-gray-500 text-center leading-relaxed w-full min-h-[40px] flex items-center justify-center">
          {highlightWord(renderExample, headword)}
        </p>
      ) : <div className="min-h-[40px]" />}

      {/* Hint */}
      <p className="text-xs text-gray-300 flex items-center gap-1">
        <span>👆</span> Tap to reveal
      </p>
    </motion.div>
  );
}
