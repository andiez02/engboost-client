import { useEffect, useState, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import { FolderOpen, Plus, Check, Users } from 'lucide-react';
import { exploreService } from '../../../../../services/explore/explore.service';
import { useDispatch } from 'react-redux';
import { fetchFolders } from '../../../../../redux/folder/folderSlice';
import { toast } from 'react-toastify';
import { gamify as t } from '../../../../../theme';

function FolderCard({ folder, onClone, cloningId }) {
  const isCloning = cloningId === folder.id;
  const isCloned = folder.is_cloned ?? false;
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
      padding: '16px', display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.borderBottomColor = t.blueDark; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = t.gray; e.currentTarget.style.borderBottomColor = t.grayDark; e.currentTarget.style.transform = ''; }}
    >
      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: t.blueBg, border: `2px solid ${t.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FolderOpen size={20} color={t.blue} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 900, fontSize: '0.92rem', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {folder.title}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: t.sub }}>
            {folder.flashcard_count ?? 0} từ vựng
          </div>
        </div>
      </div>

      {/* Action button */}
      {isCloned ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '9px', borderRadius: 10,
          background: t.greenBg, border: `2px solid ${t.green}`,
          color: t.green, fontWeight: 900, fontSize: '0.78rem',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <Check size={14} /> Đã thêm
        </div>
      ) : (
        <button
          onClick={() => onClone(folder.id)}
          disabled={isCloning}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px', borderRadius: 10, border: 'none',
            background: t.green, borderBottom: `4px solid ${t.greenDark}`,
            color: '#fff', fontWeight: 900, fontSize: '0.78rem',
            letterSpacing: '0.04em', textTransform: 'uppercase',
            fontFamily: 'inherit', cursor: isCloning ? 'not-allowed' : 'pointer',
            opacity: isCloning ? 0.7 : 1, transition: 'all 0.1s',
          }}
          onMouseDown={e => { if (!isCloning) { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; } }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
        >
          {isCloning
            ? <><CircularProgress size={13} sx={{ color: '#fff' }} /> Đang thêm...</>
            : <><Plus size={14} /> Thêm vào folder</>
          }
        </button>
      )}
    </div>
  );
}

export default function CommunityFolders() {
  const dispatch = useDispatch();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cloningId, setCloningId] = useState(null);

  useEffect(() => {
    exploreService.getCommunityFolders()
      .then(res => setFolders(res.data ?? []))
      .catch(() => setError('Không thể tải danh sách folder.'))
      .finally(() => setLoading(false));
  }, []);

  const handleClone = useCallback(async (folderId) => {
    setCloningId(folderId);
    try {
      await exploreService.cloneCommunityFolder(folderId);
      // Mark as cloned in local state immediately
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, is_cloned: true } : f));
      toast.success('Đã thêm vào folder của bạn! 🎉');
      dispatch(fetchFolders());
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thêm folder thất bại.');
    } finally {
      setCloningId(null);
    }
  }, [dispatch]);

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Header */}
        <div style={{
          borderRadius: 20, border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
          background: '#fff', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Users size={14} color={t.green} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.green }}>
                COMMUNITY FOLDERS
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: t.text, lineHeight: 1.2 }}>
              Bộ từ vựng cộng đồng
            </div>
            <div style={{ marginTop: 4, fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>
              Thêm bất kỳ folder nào vào bộ sưu tập của bạn — miễn phí, không yêu cầu cấp độ.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: t.greenBg, border: `2px solid ${t.green}`, borderBottom: `4px solid ${t.greenDark}` }}>
            <Check size={14} color={t.green} />
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: t.green }}>Miễn phí cho tất cả</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <CircularProgress sx={{ color: t.blue }} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ borderRadius: 16, padding: '16px 20px', border: `2px solid ${t.red}`, borderBottom: `4px solid ${t.redDark}`, background: t.redBg, color: t.red, fontSize: '0.88rem', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && folders.length === 0 && (
          <div style={{ borderRadius: 20, border: `2px dashed ${t.gray}`, background: '#FAFAFA', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 16px', width: 72, height: 72, borderRadius: 20, background: '#fff', border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📁</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: t.text }}>Chưa có folder nào</div>
            <div style={{ marginTop: 6, fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>Quay lại sau nhé!</div>
          </div>
        )}

        {/* Grid */}
        {!loading && folders.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} onClone={handleClone} cloningId={cloningId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
