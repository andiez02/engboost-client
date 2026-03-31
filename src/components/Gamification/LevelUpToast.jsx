import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearLevelUp } from '../../redux/study/studySlice';

export default function LevelUpToast() {
  const dispatch = useDispatch();
  const leveledUp = useSelector((state) => state.study.leveledUp);
  const newLevel = useSelector((state) => state.study.newLevel);

  useEffect(() => {
    if (leveledUp && newLevel) {
      toast(
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">🎉</div>
          <div className="flex flex-col">
            <span style={{ fontWeight: 900, fontSize: '0.75rem', color: '#FF9600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Level Up!
            </span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#4B4B4B' }}>
              Bạn đã đạt Level {newLevel} 🚀
            </span>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            borderRadius: '16px',
            border: '2px solid #FFC800',
            borderBottom: '4px solid #FFC800',
            padding: '12px 16px',
            backgroundColor: '#fff',
          },
        }
      );

      dispatch(clearLevelUp());
    }
  }, [leveledUp, newLevel, dispatch]);

  return null;
}
