export default function EmptyState() {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '48px 24px',
      border: '2px solid #F0F0F0', borderBottom: '4px solid #E0E0E0',
      textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: '#EDE9FE', border: '2px solid #DDD6FE', borderBottom: '4px solid #C4B5FD',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem',
      }}>
        😴
      </div>
      <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#3D3D3D' }}>
        Không có thử thách hôm nay
      </div>
      <div style={{ fontSize: '0.83rem', fontWeight: 500, color: '#AFAFAF', maxWidth: 260, lineHeight: 1.5 }}>
        Hãy quay lại vào ngày mai để nhận thử thách mới nhé!
      </div>
    </div>
  );
}
