import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFolderAPI } from '../../../../../apis';
import FolderDetailModal from './FolderDetailModal/FolderDetailModal';
import CreateFolderDialog from '../../../../../components/Folder/CreateFolderDialog';
import { fetchFolders, deleteFolder, createFolder, updateFolder } from '../../../../../redux/folder/folderSlice';
import FolderItem from '../../../../../components/Folder/FolderItem';
import { gamify as t } from '../../../../../theme';
import { TagChip } from '../../../../../components/Folder/TagEditor';
import AddIcon from '@mui/icons-material/Add';

const Folders = () => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folders);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderDetailOpen, setFolderDetailOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);

  // Drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverGroup, setDragOverGroup] = useState(null);
  const dragFolderRef = useRef(null);

  // Create tag inline
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const tagInputRef = useRef(null);

  // Tags tạo thủ công chưa gán folder nào (persist trong session)
  const [manualTags, setManualTags] = useState([]);

  useEffect(() => { dispatch(fetchFolders()); }, [dispatch]);

  // Single-tag: folder has at most 1 tag
  const handleDropOnGroup = useCallback(async (targetTag) => {
    const folder = dragFolderRef.current;
    if (!folder) return;
    const folderId = folder.id || folder._id;
    const currentTag = (folder.tags ?? [])[0] ?? null;

    const newTag = targetTag === '__none__' ? null : targetTag;
    if (newTag === currentTag) { setDragOverGroup(null); return; }

    const newTags = newTag ? [newTag] : [];

    // Optimistic
    dispatch(updateFolder({ ...folder, tags: newTags }));
    setDragOverGroup(null);
    dragFolderRef.current = null;
    setDraggingId(null);
    // Nếu tag mới là manualTag, xóa khỏi danh sách (đã được dùng)
    if (newTag) setManualTags((prev) => prev.filter((t) => t !== newTag));

    try {
      await updateFolderAPI(folderId, { tags: newTags });
    } catch {
      dispatch(updateFolder(folder));
    }
  }, [dispatch]);

  const handleCreateTag = () => {
    const tag = newTagInput.trim();
    if (!tag) { setShowCreateTag(false); return; }
    // Thêm vào manualTags nếu chưa tồn tại, KHÔNG filter (không set activeTag)
    setManualTags((prev) => prev.includes(tag) ? prev : [...prev, tag]);
    setNewTagInput('');
    setShowCreateTag(false);
  };

  // Xóa tag: bỏ tag khỏi tất cả folders đang dùng tag đó + xóa khỏi manualTags
  const handleDeleteTag = useCallback(async (tag) => {
    setManualTags((prev) => prev.filter((t) => t !== tag));
    if (activeTag === tag) setActiveTag(null);
    const affected = (folders ?? []).filter((f) => (f.tags ?? [])[0] === tag);
    if (affected.length === 0) return;
    affected.forEach((f) => dispatch(updateFolder({ ...f, tags: [] })));
    try {
      await Promise.all(affected.map((f) => updateFolderAPI(f.id || f._id, { tags: [] })));
    } catch {
      dispatch(fetchFolders());
    }
  }, [folders, activeTag, dispatch]);

  const { summary, allTags, grouped } = useMemo(() => {
    const list = folders ?? [];
    const totalFolders = list.length;
    const totalCards = list.reduce((sum, f) => sum + (f.flashcard_count ?? 0), 0);

    const tagSet = new Set(manualTags);
    list.forEach((f) => (f.tags ?? []).slice(0, 1).forEach((tag) => tagSet.add(tag)));
    const allTags = [...tagSet].sort();

    const filtered = activeTag
      ? list.filter((f) => (f.tags ?? [])[0] === activeTag)
      : list;

    const groups = {};

    // Đảm bảo mọi manualTag đều có section (dù rỗng)
    manualTags.forEach((tag) => { groups[tag] = []; });

    if (activeTag) {
      groups[activeTag] = filtered;
    } else {
      filtered.forEach((f) => {
        const tag = (f.tags ?? [])[0];
        if (!tag) {
          groups['__none__'] = [...(groups['__none__'] ?? []), f];
        } else {
          groups[tag] = [...(groups[tag] ?? []), f];
        }
      });
    }

    return { summary: { totalFolders, totalCards }, allTags, grouped: groups };
  }, [folders, activeTag, manualTags]);

  const handleCreateFolder = async () => {
    if (!newFolderTitle.trim()) return;
    setCreating(true);
    try {
      await dispatch(createFolder({ title: newFolderTitle.trim() })).unwrap();
      setNewFolderTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenFolder = (folder) => {
    setSelectedFolder(folder);
    setFolderDetailOpen(true);
  };

  const handleEditFolder = async (folderId, data) => {
    try {
      const response = await updateFolderAPI(folderId, data);
      if (response?.folder || response?.data) {
        dispatch(fetchFolders());
        setSelectedFolder((prev) => ({ ...prev, ...(response.folder || response.data) }));
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await dispatch(deleteFolder(folderId)).unwrap();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const groupEntries = Object.entries(grouped);
  groupEntries.sort(([a], [b]) => {
    if (a === '__none__') return 1;
    if (b === '__none__') return -1;
    return a.localeCompare(b);
  });

  const displayGroups = groupEntries;

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Stats Header ── */}
        <div style={{
          borderRadius: 20, border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
          background: '#fff', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: '1.1rem' }}>📚</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.blue }}>BỘ SƯU TẬP</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: t.text, lineHeight: 1.2 }}>Thư mục của bạn</div>
            <div style={{ marginTop: 4, fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>Tổ chức từ vựng theo chủ đề để dễ học, dễ ôn tập.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ minWidth: 110, borderRadius: 16, padding: '12px 16px', border: `2px solid ${t.blue}`, borderBottom: `4px solid ${t.blueDark}`, backgroundColor: t.blueBg }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.blueDark }}>Thư mục</div>
              <div style={{ marginTop: 4, fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, color: t.blue }}>{summary.totalFolders}</div>
            </div>
            <div style={{ minWidth: 110, borderRadius: 16, padding: '12px 16px', border: `2px solid ${t.green}`, borderBottom: `4px solid ${t.greenDark}`, backgroundColor: t.greenBg }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.greenDark }}>Từ vựng</div>
              <div style={{ marginTop: 4, fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, color: t.green }}>{summary.totalCards}</div>
            </div>
          </div>
        </div>

        {/* ── Folder Grid ── */}
        <div style={{ borderRadius: 20, border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`, background: '#fff', padding: '20px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.text }}>Không gian học tập</div>
              <div style={{ marginTop: 4, fontSize: '0.78rem', fontWeight: 700, color: t.sub }}>Kéo thả folder vào nhãn để phân loại.</div>
            </div>

            {/* Tag filter chips + create tag */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <button
                onClick={() => setActiveTag(null)}
                style={{
                  padding: '4px 12px', borderRadius: 999, cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 800,
                  border: `2px solid ${activeTag === null ? t.blue : t.gray}`,
                  background: activeTag === null ? t.blueBg : '#fff',
                  color: activeTag === null ? t.blue : t.sub, transition: 'all 0.1s',
                }}
              >Tất cả</button>

              {allTags.map((tag) => (
                <div key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                  <button
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    style={{
                      padding: '4px 8px 4px 12px', borderRadius: '999px 0 0 999px', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 800,
                      border: `2px solid ${activeTag === tag ? t.blue : t.gray}`,
                      borderRight: 'none',
                      background: activeTag === tag ? t.blueBg : '#fff',
                      color: activeTag === tag ? t.blue : t.sub, transition: 'all 0.1s',
                    }}
                  >{tag}</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTag(tag); }}
                    title="Xóa nhãn"
                    style={{
                      padding: '4px 8px', borderRadius: '0 999px 999px 0', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 900,
                      border: `2px solid ${activeTag === tag ? t.blue : t.gray}`,
                      borderLeft: `1px solid ${activeTag === tag ? t.blue : t.gray}`,
                      background: activeTag === tag ? t.blueBg : '#fff',
                      color: activeTag === tag ? t.blue : t.sub, transition: 'all 0.1s',
                      lineHeight: 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = '#EA2B2B'; e.currentTarget.style.borderColor = '#FF4B4B'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = activeTag === tag ? t.blueBg : '#fff'; e.currentTarget.style.color = activeTag === tag ? t.blue : t.sub; e.currentTarget.style.borderColor = activeTag === tag ? t.blue : t.gray; }}
                  >×</button>
                </div>
              ))}

              {/* Create tag */}
              {showCreateTag ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    ref={tagInputRef}
                    autoFocus
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateTag(); if (e.key === 'Escape') { setShowCreateTag(false); setNewTagInput(''); } }}
                    placeholder="Tên nhãn..."
                    style={{
                      height: 28, padding: '0 10px', borderRadius: 999,
                      border: `2px solid ${t.blue}`, outline: 'none',
                      fontSize: '0.72rem', fontWeight: 800, color: t.text,
                      fontFamily: 'inherit', width: 110,
                    }}
                  />
                  <button
                    onClick={handleCreateTag}
                    style={{
                      height: 28, padding: '0 10px', borderRadius: 999, border: 'none',
                      background: t.green, color: '#fff', fontSize: '0.72rem',
                      fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >OK</button>
                  <button
                    onClick={() => { setShowCreateTag(false); setNewTagInput(''); }}
                    style={{
                      height: 28, width: 28, borderRadius: '50%', border: `2px solid ${t.gray}`,
                      background: '#fff', color: t.sub, fontSize: '0.8rem',
                      cursor: 'pointer', fontFamily: 'inherit', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >×</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreateTag(true)}
                  style={{
                    height: 28, padding: '0 10px', borderRadius: 999, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 800,
                    border: `2px dashed ${t.grayDark}`, background: '#fff',
                    color: t.sub, display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.green; e.currentTarget.style.color = t.green; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.grayDark; e.currentTarget.style.color = t.sub; }}
                >
                  <AddIcon sx={{ fontSize: 13 }} /> Tạo nhãn
                </button>
              )}
            </div>
          </div>

          {/* Create folder button */}
          <div style={{ marginBottom: displayGroups.length > 0 ? 16 : 0 }}>
            <div
              onClick={() => setOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                border: `2px dashed ${t.grayDark}`, background: t.surface, transition: 'all 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.green; e.currentTarget.style.background = '#F0FFE0'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.grayDark; e.currentTarget.style.background = t.surface; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.gray, border: `2px solid ${t.grayDark}`, fontSize: '1.1rem' }}>+</div>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', color: t.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tạo thư mục mới</span>
            </div>
          </div>

          {/* No match */}
          {displayGroups.length === 0 && (folders?.length ?? 0) > 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: t.sub, fontSize: '0.85rem', fontWeight: 700 }}>
              Không có thư mục nào khớp với nhãn này.
            </div>
          )}

          {/* Grouped sections */}
          {displayGroups.map(([groupKey, groupFolders]) => (
            <div
              key={groupKey}
              style={{ marginBottom: 24, position: 'relative' }}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverGroup(groupKey); }}
              onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverGroup(null); }}
              onDrop={e => { e.preventDefault(); e.stopPropagation(); handleDropOnGroup(groupKey); }}
            >
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                {groupKey === '__none__' ? (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Chưa phân loại</span>
                ) : (
                  <TagChip tag={groupKey} />
                )}
                <div style={{ flex: 1, height: 2, background: t.gray, borderRadius: 2 }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: t.sub }}>{groupFolders.length} thư mục</span>
              </div>

              {/* Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 8, minHeight: 52, position: 'relative', borderRadius: 12,
              }}>
                {groupFolders.map((folder) => {
                  const fid = folder.id || folder._id;
                  const isDragging = draggingId === fid;
                  return (
                    <div
                      key={fid}
                      draggable
                      onDragStart={e => {
                        dragFolderRef.current = folder;
                        setDraggingId(fid);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', fid);
                      }}
                      onDragEnd={() => { setDraggingId(null); setDragOverGroup(null); dragFolderRef.current = null; }}
                      style={{ opacity: isDragging ? 0.35 : 1, transition: 'opacity 0.15s', cursor: 'grab' }}
                    >
                      <FolderItem folder={folder} handleOpenFolder={handleOpenFolder} />
                    </div>
                  );
                })}

                {/* Drop overlay */}
                {dragOverGroup === groupKey && draggingId && (
                  <div style={{
                    position: 'absolute', inset: -6, borderRadius: 14,
                    border: `2.5px dashed ${t.blue}`,
                    background: 'rgba(28,176,246,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none', zIndex: 10,
                  }}>
                    <div style={{
                      background: t.blue, color: '#fff', borderRadius: 10,
                      padding: '6px 14px', fontSize: '0.75rem', fontWeight: 900,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(28,176,246,0.35)',
                    }}>
                      {groupKey === '__none__' ? 'Bỏ nhãn' : `Chuyển sang "${groupKey}"`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Empty State ── */}
        {folders?.length === 0 && (
          <div style={{ borderRadius: 20, border: `2px dashed ${t.gray}`, background: '#FAFAFA', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 16px', width: 72, height: 72, borderRadius: 20, background: '#fff', border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📁</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: t.text }}>Chưa có thư mục nào</div>
            <div style={{ marginTop: 6, fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>Tạo thư mục đầu tiên để bắt đầu sắp xếp flashcards.</div>
            <button
              onClick={() => setOpen(true)}
              style={{ marginTop: 20, padding: '12px 28px', borderRadius: 14, border: 'none', background: t.green, borderBottom: `4px solid ${t.greenDark}`, color: '#fff', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.1s' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; }}
              onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
            >TẠO THƯ MỤC ĐẦU TIÊN</button>
          </div>
        )}
      </div>

      <CreateFolderDialog
        open={open}
        onClose={() => setOpen(false)}
        newFolderTitle={newFolderTitle}
        setNewFolderTitle={setNewFolderTitle}
        creating={creating}
        handleCreateFolder={handleCreateFolder}
      />

      <FolderDetailModal
        open={folderDetailOpen}
        onClose={() => setFolderDetailOpen(false)}
        folder={selectedFolder}
        onEdit={handleEditFolder}
        onDelete={handleDeleteFolder}
        onFolderUpdate={() => dispatch(fetchFolders())}
      />
    </div>
  );
};

export default Folders;
