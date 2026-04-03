import StudyProgressBar from '../../components/ui/StudyProgressBar';
import XpFloat from '../../components/ui/XpFloat';
import CloseIcon from '@mui/icons-material/Close';

export default function StudyHeader({ 
  streak,
  sessionXp,
  lastXpEvent,
  progress, 
  sessionDuration, 
  onLeave 
}) {
  return (
    <div className="w-full">
      {/* Desktop Layout */ }
      <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-6 bg-white p-4 rounded-[24px] border-2 border-[#E5E5E5] border-b-[6px] mb-2 shadow-sm">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onLeave}
            className="group flex flex-shrink-0 items-center justify-center text-[#AFAFAF] hover:text-[#4B4B4B] transition-all p-2 bg-transparent hover:bg-[#F7F7F7] rounded-2xl border-2 border-transparent hover:border-[#E5E5E5] hover:border-b-[4px] active:border-b-2 active:translate-y-[2px]"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 font-black text-[#FF9600] px-3 py-1.5 rounded-xl border-2 border-[#FFD8A8] bg-[#FFF4E5] shadow-sm">
              <span className="text-xl">🔥</span>
              <span className="text-lg tabular-nums leading-none mb-[2px]">{streak}</span>
            </div>
          )}
        </div>

        {/* Middle */}
        <div className="flex w-full overflow-hidden px-4">
          <StudyProgressBar progress={progress} />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <XpFloat sessionXp={sessionXp} lastXpEvent={lastXpEvent} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col gap-3 bg-white p-4 rounded-3xl border-2 border-[#E5E5E5] border-b-[6px] mb-2 shadow-sm w-full">
        {/* Top: Progress with Close button */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onLeave}
            className="group flex flex-shrink-0 items-center justify-center text-[#AFAFAF] active:text-[#4B4B4B] transition-all p-1.5 bg-transparent rounded-xl border-2 border-transparent active:border-[#E5E5E5] active:border-b-[3px] active:translate-y-[1px]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 w-full flex items-center pr-1">
             <StudyProgressBar progress={progress} />
          </div>
        </div>

        {/* Bottom: Streak + Timer + XP */}
        <div className="flex items-center justify-between w-full mt-1">
          {streak > 0 ? (
            <div className="flex items-center gap-1 font-black text-[#FF9600] px-2.5 py-1 rounded-xl border-2 border-[#FFD8A8] bg-[#FFF4E5]">
              <span className="text-lg">🔥</span>
              <span className="text-[15px] tabular-nums leading-none mb-[1px]">{streak}</span>
            </div>
          ) : <div />}
          <div className="flex items-center gap-2">
            <div className="scale-[0.85] origin-right">
               <XpFloat sessionXp={sessionXp} lastXpEvent={lastXpEvent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
