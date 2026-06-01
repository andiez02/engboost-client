import React from 'react';
import { FolderIcon, ChevronRight } from 'lucide-react';
import { gamify as t } from '../../theme';
import { TagChip } from './TagEditor';

function FolderItem({ folder, handleOpenFolder, onPublicToggle }) {
  const due = folder.due_count ?? 0;
  const total = folder.flashcard_count ?? 0;
  const hasDue = due > 0;
  const tags = folder.tags ?? [];

  return (
    <div
      onClick={() => handleOpenFolder(folder)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        borderRadius: 12,
        border: `2px solid ${hasDue ? '#FFD580' : t.gray}`,
        borderBottom: `4px solid ${hasDue ? '#FF9600' : t.grayDark}`,
        background: hasDue ? '#FFFBF0' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hasDue ? '#FF9600' : t.blue;
        e.currentTarget.style.borderBottomColor = hasDue ? '#E68600' : t.blueDark;
        e.currentTarget.style.background = hasDue ? '#FFF4D6' : '#F2FCFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = hasDue ? '#FFD580' : t.gray;
        e.currentTarget.style.borderBottomColor = hasDue ? '#FF9600' : t.grayDark;
        e.currentTarget.style.background = hasDue ? '#FFFBF0' : '#fff';
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.borderBottomWidth = '2px'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
    >
      {/* Folder icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hasDue ? '#FFF0DE' : t.blueBg,
        border: `2px solid ${hasDue ? '#FFD580' : t.blue}`,
      }}>
        <FolderIcon size={18} style={{ color: hasDue ? '#FF9600' : t.blue }} />
      </div>

      {/* Title + tags */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 900, fontSize: '0.88rem', color: t.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }}>
          {folder.title}
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'nowrap', overflow: 'hidden' }}>
            {tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} tag={tag} size="sm" />
            ))}
            {tags.length > 3 && (
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: t.sub, alignSelf: 'center' }}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {hasDue && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 900,
            color: '#FF9600', background: '#FFF0DE',
            border: '2px solid #FFD580', borderRadius: 8,
            padding: '2px 8px', whiteSpace: 'nowrap',
          }}>
            🔥 {due}
          </span>
        )}
        <span style={{
          fontSize: '0.7rem', fontWeight: 800, color: t.sub,
          whiteSpace: 'nowrap',
        }}>
          {total} từ
        </span>
        <ChevronRight size={14} style={{ color: t.sub, flexShrink: 0 }} />
      </div>
    </div>
  );
}

export default FolderItem;
