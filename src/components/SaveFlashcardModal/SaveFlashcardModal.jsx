import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, FolderPlus, ChevronDown, CheckCircle, ArrowLeft } from 'lucide-react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { fetchFolders } from '../../redux/folder/folderSlice';
import { useModal } from '../../modal/ModalSystem/useModal';
import FlashcardItem from '../../pages/UserPage/Flashcard/FlashcardTab/Snaplang/components/FlashcardItem';
import { gamify as t, btn3d } from '../../theme';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => { dispatch(fetchFolders()); }, [dispatch]);

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
          : folders?.find((f) => f.id === selectedFolder || f._id === selectedFolder)?.title || '',
        onFolderUpdate,
      };
      const success = await onSave?.(folderInfo);
      if (success) closeModal(undefined, true);
    } catch {
      setError('Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedFolder, createNewFolder, newFolderName, folderNameExists, folders, onSave, closeModal, onFolderUpdate]);

  const toggleMode = () => {
    setCreateNewFolder(v => !v);
    setSelectedFolder('');
    setNewFolderName('');
    setError('');
    setFolderNameExists(false);
    setDropdownOpen(false);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.surface, fontFamily: 'inherit', position: 'relative', overflow: 'hidden' }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', background: '#fff',
        borderBottom: `2px solid ${t.gray}`,
        boxShadow: `0 2px 0 ${t.grayDark}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: t.blueBg, border: `2px solid ${t.blue}`,
            borderBottom: `3px solid ${t.blueDark}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SaveAltIcon sx={{ fontSize: 18, color: t.blue }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: t.text, lineHeight: 1.2 }}>Lưu thẻ học</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: t.sub, marginTop: 2 }}>
              {flashcards.length} flashcard
            </div>
          </div>
        </div>
        <button
          onClick={() => closeModal()}
          style={{
            width: 32, height: 32, borderRadius: 8, border: `2px solid ${t.gray}`,
            background: '#fff', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: t.sub,
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.red; e.currentTarget.style.color = t.red; e.currentTarget.style.background = t.redBg; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.gray; e.currentTarget.style.color = t.sub; e.currentTarget.style.background = '#fff'; }}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: 100, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Section label */}
        <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.sub }}>
          Chọn thư mục đích
        </div>

        {/* Folder selector card */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
          padding: '14px', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <AnimatePresence mode="wait">
            {!createNewFolder ? (
              <motion.div key="select" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ position: 'relative' }}>
                <button
                  onClick={() => !isLoadingFolders && setDropdownOpen(v => !v)}
                  disabled={isLoadingFolders || isSaving}
                  style={{
                    width: '100%', height: 42, borderRadius: 10,
                    border: `2px solid ${dropdownOpen ? t.blue : t.gray}`,
                    background: dropdownOpen ? t.blueBg : t.surface,
                    padding: '0 12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', cursor: 'pointer',
                    transition: 'all 0.1s', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Folder size={15} style={{ color: selectedFolder ? t.blue : t.sub }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: selectedFolder ? 800 : 600, color: selectedFolder ? t.text : t.sub }}>
                      {isLoadingFolders ? 'Đang tải...' : selectedFolder ? selectedFolderTitle : 'Chọn thư mục hiện có'}
                    </span>
                  </div>
                  <ChevronDown size={13} style={{ color: t.sub, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                        background: '#fff', borderRadius: 12,
                        border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        zIndex: 100, padding: 4, maxHeight: 220, overflowY: 'auto',
                        transformOrigin: 'top',
                      }}
                    >
                      {folders?.length > 0 ? folders.map((folder) => {
                        const fid = folder.id || folder._id;
                        const isSelected = selectedFolder === fid;
                        return (
                          <button
                            key={fid}
                            onClick={() => { setSelectedFolder(fid); setDropdownOpen(false); setError(''); }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                              padding: '8px 10px', borderRadius: 8, border: 'none',
                              background: isSelected ? t.blueBg : 'transparent',
                              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                              transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = t.surface; }}
                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Folder size={13} style={{ color: isSelected ? t.blue : t.sub, flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? t.blue : t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {folder.title}
                            </span>
                            {isSelected && <CheckCircle size={13} style={{ color: t.blue, flexShrink: 0 }} />}
                          </button>
                        );
                      }) : (
                        <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>
                          Không có thư mục nào
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="create" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ position: 'relative' }}>
                <FolderPlus size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.sub, pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Tên thư mục mới..."
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  disabled={isSaving}
                  autoFocus
                  style={{
                    width: '100%', height: 42, borderRadius: 10, boxSizing: 'border-box',
                    border: `2px solid ${folderNameExists ? t.red : t.gray}`,
                    background: folderNameExists ? t.redBg : t.surface,
                    paddingLeft: 38, paddingRight: 12,
                    fontSize: '0.88rem', fontWeight: 700, color: t.text,
                    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.1s',
                  }}
                  onFocus={e => { if (!folderNameExists) e.target.style.borderColor = t.blue; }}
                  onBlur={e => { if (!folderNameExists) e.target.style.borderColor = t.gray; }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ fontSize: '0.78rem', fontWeight: 700, color: t.red, overflow: 'hidden' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle mode */}
          <button
            onClick={toggleMode}
            disabled={isSaving}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', padding: '8px', borderRadius: 10, cursor: 'pointer',
              border: `2px dashed ${t.grayDark}`, background: 'transparent',
              fontSize: '0.78rem', fontWeight: 800, color: t.sub,
              fontFamily: 'inherit', transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.color = t.blue; e.currentTarget.style.background = t.blueBg; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.grayDark; e.currentTarget.style.color = t.sub; e.currentTarget.style.background = 'transparent'; }}
          >
            {createNewFolder ? <><ArrowLeft size={13} /> Quay lại danh sách</> : <><FolderPlus size={13} /> Tạo thư mục mới</>}
          </button>
        </div>

        {/* Preview toggle */}
        <button
          onClick={() => setShowPreview(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
            border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
            background: '#fff', fontFamily: 'inherit', transition: 'all 0.1s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 8,
              background: t.greenBg, border: `2px solid ${t.green}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.68rem', fontWeight: 900, color: t.greenDark,
            }}>
              {flashcards.length}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: t.text }}>thẻ đã chọn</span>
          </div>
          <ChevronDown size={13} style={{ color: t.sub, transform: showPreview ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingTop: 4 }}>
                {flashcards.map((card, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <FlashcardItem card={card} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 18px',
        background: 'rgba(247,247,247,0.92)', backdropFilter: 'blur(8px)',
        borderTop: `2px solid ${t.gray}`,
        display: 'flex', flexDirection: 'column', gap: 8, zIndex: 30,
      }}>
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          style={{
            width: '100%', height: 48, borderRadius: 14, border: 'none',
            background: isSaveDisabled ? t.gray : t.green,
            borderBottom: `4px solid ${isSaveDisabled ? t.grayDark : t.greenDark}`,
            color: '#fff', fontWeight: 900, fontSize: '0.9rem',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: isSaveDisabled ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.1s',
          }}
          onMouseDown={e => { if (!isSaveDisabled) { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; } }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
        >
          {isSaving ? (
            <>
              <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Đang lưu...
            </>
          ) : (
            <>
              <SaveAltIcon sx={{ fontSize: 18 }} />
              Lưu ngay
            </>
          )}
        </button>

        <button
          onClick={() => closeModal()}
          disabled={isSaving}
          style={{
            width: '100%', padding: '6px', background: 'none', border: 'none',
            fontSize: '0.75rem', fontWeight: 800, color: t.sub, textTransform: 'uppercase',
            letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'color 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = t.text}
          onMouseLeave={e => e.currentTarget.style.color = t.sub}
        >
          Hủy
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default React.memo(SaveFlashcardModal);
