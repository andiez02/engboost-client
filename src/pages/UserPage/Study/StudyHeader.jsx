import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { selectStudyProgress } from '../../../redux/study/studySlice';

export default function StudyHeader({ onLeave }) {
  const progress = useSelector(selectStudyProgress);
  const current = Math.min(progress.current, progress.total);
  const total = progress.total;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* top row */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onLeave}
          aria-label="leave session"
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* progress bar */}
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* counter */}
        <div className="shrink-0">
          <span className="text-sm font-bold text-indigo-600 tabular-nums">
            {current} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
