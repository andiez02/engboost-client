import React from 'react';
import { Box, Typography } from '@mui/material';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Helper to format duration in mm:ss
const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function StudySidebar({
  reviewed,
  correct,
  queueLength,
  dueCount,
  nextReviewAt,
  sessionDuration,
}) {
  return (
    <div className="bg-white rounded-[24px] p-6 space-y-8 h-fit lg:sticky lg:top-6 border-2 border-[#E5E5E5] border-b-[6px]">
      
      {/* Target/Session Status */}
      <section>
        <h3 className="text-[13px] font-black text-[#AFAFAF] uppercase tracking-wider mb-4">
          Tiến độ phiên học
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#4B4B4B]">
              <div className="w-11 h-11 rounded-xl bg-[#1CB0F6] flex items-center justify-center text-white border-b-[4px] border-[#1899D6]">
                <InsertChartOutlinedIcon fontSize="small" />
              </div>
              <span className="font-bold text-[15px]">Đã ôn tập</span>
            </div>
            <span className="font-black text-[#4B4B4B] text-xl tabular-nums">
              {reviewed} <span className="text-[#AFAFAF] text-sm font-bold">/ {queueLength}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#4B4B4B]">
              <div className="w-11 h-11 rounded-xl bg-[#58CC02] flex items-center justify-center text-white border-b-[4px] border-[#46A302]">
                <CheckCircleOutlineIcon fontSize="small" />
              </div>
              <span className="font-bold text-[15px]">Chính xác</span>
            </div>
            <span className="font-black text-[#4B4B4B] text-xl tabular-nums">{correct}</span>
          </div>
        </div>
      </section>

      <hr className="border-2 border-[#F0F0F0] rounded-full" />

      {/* Remaining Due */}
      <section>
        <h3 className="text-[13px] font-black text-[#AFAFAF] uppercase tracking-wider mb-4">
          Thẻ chờ ôn
        </h3>
        <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-[4px]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#4B4B4B] text-[15px] flex items-center gap-2">
               <span className="text-xl">🎯</span> Đến hạn
            </span>
            <span className={`font-black text-xl tabular-nums ${dueCount > 0 ? 'text-[#FF4B4B]' : 'text-[#58CC02]'}`}>
               {dueCount}
            </span>
          </div>
          {nextReviewAt && (
            <p className="text-[12px] font-bold text-[#AFAFAF] mt-2 border-t-2 border-dashed border-[#F0F0F0] pt-2">
              Lượt tiếp theo: {new Date(nextReviewAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </section>

      <hr className="border-2 border-[#F0F0F0] rounded-full" />

      {/* Duration */}
      <section>
        <h3 className="text-[13px] font-black text-[#AFAFAF] uppercase tracking-wider mb-4">
          Thời gian
        </h3>
        <div className="flex items-center justify-between text-[#4B4B4B]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FF9600] flex items-center justify-center text-white border-b-[4px] border-[#D87A00]">
              <AccessTimeIcon fontSize="small" />
            </div>
            <span className="font-bold text-[15px]">Đã học</span>
          </div>
          <span className="font-mono font-black text-2xl text-[#4B4B4B]">
            {formatDuration(sessionDuration)}
          </span>
        </div>
      </section>

    </div>
  );
}
