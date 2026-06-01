import React, { useRef } from 'react';
import { Dialog } from '@mui/material';
import { FolderIcon } from 'lucide-react';
import { gamify as t, btn3d } from '../../theme';

const CreateFolderDialog = ({
  open,
  onClose,
  newFolderTitle,
  setNewFolderTitle,
  creating,
  handleCreateFolder,
}) => {
  const inputRef = useRef(null);
  const remaining = 30 - newFolderTitle.length;

  return (
    <Dialog
      open={open}
      onClose={() => !creating && onClose()}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 4,
          border: `2px solid ${t.gray}`,
          borderBottom: `4px solid ${t.grayDark}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
          width: 400,
          maxWidth: '95vw',
          overflow: 'hidden',
          p: 0,
        },
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: `2px solid ${t.gray}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: t.blueBg, border: `2px solid ${t.blue}`,
        }}>
          <FolderIcon size={18} style={{ color: t.blue }} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: t.text, lineHeight: 1.2 }}>Tạo thư mục mới</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: t.sub, marginTop: 2 }}>Đặt tên để bắt đầu sắp xếp flashcard</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ marginBottom: 6, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.sub }}>
          Tên thư mục
        </div>
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            display: 'flex', alignItems: 'center',
            borderRadius: 12, border: `2px solid ${t.gray}`,
            borderBottom: `4px solid ${t.grayDark}`,
            background: '#fff', padding: '10px 14px',
            transition: 'border-color 0.15s',
            cursor: 'text',
          }}
          onFocus={() => {}}
        >
          <input
            ref={inputRef}
            autoFocus
            value={newFolderTitle}
            onChange={(e) => setNewFolderTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !creating && newFolderTitle.trim()) handleCreateFolder();
              if (e.key === 'Escape') onClose();
            }}
            maxLength={30}
            disabled={creating}
            placeholder="VD: IELTS Vocabulary, Daily Words..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: '0.9rem', fontWeight: 800, color: t.text,
              fontFamily: 'inherit',
            }}
          />
          <span style={{
            fontSize: '0.68rem', fontWeight: 800,
            color: remaining <= 5 ? t.red : t.sub,
            flexShrink: 0, marginLeft: 8,
          }}>
            {remaining}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '0 24px 20px',
        display: 'flex', gap: 8, justifyContent: 'flex-end',
      }}>
        <button
          onClick={onClose}
          disabled={creating}
          style={{
            padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 900,
            border: `2px solid ${t.gray}`, borderBottom: `4px solid ${t.grayDark}`,
            background: '#fff', color: t.sub,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            transition: 'all 0.1s',
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
        >
          Hủy
        </button>
        <button
          onClick={handleCreateFolder}
          disabled={!newFolderTitle.trim() || creating}
          style={{
            padding: '10px 24px', borderRadius: 12, cursor: newFolderTitle.trim() && !creating ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 900,
            border: `2px solid ${newFolderTitle.trim() && !creating ? t.green : t.gray}`,
            borderBottom: `4px solid ${newFolderTitle.trim() && !creating ? t.greenDark : t.grayDark}`,
            background: newFolderTitle.trim() && !creating ? t.green : t.surface,
            color: newFolderTitle.trim() && !creating ? '#fff' : t.sub,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            transition: 'all 0.1s',
            opacity: creating ? 0.7 : 1,
          }}
          onMouseDown={e => { if (!newFolderTitle.trim() || creating) return; e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.borderBottomWidth = '0px'; }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
        >
          {creating ? 'Đang tạo...' : '+ Tạo thư mục'}
        </button>
      </div>
    </Dialog>
  );
};

export default CreateFolderDialog;
