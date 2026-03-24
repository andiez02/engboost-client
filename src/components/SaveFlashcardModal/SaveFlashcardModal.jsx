import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  X, 
  Folder, 
  FolderPlus, 
  ChevronDown, 
  CheckCircle, 
  Save, 
  ArrowLeft,
  ChevronUp
} from 'lucide-react';
import { fetchFolders } from '../../redux/folder/folderSlice';
import { useModal } from '../../modal/ModalSystem/useModal';
import { cn } from '../../modal/ModalSystem/utils/cn';
import FlashcardItem from '../../pages/UserPage/Flashcard/FlashcardTab/Snaplang/components/FlashcardItem';

const SaveFlashcardModal = ({
  flashcards = [],
  onSave,
  initialFolderId = null,
  initialFolderTitle = null,
  onFolderUpdate = null,
}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { folders, isLoading: isLoadingFolders } = useSelector((state) => state.folders);

  const [isSaving, setIsSaving] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(initialFolderId || '');
  const [createNewFolder, setCreateNewFolder] = useState(!initialFolderId);
  const [newFolderName, setNewFolderName] = useState(initialFolderTitle || '');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [folderNameExists, setFolderNameExists] = useState(false);
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFolders());
    setError('');
  }, [dispatch]);

  useEffect(() => {
    if (createNewFolder && newFolderName.trim()) {
      const exists = (folders ?? []).some(
        (f) => f.title.toLowerCase() === newFolderName.trim().toLowerCase()
      );
      setFolderNameExists(exists);
      setError(exists ? `"${newFolderName.trim()}" đã tồn tại` : '');
    } else {
      setFolderNameExists(false);
      if (!createNewFolder) setError('');
    }
  }, [newFolderName, folders, createNewFolder]);

  const handleSave = useCallback(async () => {
    if ((!selectedFolder && !createNewFolder) || (createNewFolder && !newFolderName.trim())) {
      setError('Vui lòng chọn hoặc tạo thư mục');
      return;
    }
    if (createNewFolder && folderNameExists) return;

    setIsSaving(true);
    try {
      const folderInfo = {
        id: selectedFolder,
        isNew: createNewFolder,
        title: createNewFolder
          ? newFolderName.trim()
          : folders?.find((f) => f.id === selectedFolder || f._id === selectedFolder)?.title || 'Unknown',
        onFolderUpdate,
      };
      if (onSave) {
        const success = await onSave(folderInfo);
        if (success) closeModal(undefined, true);
      }
    } catch {
      setError('Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedFolder, createNewFolder, newFolderName, folderNameExists, folders, onSave, closeModal, onFolderUpdate]);

  const toggleMode = () => {
    setCreateNewFolder((v) => !v);
    setSelectedFolder('');
    setNewFolderName('');
    setError('');
    setFolderNameExists(false);
    setIsFolderDropdownOpen(false);
  };

  const isSaveDisabled = useMemo(() => 
    isSaving ||
    (createNewFolder && (!newFolderName.trim() || folderNameExists)) ||
    (!createNewFolder && !selectedFolder)
  , [isSaving, createNewFolder, newFolderName, folderNameExists, selectedFolder]);

  const selectedFolderTitle = useMemo(() => 
    folders?.find((f) => f.id === selectedFolder || f._id === selectedFolder)?.title
  , [folders, selectedFolder]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] font-sans relative overflow-hidden">
      
      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-7 py-5 bg-white border-b border-[#f1f3f8] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/35"
          >
            <Bookmark size={20} />
          </motion.div>
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] tracking-tight leading-tight">Lưu thẻ học</h2>
            <p className="text-[12px] font-medium text-[#94a3b8] tracking-wide mt-0.5">{flashcards.length} flashcard mới</p>
          </div>
        </div>
        <button 
          onClick={() => closeModal()} 
          className="w-9 h-9 rounded-full border border-[#e8eaf2] flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-all"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </header>

      {/* ── BODY ── */}
      <main className="flex-1 overflow-y-auto px-6 py-7 pb-32 flex flex-col gap-3">
        
        {/* Step 1 */}
        <div className="flex items-center gap-2.5 mb-1 mt-2">
          <span className="w-5.5 h-5.5 rounded-full bg-[#6366f1] text-white text-[11px] font-bold flex items-center justify-center">1</span>
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Chọn thư mục đích</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#f0f1f8] shadow-sm flex flex-col gap-3.5 mb-2">
          <AnimatePresence mode="wait">
            {!createNewFolder ? (
              <motion.div 
                key="select" 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -6 }}
                className="relative"
              >
                <button
                  onClick={() => !isLoadingFolders && setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                  disabled={isLoadingFolders || isSaving}
                  className={cn(
                    "w-full h-[52px] rounded-[14px] border-[1.5px] border-[#e8eaf2] bg-[#fafbfe] px-4 flex items-center justify-between transition-all outline-none",
                    isFolderDropdownOpen && "border-[#6366f1] bg-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder size={16} className={selectedFolder ? "text-[#6366f1]" : "text-[#94a3b8]"} />
                    <span className={cn(
                      "text-[14px] font-medium",
                      selectedFolder ? "text-[#0f172a] font-semibold" : "text-[#94a3b8]"
                    )}>
                      {isLoadingFolders ? 'Đang tải...' : selectedFolder ? selectedFolderTitle : 'Chọn thư mục hiện có'}
                    </span>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={cn("text-[#94a3b8] transition-transform duration-200", isFolderDropdownOpen && "rotate-180")} 
                  />
                </button>

                <AnimatePresence>
                  {isFolderDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#e8eaf2] shadow-xl z-[100] p-1.5 overflow-auto max-h-[240px] origin-top"
                    >
                      {folders?.length > 0 ? (
                        folders.map((folder) => {
                          const folderId = folder.id || folder._id;
                          return (
                            <button
                              key={folderId}
                              onClick={() => { setSelectedFolder(folderId); setIsFolderDropdownOpen(false); setError(''); }}
                              className={cn(
                                "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-[#334155] hover:bg-slate-50 transition-colors text-left",
                                selectedFolder === folderId && "bg-[#f0f1ff] text-[#4f46e5] font-semibold"
                              )}
                            >
                              <Folder size={14} className={selectedFolder === folderId ? "text-[#6366f1]" : "text-[#94a3b8]"} />
                              <span className="flex-1 truncate">{folder.title}</span>
                              {selectedFolder === folderId && <CheckCircle size={14} className="text-[#6366f1]" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="py-3.5 px-4 text-[13px] text-[#94a3b8] text-center">Không có thư mục nào</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                key="create" 
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -6 }}
                className="relative"
              >
                <FolderPlus size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tên thư mục mới..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  disabled={isSaving}
                  autoFocus
                  className={cn(
                    "w-full h-[52px] rounded-[14px] border-[1.5px] border-[#e8eaf2] bg-[#fafbfe] pl-[44px] pr-4 text-[15px] font-semibold text-[#0f172a] outline-none transition-all focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10",
                    folderNameExists && "border-red-400 bg-red-50/30"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[12px] font-semibold text-red-500 flex items-center gap-1.5 overflow-hidden"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Toggle Action */}
          <button 
            onClick={toggleMode} 
            disabled={isSaving}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-[1.5px] border-dashed border-[#dde0f0] bg-transparent text-[#6366f1] text-[12px] font-bold tracking-wide hover:bg-[#f5f3ff] hover:border-[#a5b4fc] transition-all"
          >
            {createNewFolder ? (
              <>
                <ArrowLeft size={14} />
                Quay lại danh sách
              </>
            ) : (
              <>
                <FolderPlus size={14} />
                Tạo thư mục mới
              </>
            )}
          </button>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-2.5 mb-1 mt-2">
          <span className="w-5.5 h-5.5 rounded-full bg-[#6366f1] text-white text-[11px] font-bold flex items-center justify-center">2</span>
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Xem trước nội dung</span>
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-2xl border border-[#f0f1f8] bg-white shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#ecfdf5] text-[#059669] text-[11px] font-extrabold flex items-center justify-center">
              {flashcards.length}
            </span>
            <span className="text-[13px] font-semibold text-[#334155]">thẻ đã chọn</span>
          </div>
          <ChevronDown
            size={14}
            className={cn("text-[#94a3b8] transition-transform duration-300", showPreview && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 pt-2 max-h-[360px] overflow-y-auto pr-0.5">
                {flashcards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <FlashcardItem card={card} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* ── FOOTER ── */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 px-6 pb-5 bg-white/85 backdrop-blur-md border-t border-[#f0f1f8] flex flex-col gap-2.5 z-30">
        <motion.button
          disabled={isSaveDisabled}
          onClick={handleSave}
          whileHover={!isSaveDisabled ? { y: -2, boxShadow: '0 12px 32px rgba(99,102,241,0.45)' } : {}}
          whileTap={!isSaveDisabled ? { scale: 0.98 } : {}}
          className={cn(
            "w-full h-[52px] rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold text-white shadow-lg transition-all",
            isSaveDisabled 
              ? "bg-[#e8eaf2] text-[#94a3b8] shadow-none cursor-not-allowed" 
              : "bg-gradient-to-br from-[#4f46e5] to-[#6366f1] shadow-[#6366f1]/40"
          )}
        >
          {isSaving ? (
            <div className="flex items-center gap-2.5">
              <span className="w-4.5 h-4.5 rounded-full border-[2.5px] border-white/30 border-t-white animate-spin" />
              Đang lưu...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={16} strokeWidth={2.5} />
              Lưu ngay
            </div>
          )}
        </motion.button>

        <button 
          onClick={() => closeModal()} 
          disabled={isSaving}
          className="w-full py-1.5 text-[12px] font-bold text-[#94a3b8] uppercase tracking-widest hover:text-[#475569] transition-colors"
        >
          Hủy
        </button>
      </footer>
    </div>
  );
};

export default React.memo(SaveFlashcardModal);