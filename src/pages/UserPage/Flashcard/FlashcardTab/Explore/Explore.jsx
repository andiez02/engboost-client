import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { fetchExploreFolders, cloneExploreFolder } from '../../../../../redux/explore/exploreSlice';
import { fetchFolders } from '../../../../../redux/folder/folderSlice';
import { selectCurrentUser } from '../../../../../redux/user/userSlice';
import ExploreFolderCard from './ExploreFolderCard';
import { gamify as t } from '../../../../../theme';
import { toast } from 'react-toastify';

export default function Explore() {
  const dispatch = useDispatch();
  const { folders, loading, error, cloningId } = useSelector((state) => state.explore);
  const currentUser = useSelector(selectCurrentUser);
  const statsLevel = useSelector((state) => state.study.stats?.level);
  const userLevel = Number(statsLevel ?? currentUser?.user?.level ?? 1);

  useEffect(() => {
    dispatch(fetchExploreFolders());
  }, [dispatch]);

  const handleClone = async (folderId) => {
    const result = await dispatch(cloneExploreFolder(folderId));
    if (cloneExploreFolder.fulfilled.match(result)) {
      toast.success('Added to your folders! 🎉');
      dispatch(fetchFolders());
    }
  };

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Header ── */}
        <div style={{
          borderRadius: 20, border: `2px solid ${t.gray}`,
          borderBottom: `4px solid ${t.grayDark}`,
          background: '#fff', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <LockOpenIcon sx={{ color: t.blue, fontSize: 16 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.blue }}>
                EXPLORE FOLDERS
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: t.text, lineHeight: 1.2 }}>
              Unlock &amp; Learn
            </div>
            <div style={{ marginTop: 4, fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>
              Level up để mở khóa thêm bộ từ vựng mới.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: t.sub }}>Level của bạn</span>
            <div style={{
              borderRadius: 16, padding: '8px 16px',
              border: `2px solid ${t.blue}`, borderBottom: `4px solid ${t.blueDark}`,
              backgroundColor: t.blueBg,
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: t.blue }}>
                Level {userLevel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <CircularProgress sx={{ color: t.blue }} />
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{
            borderRadius: 16, padding: '16px 20px',
            border: `2px solid ${t.red}`, borderBottom: `4px solid ${t.redDark}`,
            background: t.redBg, color: t.red,
            fontSize: '0.88rem', fontWeight: 700,
          }}>
            {typeof error === 'string' ? error : 'Không thể tải danh sách. Vui lòng thử lại.'}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && folders.length === 0 && (
          <div style={{
            borderRadius: 20, border: `2px dashed ${t.gray}`,
            background: '#FAFAFA', padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{
              margin: '0 auto 16px', width: 72, height: 72,
              borderRadius: 20, background: '#fff',
              border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LockOpenIcon sx={{ fontSize: 32, color: t.sub }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: t.text }}>Chưa có folder nào</div>
            <div style={{ marginTop: 6, fontSize: '0.82rem', fontWeight: 700, color: t.sub }}>Quay lại sau nhé!</div>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && folders.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {folders.map((folder) => (
              <ExploreFolderCard
                key={folder.id}
                folder={folder}
                userLevel={userLevel}
                isCloning={cloningId === folder.id}
                isCloned={folder.is_cloned ?? false}
                onClone={handleClone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
