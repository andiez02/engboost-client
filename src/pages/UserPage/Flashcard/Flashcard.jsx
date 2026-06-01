import { useState } from 'react';
import HeaderUser from '../../../components/Layout/HeaderUser';
import Sidebar from '../../../components/Layout/SideBar';
import FlashcardTab from './FlashcardTab/FlashcardTab';
import card from '../../../assets/lotties/card.json';
import Lottie from 'lottie-react';
import '../../UserPage/Leaderboard/leaderboard.css';

function Flashcard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const handleSidebarToggle = (val) => {
    setIsSidebarOpen(val);
    localStorage.setItem('sidebarOpen', String(val));
  };

  return (
    <div className="flex min-h-screen lb-root" style={{ background: '#F7F8FA' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarToggle} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-58' : 'ml-20'} p-6 lg:p-8`}>
        <HeaderUser isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleSidebarToggle} />

        <div style={{ marginTop: 72, paddingBottom: 48 }}>
          <FlashcardTab
            headerSlot={
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                  background: '#DDF4FF',
                  border: '2px solid #1CB0F6', borderBottom: '4px solid #1899D6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lottie animationData={card} loop style={{ width: 32, height: 32 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#3D3D3D', lineHeight: 1.1 }}>
                    Thẻ Từ Vựng
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#AFAFAF', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Khám Phá & Quản Lý Thẻ
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
