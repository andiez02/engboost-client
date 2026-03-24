import { useState } from 'react';
import HeaderUser from '../../../components/Layout/HeaderUser';
import Sidebar from '../../../components/Layout/SideBar';
import FlashcardTab from './FlashcardTab/FlashcardTab';
import card from '../../../assets/lotties/card.json';
import Lottie from 'lottie-react';

function Flashcard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        }`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="mt-[60px] px-8 py-8">
          <FlashcardTab
            headerSlot={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                  <Lottie animationData={card} loop className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none uppercase">
                    Flashcard
                  </h1>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                    Quản lý và học từ vựng của bạn
                  </p>
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
