import { motion } from 'framer-motion';

export default function StudyProgressBar({ progress }) {
  // progress should be a fraction from 0 to 1
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <div className="w-full flex-1">
      <div className="h-[12px] bg-[#E5E5E5] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
