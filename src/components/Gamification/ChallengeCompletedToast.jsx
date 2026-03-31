import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCompletedChallenge } from '../../redux/study/studySlice';

export default function ChallengeCompletedToast() {
  const dispatch = useDispatch();
  const completedChallenges = useSelector((state) => state.study.completedChallenges);

  useEffect(() => {
    if (completedChallenges && completedChallenges.length > 0) {
      completedChallenges.forEach((challenge) => {
        // Render a toast for each completed challenge
        toast(
          <div className="flex items-center gap-3">
            <div className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
              {challenge.icon || '🎯'}
            </div>
            <div className="flex flex-col">
              <span style={{ fontWeight: 900, fontSize: '0.75rem', color: '#58CC02', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Thử Thách Hoàn Thành
              </span>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#4B4B4B' }}>
                {challenge.title}
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FF9600', marginTop: '2px' }}>
                +{challenge.rewardXp} XP
              </span>
            </div>
          </div>,
          {
            position: 'top-right', // Typically achievements / challenges look better top-right
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              borderRadius: '16px',
              border: '2px solid #58CC02',
              borderBottom: '4px solid #58CC02',
              padding: '12px 16px',
              backgroundColor: '#fff',
            },
          }
        );

        // Clear it right after so it doesn't trigger again
        dispatch(clearCompletedChallenge(challenge.id));
      });
    }
  }, [completedChallenges, dispatch]);

  return null;
}
