import { useState, useRef } from 'react';
import { Dialog, CircularProgress } from '@mui/material';
import { X, Plus, Image } from 'lucide-react';

const ACCENT = '#6366F1';
const ACCENT_BG = '#EEF2FF';
const POS_OPTIONS = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'idiom', 'other'];
const EMPTY = () => ({ english: '', vietnamese: '', pos: '', definition: '', example: '', imageUrl: null });

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 8,
  border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontWeight: 600,
  color: '#111827', fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s', background: '#fff',
};

const labelStyle = {
  display: 'block', marginBottom: 4,
  fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '0.07em', color: '#9CA3AF',
};

export default function AddFlashcardModal({ open, onClose, onAdd, loading }) {
  const [form, setForm] = useState(EMPTY());
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.english.trim() && form.vietnamese.trim() && form.pos;

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => update('imageUrl', reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!isValid) { setError('Cần điền Từ tiếng Anh, Nghĩa tiếng Việt và Loại từ.'); return; }
    setError('');
    const ok = await onAdd(form);
    if (ok) {
      setForm(EMPTY());
      onClose();
    }
  };

  const handleClose = () => { if (!loading) { setForm(EMPTY()); setError(''); onClose(); } };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 4, border: '1.5px solid #E5E7EB', boxShadow: '0 24px 64px rgba(0,0,0,0.12)', p: 0, overflow: 'hidden' } }}>

      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1.5px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Plus size={16} color={ACCENT} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>Thêm Flashcard</div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Điền thông tin từ vựng</div>
        </div>
        <button onClick={handleClose} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={13} color="#6B7280" />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* english + pos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8 }}>
          <div>
            <label style={labelStyle}>Từ tiếng Anh *</label>
            <input value={form.english} onChange={e => update('english', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Resilience" style={inputStyle}
              onFocus={e => e.target.style.borderColor = ACCENT}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
          </div>
          <div>
            <label style={labelStyle}>Loại từ *</label>
            <select value={form.pos} onChange={e => update('pos', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer', padding: '8px 6px' }}>
              <option value="">--</option>
              {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* vietnamese */}
        <div>
          <label style={labelStyle}>Nghĩa tiếng Việt *</label>
          <input value={form.vietnamese} onChange={e => update('vietnamese', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Sự kiên cường" style={inputStyle}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
        </div>

        {/* definition */}
        <div>
          <label style={labelStyle}>Định nghĩa <span style={{ fontWeight: 500, textTransform: 'none' }}>(tùy chọn)</span></label>
          <input value={form.definition} onChange={e => update('definition', e.target.value)}
            placeholder="e.g. The ability to recover quickly..." style={inputStyle}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
        </div>

        {/* example */}
        <div>
          <label style={labelStyle}>Ví dụ <span style={{ fontWeight: 500, textTransform: 'none' }}>(tùy chọn)</span></label>
          <input value={form.example} onChange={e => update('example', e.target.value)}
            placeholder="e.g. She showed great resilience..."
            style={{ ...inputStyle, fontStyle: 'italic' }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
        </div>

        {/* image */}
        <div>
          <label style={labelStyle}>Ảnh <span style={{ fontWeight: 500, textTransform: 'none' }}>(tùy chọn)</span></label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => handleImageFile(e.target.files?.[0])} />
          {form.imageUrl ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={form.imageUrl} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1.5px solid #E5E7EB', display: 'block' }} />
              <button onClick={() => update('imageUrl', null)} style={{
                position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
                background: '#EF4444', border: '2px solid #fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', padding: 0,
              }}>
                <X size={10} color="#fff" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = ACCENT_BG; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; }}
              onDrop={e => { e.preventDefault(); handleImageFile(e.dataTransfer.files?.[0]); e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; }}
              style={{ height: 68, borderRadius: 10, border: '1.5px dashed #D1D5DB', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = ACCENT_BG; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB'; }}
            >
              <Image size={16} color="#9CA3AF" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF' }}>Kéo thả hoặc click để thêm ảnh</span>
            </div>
          )}
        </div>

        {/* error */}
        {error && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEF2F2', border: '1.5px solid #FECACA', fontSize: '0.78rem', fontWeight: 700, color: '#DC2626' }}>
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '0 20px 18px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={handleClose} disabled={loading}
          style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
          Hủy
        </button>
        <button onClick={handleSubmit} disabled={!isValid || loading}
          style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: isValid && !loading ? ACCENT : '#E5E7EB', fontSize: '0.82rem', fontWeight: 700, color: isValid && !loading ? '#fff' : '#9CA3AF', cursor: isValid && !loading ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
          {loading && <CircularProgress size={13} sx={{ color: '#fff' }} />}
          <Plus size={14} />
          Thêm flashcard
        </button>
      </div>
    </Dialog>
  );
}
