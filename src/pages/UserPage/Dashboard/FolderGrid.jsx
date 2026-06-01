import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { tokens } from '../../../theme';

export default function FolderGrid({ folders = [], isLoading }) {
  const navigate = useNavigate();
  const sorted = useMemo(() =>
    [...folders].sort((a, b) => (b.due_count ?? 0) - (a.due_count ?? 0)),
    [folders]
  );

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '18px 20px',
      border: '2px solid #F0F0F0', borderBottom: '4px solid #E0E0E0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AFAFAF', marginBottom: 4 }}>
            📚 Bộ thẻ từ vựng
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#3D3D3D' }}>Chọn bộ để học tiếp</div>
        </div>
        <button onClick={() => navigate('/flashcard/folders')} style={{
          padding: '8px 16px', borderRadius: 12, border: 'none',
          background: '#F5F5F5', color: '#AFAFAF', fontWeight: 800, fontSize: '0.78rem',
          cursor: 'pointer', fontFamily: 'inherit', borderBottom: '3px solid #E0E0E0',
        }}>
          QUẢN LÝ
        </button>
      </div>


      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[0, 1, 2].map(i => <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: '16px' }} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div style={{
          borderRadius: 16, border: '2px dashed #E0E0E0', background: '#FAFAFA',
          padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>📚</div>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#3D3D3D', marginBottom: 6 }}>Chưa có bộ thẻ nào</div>
          <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#AFAFAF', marginBottom: 16 }}>
            Tạo bộ mới và bắt đầu ghi điểm ngay hôm nay!
          </div>
          <button onClick={() => navigate('/flashcard/folders')} style={{
            padding: '11px 24px', borderRadius: 12, border: 'none',
            background: '#1CB0F6', color: '#fff', fontWeight: 900, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'inherit', borderBottom: '4px solid #1899D6',
          }}>
            TẠO BỘ ĐẦU TIÊN
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {sorted.map(folder => {
            const id    = folder._id ?? folder.id;
            const due   = folder.due_count ?? 0;
            const total = folder.flashcard_count ?? 0;
            const hot   = due > 0;
            return (
              <div key={id}
                style={{
                  borderRadius: 16, padding: '14px 16px',
                  background: hot ? '#FFFBF0' : '#FAFAFA',
                  border: `2px solid ${hot ? '#FFD580' : '#F0F0F0'}`,
                  borderBottom: `4px solid ${hot ? '#FF9600' : '#E0E0E0'}`,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#3D3D3D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {folder.title}
                  </div>
                  <span style={{
                    flexShrink: 0, fontSize: '0.62rem', fontWeight: 900,
                    background: hot ? '#FF9600' : '#E5E5E5', color: hot ? '#fff' : '#AFAFAF',
                    borderRadius: 6, padding: '2px 7px',
                  }}>
                    {hot ? 'NÓNG' : 'NHÀN'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: hot ? tokens.color.xp : '#AFAFAF' }}>🔥 {due} chờ</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#AFAFAF' }}>📦 {total} tổng</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => navigate(`/study?folderId=${id}`)}
                    disabled={total === 0}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 10, border: 'none',
                      background: hot ? '#58CC02' : '#1CB0F6', color: '#fff',
                      fontWeight: 900, fontSize: '0.8rem', fontFamily: 'inherit',
                      cursor: total === 0 ? 'not-allowed' : 'pointer', opacity: total === 0 ? 0.5 : 1,
                      borderBottom: `3px solid ${hot ? '#46A302' : '#1899D6'}`,
                    }}
                  >HỌC</button>
                  <button
                    onClick={() => navigate('/flashcard/folders')}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: 'inherit',
                      background: '#fff', color: '#AFAFAF', fontWeight: 900, fontSize: '0.8rem',
                      cursor: 'pointer', border: '1.5px solid #E0E0E0', borderBottom: '3px solid #E0E0E0',
                    }}
                  >XEM</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
