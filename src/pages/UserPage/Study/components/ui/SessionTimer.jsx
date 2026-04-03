import React from 'react';

export default function SessionTimer({ seconds }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  
  return (
    <div className="flex items-center gap-2 font-mono font-black text-[#AFAFAF] bg-white px-3 py-2 rounded-[14px] border-2 border-[#E5E5E5]">
      {/* <span className="text-lg">⏱</span> */}
      <span className="text-[17px] leading-none mb-[2px]">{timeStr}</span>
    </div>
  );
}
