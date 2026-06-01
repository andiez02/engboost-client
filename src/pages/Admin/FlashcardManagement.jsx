import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CircularProgress, Dialog, Pagination } from '@mui/material';
import { BookMarked, Search, X, Trash2, AlertTriangle, Image, Filter } from 'lucide-react';
import { adminFolderService } from '../../services/adminFolder/adminFolder.service';
import { toast } from 'react-toastify';

const ACCENT = '#6366F1';
const ACCENT_BG = '#EEF2FF';
const SUMMARY_ITEMS = [
  { key: 'total', label: 'Tổng', color: '#111827' },
  { key: 'system', label: 'System', color: '#6366F1' },
  { key: 'user', label: 'User', color: '#059669' },
  { key: 'explore', label: 'Explore', color: '#0891B2' },
  { key: 'community', label: 'Community', color: '#D97706' },
  { key: 'private', label: 'Private', color: '#6B7280' },
  { key: 'withImage', label: 'Có ảnh', color: '#7C3AED' },
  { key: 'withoutImage', label: 'Không ảnh', color: '#9CA3AF' },
];

export default function FlashcardManagement() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [hasImage, setHasImage] = useState(true);
  const [source, setSource] = useState('ALL');
  const [folderType, setFolderType] = useState('ALL');
  const [viewMode, setViewMode] = useState('FOLDER');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [owner, setOwner] = useState('');
  const [folderName, setFolderName] = useState('');
  const [debouncedOwner, setDebouncedOwner] = useState('');
  const [debouncedFolderName, setDebouncedFolderName] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    system: 0,
    user: 0,
    explore: 0,
    community: 0,
    private: 0,
    withImage: 0,
    withoutImage: 0,
  });

  const searchRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedOwner(owner), 400);
    return () => clearTimeout(t);
  }, [owner]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFolderName(folderName), 400);
    return () => clearTimeout(t);
  }, [folderName]);

  useEffect(() => { setPage(1); }, [debouncedSearch, hasImage, source, folderType, debouncedOwner, debouncedFolderName]);

  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 24 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (hasImage) params.hasImage = 'true';
      if (source !== 'ALL') params.source = source;
      if (folderType !== 'ALL') params.folderType = folderType;
      if (debouncedOwner) params.owner = debouncedOwner;
      if (debouncedFolderName) params.folderName = debouncedFolderName;
      const res = await adminFolderService.listAllFlashcards(params);
      setFlashcards(res.flashcards ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotal(res.pagination?.total ?? 0);
      setSummary({
        total: res.summary?.total ?? 0,
        system: res.summary?.system ?? 0,
        user: res.summary?.user ?? 0,
        explore: res.summary?.explore ?? 0,
        community: res.summary?.community ?? 0,
        private: res.summary?.private ?? 0,
        withImage: res.summary?.withImage ?? 0,
        withoutImage: res.summary?.withoutImage ?? 0,
      });
    } catch {
      toast.error('Không thể tải danh sách flashcard.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, hasImage, source, folderType, debouncedOwner, debouncedFolderName]);

  useEffect(() => { fetchFlashcards(); }, [fetchFlashcards]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFolderService.deleteAnyFlashcard(deleteTarget.id);
      setFlashcards(prev => prev.filter(f => f.id !== deleteTarget.id));
      setTotal(prev => prev - 1);
      toast.success('Đã xóa flashcard.');
      setDeleteTarget(null);
    } catch {
      toast.error('Xóa thất bại.');
    } finally {
      setDeleting(false);
    }
  };

  const groupedFlashcards = useMemo(() => {
    if (viewMode === 'FLAT') return [];

    const groupMap = new Map();
    const getGroupInfo = (flashcard) => {
      if (viewMode === 'FOLDER') {
        const id = flashcard.folderContext?.id || 'unknown-folder';
        const ownerName =
          flashcard.owner?.username || flashcard.owner?.email || '—';
        return {
          key: id,
          title: flashcard.folderContext?.title || 'Folder không xác định',
          meta: `${flashcard.folderType || 'UNKNOWN'} • ${flashcard.source || 'USER'}`,
          ownerLabel: ownerName,
        };
      }
      const ownerId = flashcard.owner?.id || 'unknown-owner';
      return {
        key: ownerId,
        title: flashcard.owner?.username || flashcard.owner?.email || 'Owner không xác định',
        meta: flashcard.owner?.email || '',
        ownerLabel: null,
      };
    };

    flashcards.forEach((flashcard) => {
      const groupInfo = getGroupInfo(flashcard);
      if (!groupMap.has(groupInfo.key)) {
        groupMap.set(groupInfo.key, {
          key: groupInfo.key,
          title: groupInfo.title,
          meta: groupInfo.meta,
          ownerLabel: groupInfo.ownerLabel ?? null,
          items: [],
        });
      }
      groupMap.get(groupInfo.key).items.push(flashcard);
    });

    return Array.from(groupMap.values()).sort((a, b) => b.items.length - a.items.length);
  }, [flashcards, viewMode]);

  useEffect(() => {
    if (viewMode === 'FLAT') return;
    const nextExpanded = {};
    groupedFlashcards.forEach((group, idx) => {
      nextExpanded[group.key] = idx < 3;
    });
    setExpandedGroups(nextExpanded);
  }, [groupedFlashcards, viewMode]);

  const toggleGroupExpanded = (groupKey) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const expandAllGroups = () => {
    const nextExpanded = {};
    groupedFlashcards.forEach((group) => {
      nextExpanded[group.key] = true;
    });
    setExpandedGroups(nextExpanded);
  };

  const collapseAllGroups = () => {
    const nextExpanded = {};
    groupedFlashcards.forEach((group) => {
      nextExpanded[group.key] = false;
    });
    setExpandedGroups(nextExpanded);
  };

  return (
    <div style={{ padding: 32, background: '#F8F9FA', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookMarked size={18} color={ACCENT} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Quản lý Flashcard
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>
            {total > 0 ? `${total} flashcard` : 'Đang tải...'}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 380 }}>
          <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo từ tiếng Anh..."
            style={{ width: '100%', padding: '8px 32px 8px 32px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.85rem', fontWeight: 500, color: '#111827', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
              <X size={13} color="#9CA3AF" />
            </button>
          )}
        </div>

        {/* Has image toggle */}
        <button
          onClick={() => setHasImage(v => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700,
            border: `1.5px solid ${hasImage ? ACCENT : '#E5E7EB'}`,
            background: hasImage ? ACCENT_BG : '#fff',
            color: hasImage ? ACCENT : '#6B7280',
            transition: 'all 0.15s',
          }}
        >
          <Image size={14} />
          Có ảnh
        </button>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', padding: '0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit', outline: 'none' }}
        >
          <option value="ALL">Nguồn: tất cả</option>
          <option value="SYSTEM">Nguồn: hệ thống</option>
          <option value="USER">Nguồn: người dùng</option>
        </select>

        <select
          value={folderType}
          onChange={(e) => setFolderType(e.target.value)}
          style={{ height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', padding: '0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit', outline: 'none' }}
        >
          <option value="ALL">Folder: tất cả</option>
          <option value="EXPLORE">Explore</option>
          <option value="COMMUNITY">Community</option>
          <option value="PRIVATE">Private</option>
        </select>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          style={{ height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', padding: '0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit', outline: 'none' }}
        >
          <option value="FLAT">Hiển thị: Flat list</option>
          <option value="FOLDER">Hiển thị: Group theo folder</option>
          <option value="OWNER">Hiển thị: Group theo owner</option>
        </select>

        <input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Owner (username/email)..."
          style={{ height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', padding: '0 12px', fontSize: '0.82rem', fontWeight: 500, color: '#111827', fontFamily: 'inherit', outline: 'none', minWidth: 180 }}
        />

        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name..."
          style={{ height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', padding: '0 12px', fontSize: '0.82rem', fontWeight: 500, color: '#111827', fontFamily: 'inherit', outline: 'none', minWidth: 180 }}
        />
      </div>

      <div style={{ marginBottom: 16, display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))' }}>
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.key} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E5E7EB', padding: '10px 12px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: item.color }}>
              {Number(summary[item.key] || 0).toLocaleString('en-US')}
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
          <CircularProgress size={28} sx={{ color: ACCENT }} />
        </div>
      ) : flashcards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#9CA3AF' }}>
          <BookMarked size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Không có flashcard nào.</div>
        </div>
      ) : viewMode === 'FLAT' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
          {flashcards.map((fc) => (
            <div key={fc.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E5E7EB', overflow: 'hidden', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Image */}
              {fc.image_url ? (
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#F3F4F6' }}>
                  <img src={fc.image_url} alt={fc.english} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/3', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image size={28} color="#D1D5DB" />
                </div>
              )}

              {/* Info */}
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fc.english}
                    </div>
                    {fc.vietnamese && (
                      <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fc.vietnamese}
                      </div>
                    )}
                    {fc.pos && (
                      <span style={{ display: 'inline-block', marginTop: 4, padding: '1px 7px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: ACCENT_BG, color: ACCENT }}>
                        {fc.pos}
                      </span>
                    )}
                    <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: fc.source === 'SYSTEM' ? '#EEF2FF' : '#ECFDF5', color: fc.source === 'SYSTEM' ? '#6366F1' : '#047857' }}>
                        {fc.source === 'SYSTEM' ? 'SYSTEM' : 'USER'}
                      </span>
                      {fc.folderType && (
                        <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 999, fontSize: '0.62rem', fontWeight: 800, background: '#F3F4F6', color: '#4B5563' }}>
                          {fc.folderType}
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: 4, fontSize: '0.7rem', color: '#6B7280', lineHeight: 1.35 }}>
                      <div>Owner: {fc.owner?.username || fc.owner?.email || 'Unknown'}</div>
                      <div>Folder: {fc.folderContext?.title || 'Unknown'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(fc)}
                    style={{ width: 26, height: 26, borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
                  >
                    <Trash2 size={11} color="#EF4444" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={expandAllGroups}
              style={{
                border: '1.5px solid #E5E7EB',
                background: '#fff',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Mở tất cả
            </button>
            <button
              type="button"
              onClick={collapseAllGroups}
              style={{
                border: '1.5px solid #E5E7EB',
                background: '#fff',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#374151',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Thu gọn tất cả
            </button>
          </div>
          {groupedFlashcards.map((group) => (
            <div key={group.key} style={{ background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>{group.title}</div>
                  {group.meta && <div style={{ marginTop: 2, fontSize: '0.74rem', fontWeight: 600, color: '#9CA3AF' }}>{group.meta}</div>}
                  {group.ownerLabel && (
                    <div style={{ marginTop: 6, fontSize: '0.76rem', fontWeight: 700, color: '#059669' }}>
                      Người tạo folder: {group.ownerLabel}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: ACCENT }}>{group.items.length} cards</div>
                  <button
                    type="button"
                    onClick={() => toggleGroupExpanded(group.key)}
                    style={{
                      border: '1.5px solid #E5E7EB',
                      background: '#fff',
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#4B5563',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {expandedGroups[group.key] ? 'Thu gọn' : 'Mở rộng'}
                  </button>
                </div>
              </div>
              {expandedGroups[group.key] && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {group.items.map((fc) => (
                    <div key={fc.id} style={{ border: '1.5px solid #F3F4F6', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                      {fc.image_url ? (
                        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#F3F4F6' }}>
                          <img src={fc.image_url} alt={fc.english} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '100%', aspectRatio: '4/3', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image size={24} color="#D1D5DB" />
                        </div>
                      )}
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {fc.english}
                            </div>
                            {fc.vietnamese && (
                              <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {fc.vietnamese}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setDeleteTarget(fc)}
                            style={{ width: 24, height: 24, borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                          >
                            <Trash2 size={10} color="#EF4444" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} shape="rounded"
            sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 2 }, '& .Mui-selected': { background: `${ACCENT_BG} !important`, color: ACCENT, border: `1.5px solid #C7D2FE` } }}
          />
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1.5px solid #E5E7EB', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', p: 0 } }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Xóa flashcard</div>
        </div>
        <div style={{ padding: '16px 24px' }}>
          {deleteTarget?.image_url && (
            <img src={deleteTarget.image_url} alt="" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 12, border: '1.5px solid #E5E7EB' }} />
          )}
          <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
            Xóa flashcard <strong>"{deleteTarget?.english}"</strong>?
          </p>
          <div style={{ marginBottom: 10, fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.45 }}>
            <div><strong>Nguồn:</strong> {deleteTarget?.source || '--'}</div>
            <div><strong>Owner:</strong> {deleteTarget?.owner?.username || deleteTarget?.owner?.email || '--'}</div>
            <div><strong>Folder:</strong> {deleteTarget?.folderContext?.title || '--'}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', border: '1.5px solid #FECACA', fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
            ⚠️ Hành động này không thể hoàn tác.
          </div>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteTarget(null)} disabled={deleting}
            style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
            Hủy
          </button>
          <button onClick={handleDelete} disabled={deleting}
            style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: '#EF4444', fontSize: '0.82rem', fontWeight: 700, color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, opacity: deleting ? 0.7 : 1 }}>
            {deleting && <CircularProgress size={13} sx={{ color: '#fff' }} />}
            Xóa
          </button>
        </div>
      </Dialog>
    </div>
  );
}
