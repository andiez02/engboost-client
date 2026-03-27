import { FolderIcon } from 'lucide-react';
import React from 'react';
import {
  Public as PublicIcon,
  PublicOff as PublicOffIcon,
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import { gamify as t } from '../../theme';

function FolderItem({ folder, handleOpenFolder, onPublicToggle }) {
  return (
    <div
      onClick={() => handleOpenFolder(folder)}
      className="relative h-44 w-full cursor-pointer rounded-3xl border-2 border-b-[4px] bg-white p-5 transition-all duration-150 active:border-b-[0px] active:translate-y-[4px] group"
      style={{
        borderColor: t.gray,
        borderBottomColor: t.grayDark,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.blue;
        e.currentTarget.style.borderBottomColor = t.blueDark;
        e.currentTarget.style.backgroundColor = '#F2FCFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.gray;
        e.currentTarget.style.borderBottomColor = t.grayDark;
        e.currentTarget.style.backgroundColor = '#fff';
      }}
    >
      {/* Public/Private Toggle Button */}
      {onPublicToggle && (
        <button
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-xl border-2 px-2 py-1 text-[10px] font-black uppercase tracking-widest transition-all"
          style={{
            borderColor: folder.isPublic ? t.blue : t.gray,
            backgroundColor: folder.isPublic ? t.blue : '#fff',
            color: folder.isPublic ? '#fff' : t.sub,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPublicToggle(folder._id);
          }}
        >
          {folder.isPublic ? (
            <>
              <PublicIcon sx={{ fontSize: 12 }} />
              Public
            </>
          ) : (
            <>
              <PublicOffIcon sx={{ fontSize: 12 }} />
              Private
            </>
          )}
        </button>
      )}

      {/* Folder Icon + Title */}
      <div className="mt-1 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-150"
          style={{ borderColor: t.blue, backgroundColor: t.blueBg }}>
          <FolderIcon style={{ color: t.blue }} size={28} />
        </div>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '0.9rem',
            color: t.text,
            textAlign: 'center',
            mt: 1.5,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 2,
          }}
        >
          {folder.title}
        </Typography>
      </div>

      {/* Bottom row: word count */}
      <div className="flex items-center justify-center mt-2">
        <div className="rounded-xl border-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider"
          style={{ borderColor: t.gray, backgroundColor: t.surface, color: t.sub }}>
          {folder.flashcard_count !== undefined ? folder.flashcard_count : 0} từ
        </div>
      </div>
    </div>
  );
}

export default FolderItem;
