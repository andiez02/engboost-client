import { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveFlashcardsToFolderAPI } from '../../../../../../apis';
import SaveFlashcardModal from '../../../../../../components/SaveFlashcardModal/SaveFlashcardModal';
import { useModal } from '../../../../../../modal/ModalSystem/useModal';
import { gamify as t } from '../../../../../../theme';
import ResultsTray from './ResultsTray';
import AddIcon from '@mui/icons-material/Add';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';

const EMPTY_FORM = () => ({
  headword: '',
  translation: '',
  pos: '',
  definition: '',
  example: '',
  imageUrl: null,
});

const POS_OPTIONS = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'idiom', 'other'];

const fieldStyle = {
  width: '100%', padding: '8px 10px', height: 38,
  borderRadius: 8, border: `2px solid ${t.gray}`,
  fontSize: '0.88rem', fontWeight: 700, color: t.text,
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.1s', background: '#fff',
};

const labelStyle = {
  fontSize: '0.68rem', fontWeight: 800, color: t.sub,
  textTransform: 'uppercase', letterSpacing: '0.06em',
  display: 'block', marginBottom: 4,
};

export default function ManualCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useModal();
  const { folderId, folderTitle } = location.state || {};
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM());
  const [cards, setCards] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => update('imageUrl', reader.result);
    reader.readAsDataURL(file);
  };

  const isValid = form.headword.trim() && form.translation.trim() && form.pos;

  const handleAdd = () => {
    if (!isValid) {
      setError('Cần điền Từ tiếng Anh, Nghĩa tiếng Việt và Loại từ.');
      return;
    }
    setError('');
    const newCard = {
      id: Date.now() + Math.random(),
      headword: form.headword.trim(),
      english: form.headword.trim(),
      translation: form.translation.trim(),
      vietnamese: form.translation.trim(),
      pos: form.pos || null,
      imageUrl: form.imageUrl,
      image_url: form.imageUrl,
      senses: [{
        translation: form.translation.trim(),
        definition: form.definition.trim() || `${form.headword.trim()}: ${form.translation.trim()}`,
        examples: form.example.trim() ? [{ sentence: form.example.trim() }] : [],
      }],
    };
    setCards(prev => [newCard, ...prev]);
    setForm(EMPTY_FORM());
  };

  const handleRemoveCard = useCallback((id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleClear = useCallback(() => setCards([]), []);

  const handleSave = useCallback(async (folderData) => {
    try {
      setSaving(true);
      const payload = {
        create_new_folder: folderData.isNew,
        flashcards: cards.map(c => ({
          headword: c.headword,
          pos: c.pos || null,
          image_url: c.imageUrl || null,
          senses: c.senses,
        })),
      };
      if (folderData.isNew) payload.folder_title = folderData.title;
      else payload.folder_id = folderData.id;

      const response = await saveFlashcardsToFolderAPI(payload);
      if (response?.success && response?.data?.inserted_count > 0) {
        const savedId = response.data.folder?.id || folderData.id;
        setCards([]);
        setSaving(false);
        if (savedId) setTimeout(() => navigate(`/study?folderId=${savedId}`), 400);
        return true;
      }
      throw new Error('Không có flashcard nào được lưu.');
    } catch (e) {
      setError(e.message || 'Lưu thất bại. Vui lòng thử lại.');
      setSaving(false);
      return false;
    }
  }, [cards, navigate]);

  const openSaveModal = useCallback((opts = {}) => {
    if (cards.length === 0) return;
    openModal(SaveFlashcardModal, {
      flashcards: cards,
      onSave: handleSave,
      initialFolderId: folderId,
      initialFolderTitle: folderTitle,
    }, { type: 'drawer-right', size: 'sm' });
  }, [cards, openModal, handleSave, folderId, folderTitle]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

      {/* ── Left: Form ── */}
      <div style={{
        borderRadius: 20, border: `2px solid ${t.gray}`,
        borderBottom: `4px solid ${t.grayDark}`,
        background: '#fff', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.sub }}>
          ✏️ Tạo thẻ mới
        </div>

        {/* headword + pos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Từ tiếng Anh *</label>
            <input
              value={form.headword}
              onChange={e => update('headword', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Resilience"
              style={fieldStyle}
              onFocus={e => e.target.style.borderColor = t.blue}
              onBlur={e => e.target.style.borderColor = t.gray}
            />
          </div>
          <div>
            <label style={labelStyle}>Loại từ *</label>
            <select
              value={form.pos}
              onChange={e => update('pos', e.target.value)}
              style={{ ...fieldStyle, width: 110, cursor: 'pointer', padding: '0 10px' }}
            >
              <option value="">--</option>
              {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* translation */}
        <div>
          <label style={labelStyle}>Nghĩa tiếng Việt *</label>
          <input
            value={form.translation}
            onChange={e => update('translation', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. Sự kiên cường"
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = t.blue}
            onBlur={e => e.target.style.borderColor = t.gray}
          />
        </div>

        {/* definition */}
        <div>
          <label style={labelStyle}>Định nghĩa <span style={{ fontWeight: 600, textTransform: 'none' }}>(tùy chọn)</span></label>
          <input
            value={form.definition}
            onChange={e => update('definition', e.target.value)}
            placeholder="e.g. The ability to recover quickly..."
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor = t.blue}
            onBlur={e => e.target.style.borderColor = t.gray}
          />
        </div>

        {/* example */}
        <div>
          <label style={labelStyle}>Ví dụ <span style={{ fontWeight: 600, textTransform: 'none' }}>(tùy chọn)</span></label>
          <input
            value={form.example}
            onChange={e => update('example', e.target.value)}
            placeholder="e.g. She showed great resilience..."
            style={{ ...fieldStyle, fontStyle: 'italic' }}
            onFocus={e => e.target.style.borderColor = t.blue}
            onBlur={e => e.target.style.borderColor = t.gray}
          />
        </div>

        {/* image */}
        <div>
          <label style={labelStyle}>Ảnh <span style={{ fontWeight: 600, textTransform: 'none' }}>(tùy chọn)</span></label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => handleImageFile(e.target.files?.[0])} />
          {form.imageUrl ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={form.imageUrl} alt="" style={{
                width: 80, height: 80, objectFit: 'cover',
                borderRadius: 10, border: `2px solid ${t.gray}`, display: 'block',
              }} />
              <button onClick={() => update('imageUrl', null)} style={{
                position: 'absolute', top: -6, right: -6,
                width: 20, height: 20, borderRadius: '50%',
                background: t.red, border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}>
                <CloseIcon sx={{ fontSize: 11, color: '#fff' }} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.background = t.blueBg; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = t.grayDark; e.currentTarget.style.background = t.surface; }}
              onDrop={e => { e.preventDefault(); handleImageFile(e.dataTransfer.files?.[0]); e.currentTarget.style.borderColor = t.grayDark; e.currentTarget.style.background = t.surface; }}
              style={{
                height: 72, borderRadius: 10, border: `2px dashed ${t.grayDark}`,
                background: t.surface, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.blue; e.currentTarget.style.background = t.blueBg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.grayDark; e.currentTarget.style.background = t.surface; }}
            >
              <ImageOutlinedIcon sx={{ fontSize: 20, color: t.sub }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: t.sub }}>Thêm ảnh</span>
            </div>
          )}
        </div>

        {/* error */}
        {error && (
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            border: `2px solid ${t.red}`, background: t.redBg,
            fontSize: '0.78rem', fontWeight: 700, color: t.red,
          }}>{error}</div>
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!isValid}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '11px', borderRadius: 12, border: 'none',
            background: isValid ? t.green : t.gray,
            borderBottom: `4px solid ${isValid ? t.greenDark : t.grayDark}`,
            color: '#fff', fontWeight: 900, fontSize: '0.85rem',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            fontFamily: 'inherit', transition: 'all 0.1s',
            cursor: isValid ? 'pointer' : 'not-allowed',
            opacity: isValid ? 1 : 0.6,
          }}
          onMouseDown={e => { if (isValid) { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; } }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Thêm vào danh sách
        </button>
      </div>

      {/* ── Right: ResultsTray ── */}
      <ResultsTray
        flashcards={cards}
        saving={saving}
        onClear={handleClear}
        onSaveAll={openSaveModal}
        onRemoveCard={handleRemoveCard}
      />
    </div>
  );
}
