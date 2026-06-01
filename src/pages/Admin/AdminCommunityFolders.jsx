import { useState, useEffect, useCallback } from 'react';
import { CircularProgress, Dialog, Drawer } from '@mui/material';
import { Users, Plus, Pencil, Trash2, Eye, X, AlertTriangle, BookOpen } from 'lucide-react';
import { adminFolderService } from '../../services/adminFolder/adminFolder.service';
import { toast } from 'react-toastify';
import AddFlashcardModal from './AddFlashcardModal';

const ACCENT = '#10B981';
const ACCENT_BG = '#ECFDF5';
const EMPTY_FORM = { title: '', is_public: false };

export default function AdminCommunityFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [drawerFolder, setDrawerFolder] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [addFcModalOpen, setAddFcModalOpen] = useState(false);
  const [addingFc, setAddingFc] = useState(false);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFolderService.listCommunityFolders();
      setFolders(res.data ?? []);
    } catch { toast.error('Failed to load folders.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFolders(); }, [fetchFolders]);

  const openDrawer = async (folder) => {
    setDrawerFolder(folder);
    setFlashcards([]);
    setFlashcardsLoading(true);
    try {
      const res = await adminFolderService.getCommunityFolderFlashcards(folder.id);
      setFlashcards(res.data ?? []);
    } catch { toast.error('Failed to load flashcards.'); }
    finally { setFlashcardsLoading(false); }
  };

  const closeDrawer = () => { setDrawerFolder(null); setFlashcards([]); };

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (folder) => { setEditTarget(folder); setForm({ title: folder.title, is_public: folder.is_public ?? false }); setDialogOpen(true); };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      if (editTarget) {
        await adminFolderService.updateCommunityFolder(editTarget.id, { title: form.title.trim(), is_public: form.is_public });
        toast.success('Folder updated.');
      } else {
        await adminFolderService.createCommunityFolder({ title: form.title.trim(), is_public: form.is_public });
        toast.success('Folder created.');
      }
      setDialogOpen(false);
      fetchFolders();
    } catch { toast.error('Operation failed.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await adminFolderService.deleteCommunityFolder(deleteTarget.id);
      toast.success('Folder deleted.');
      setDeleteTarget(null);
      if (drawerFolder?.id === deleteTarget.id) closeDrawer();
      fetchFolders();
    } catch { toast.error('Delete failed.'); }
    finally { setSubmitting(false); }
  };

  const handleAddFlashcard = async (formData) => {
    if (!drawerFolder) return false;
    setAddingFc(true);
    try {
      const res = await adminFolderService.addCommunityFlashcard(drawerFolder.id, formData);
      setFlashcards(prev => [...prev, res.data]);
      setFolders(prev => prev.map(f => f.id === drawerFolder.id ? { ...f, flashcard_count: (f.flashcard_count ?? 0) + 1 } : f));
      setDrawerFolder(prev => ({ ...prev, flashcard_count: (prev.flashcard_count ?? 0) + 1 }));
      toast.success('Đã thêm flashcard.');
      return true;
    } catch { toast.error('Thêm flashcard thất bại.'); return false; }
    finally { setAddingFc(false); }
  };

  const handleDeleteFlashcard = async (fcId) => {
    try {
      await adminFolderService.deleteCommunityFlashcard(drawerFolder.id, fcId);
      setFlashcards(prev => prev.filter(fc => fc.id !== fcId));
      setFolders(prev => prev.map(f => f.id === drawerFolder.id ? { ...f, flashcard_count: Math.max(0, (f.flashcard_count ?? 1) - 1) } : f));
      setDrawerFolder(prev => ({ ...prev, flashcard_count: Math.max(0, (prev.flashcard_count ?? 1) - 1) }));
    } catch { toast.error('Xóa flashcard thất bại.'); }
  };

  return (
    <div style={{ padding: 32, background: '#F8F9FA', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color={ACCENT} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Community Folders</h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>
            Folder công khai cho tất cả user — không yêu cầu cấp độ
          </p>
        </div>
        <button onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, cursor: 'pointer', border: 'none', background: ACCENT, fontSize: '0.82rem', fontWeight: 700, color: '#fff', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <Plus size={15} /> Tạo folder
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #F3F4F6' }}>
              {['Tên folder', 'Số thẻ', 'Trạng thái', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Số thẻ' || h === 'Trạng thái' ? 'center' : 'left', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '48px 0', textAlign: 'center' }}><CircularProgress size={24} sx={{ color: ACCENT }} /></td></tr>
            ) : folders.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600 }}>Chưa có folder nào.</td></tr>
            ) : folders.map((folder, i) => {
              const isActive = drawerFolder?.id === folder.id;
              return (
                <tr key={folder.id}
                  style={{ borderBottom: i < folders.length - 1 ? '1px solid #F9FAFB' : 'none', background: isActive ? ACCENT_BG : '#fff', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => openDrawer(folder)}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#FAFAFA'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#fff'; }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={14} color={ACCENT} />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>{folder.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>{folder.flashcard_count ?? 0}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span
                      onClick={async (e) => {
                        e.stopPropagation();
                        const newVal = !folder.is_public;
                        setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, is_public: newVal } : f));
                        if (drawerFolder?.id === folder.id) setDrawerFolder(prev => ({ ...prev, is_public: newVal }));
                        try { await adminFolderService.updateCommunityFolder(folder.id, { is_public: newVal }); }
                        catch { setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, is_public: !newVal } : f)); }
                      }}
                      title="Click để đổi trạng thái"
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                        background: folder.is_public ? '#ECFDF5' : '#F3F4F6',
                        color: folder.is_public ? '#059669' : '#6B7280',
                        border: `1.5px solid ${folder.is_public ? '#A7F3D0' : '#E5E7EB'}`,
                      }}>
                      {folder.is_public ? '🟢 Public' : '⚫ Private'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      {[
                        { icon: <Eye size={13} color="#6366F1" />, action: () => openDrawer(folder), hb: '#6366F1', hbg: '#EEF2FF' },
                        { icon: <Pencil size={13} color="#0EA5E9" />, action: () => openEdit(folder), hb: '#0EA5E9', hbg: '#F0F9FF' },
                        { icon: <Trash2 size={13} color="#EF4444" />, action: () => setDeleteTarget(folder), hb: '#EF4444', hbg: '#FEF2F2' },
                      ].map((btn, bi) => (
                        <button key={bi} onClick={btn.action}
                          style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = btn.hb; e.currentTarget.style.background = btn.hbg; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
                        >{btn.icon}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <Drawer anchor="right" open={!!drawerFolder} onClose={closeDrawer}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 0, background: '#F8F9FA' } }}>
        {drawerFolder && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '20px 20px 16px', background: '#fff', borderBottom: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={17} color={ACCENT} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{drawerFolder.title}</div>
                <span style={{ padding: '1px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, background: ACCENT_BG, color: ACCENT, border: `1.5px solid #A7F3D0` }}>
                  {drawerFolder.flashcard_count ?? 0} thẻ · Free for all
                </span>
              </div>
              <button onClick={closeDrawer} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} color="#6B7280" />
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => setAddFcModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 10, border: `1.5px dashed ${ACCENT}`, background: ACCENT_BG, color: ACCENT, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Plus size={14} /> Thêm flashcard
              </button>

              {flashcardsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><CircularProgress size={24} sx={{ color: ACCENT }} /></div>
              ) : flashcards.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Chưa có flashcard nào.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {flashcards.map((fc, idx) => (
                    <div key={fc.id} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E5E7EB', padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#D1D5DB', minWidth: 18, paddingTop: 2 }}>{idx + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>{fc.english}</span>
                          {fc.pos && <span style={{ fontSize: '0.68rem', fontWeight: 700, color: ACCENT, background: ACCENT_BG, padding: '1px 7px', borderRadius: 999 }}>{fc.pos}</span>}
                        </div>
                        {fc.vietnamese && <div style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600, marginTop: 2 }}>{fc.vietnamese}</div>}
                        {fc.definition && <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2, fontStyle: 'italic' }}>{fc.definition}</div>}
                        {fc.example && <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>"{fc.example}"</div>}
                      </div>
                      <button onClick={() => handleDeleteFlashcard(fc.id)}
                        style={{ width: 26, height: 26, borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}>
                        <Trash2 size={11} color="#EF4444" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1.5px solid #E5E7EB', display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(drawerFolder)}
                style={{ flex: 1, padding: '9px', borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: ACCENT_BG, color: ACCENT, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Pencil size={13} /> Chỉnh sửa
              </button>
              <button onClick={() => setDeleteTarget(drawerFolder)}
                style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#EF4444', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Trash2 size={13} /> Xóa
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => !submitting && setDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1.5px solid #E5E7EB', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', p: 0 } }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid #F3F4F6' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>{editTarget ? 'Chỉnh sửa folder' : 'Tạo Community Folder'}</div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 6, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Tên folder</div>
          <input autoFocus value={form.title} onChange={e => setForm({ title: e.target.value })} maxLength={30}
            placeholder="VD: Travel Vocabulary..."
            style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.88rem', fontWeight: 600, color: '#111827', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <div style={{ marginTop: 4, fontSize: '0.7rem', color: '#9CA3AF', textAlign: 'right' }}>{form.title.length}/30</div>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Trạng thái</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ val: true, label: '🟢 Public', desc: 'User có thể thấy' }, { val: false, label: '⚫ Private', desc: 'Chỉ admin thấy' }].map(({ val, label, desc }) => (
                <button key={String(val)} onClick={() => setForm(f => ({ ...f, is_public: val }))}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s',
                    border: `1.5px solid ${form.is_public === val ? (val ? '#059669' : '#6366F1') : '#E5E7EB'}`,
                    background: form.is_public === val ? (val ? '#ECFDF5' : '#EEF2FF') : '#fff',
                    color: form.is_public === val ? (val ? '#059669' : '#6366F1') : '#6B7280',
                  }}>
                  {label}<div style={{ fontSize: '0.68rem', fontWeight: 500, marginTop: 2 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setDialogOpen(false)} disabled={submitting}
            style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          <button onClick={handleSubmit} disabled={submitting || !form.title.trim()}
            style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: form.title.trim() && !submitting ? ACCENT : '#E5E7EB', fontSize: '0.82rem', fontWeight: 700, color: form.title.trim() && !submitting ? '#fff' : '#9CA3AF', cursor: form.title.trim() && !submitting ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            {submitting && <CircularProgress size={13} sx={{ color: '#fff' }} />}
            {editTarget ? 'Lưu' : 'Tạo folder'}
          </button>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => !submitting && setDeleteTarget(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1.5px solid #E5E7EB', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', p: 0 } }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Xác nhận xóa</div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
            Folder <strong>"{deleteTarget?.title}"</strong> và tất cả flashcard sẽ bị xóa vĩnh viễn.
          </p>
          <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', border: '1.5px solid #FECACA', fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
            ⚠️ Hành động này không thể hoàn tác.
          </div>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteTarget(null)} disabled={submitting}
            style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          <button onClick={handleDelete} disabled={submitting}
            style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: '#EF4444', fontSize: '0.82rem', fontWeight: 700, color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, opacity: submitting ? 0.7 : 1 }}>
            {submitting && <CircularProgress size={13} sx={{ color: '#fff' }} />}
            Xóa
          </button>
        </div>
      </Dialog>

      <AddFlashcardModal open={addFcModalOpen} onClose={() => setAddFcModalOpen(false)} onAdd={handleAddFlashcard} loading={addingFc} />
    </div>
  );
}
