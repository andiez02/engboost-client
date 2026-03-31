import { useState } from 'react';
import HeaderUser from '../../../components/Layout/HeaderUser';
import Sidebar from '../../../components/Layout/SideBar';
import FlashcardTab from './FlashcardTab/FlashcardTab';
import card from '../../../assets/lotties/card.json';
import Lottie from 'lottie-react';

function Flashcard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? 'ml-58' : 'ml-20'
        }`}
      >
        <HeaderUser
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="mt-[60px] px-6 py-8 md:px-8">
          <FlashcardTab
            headerSlot={
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6] border-b-[4px] flex items-center justify-center shrink-0">
                  <Lottie animationData={card} loop className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#4B4B4B] tracking-tight leading-none uppercase">
                    Thẻ Từ Vựng
                  </h1>
                  <p className="text-[13px] text-[#AFAFAF] font-bold mt-1.5 uppercase tracking-wider">
                    Khám Phá & Quản Lý Thẻ
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
