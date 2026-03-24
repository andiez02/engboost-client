import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeToFlashcardButton() {
  const navigate = useNavigate();
  return (
    <button
      className="z-1000 cursor-pointer fixed bottom-14 right-10 flex items-center gap-3 px-6 py-4 bg-gray-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-gray-800 transition-all"
      onClick={() => navigate("/flashcard")}
    >
      <Camera className="w-7 h-7" />
      <span>Gửi ảnh, học ngay từ mới!</span>
    </button>
  );
}
