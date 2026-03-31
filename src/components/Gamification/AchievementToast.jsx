import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearUnlockedAchievement } from '../../redux/study/studySlice';

export default function AchievementToast() {
  const dispatch = useDispatch();
  const unlockedAchievements = useSelector((state) => state.study.unlockedAchievements) || [];

  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      unlockedAchievements.forEach((achievement) => {
        // Fire toast manually to look like an achievement popup
        toast(
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">{achievement.icon || '🏆'}</div>
            <div className="flex flex-col">
              <span className="font-black text-xs text-[#FF9600] uppercase tracking-wider">
                Thành tựu mới!
              </span>
              <span className="font-bold text-[#4B4B4B] text-base">
                {achievement.title}
              </span>
              <span className="font-semibold text-[#AFAFAF] text-xs leading-none mt-0.5">
                {achievement.description}
              </span>
            </div>
          </div>,
          {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              borderRadius: '16px',
              border: '2px solid #E5E5E5',
              borderBottom: '4px solid #E5E5E5',
              padding: '12px 16px',
            }
          }
        );

        // Remove from queue so it's not repeatedly shown
        dispatch(clearUnlockedAchievement(achievement.id));
      });
    }
  }, [unlockedAchievements, dispatch]);

  return null; // Global invisible listener component
}
