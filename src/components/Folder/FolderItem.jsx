import { Tooltip } from '@mui/material';
import { FolderIcon } from 'lucide-react';
import React from 'react';
import {
  Public as PublicIcon,
  PublicOff as PublicOffIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { Typography } from '@mui/material';

function FolderItem({ folder, handleOpenFolder, onPublicToggle }) {
  return (
    <div
      onClick={() => handleOpenFolder(folder)}
      className='bg-white/60 backdrop-blur-md border border-white/80 rounded-[1.5rem] p-5 flex flex-col justify-between h-44 w-full group hover:shadow-xl hover:border-blue transition-all duration-300 cursor-pointer relative'
    >
      {/* Public/Private Toggle Button */}
      {onPublicToggle && (
        <button
          className={`absolute top-4 right-4 p-1.5 rounded-xl text-[10px] font-bold uppercase letter-spacing-wider flex items-center gap-1.5 transition-all
            ${
              folder.isPublic
                ? 'bg-blue text-white shadow-lg'
                : 'bg-white/80 text-dark/60 border border-dark/10'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onPublicToggle(folder._id);
          }}
        >
          {folder.isPublic ? (
            <>
              <PublicIcon sx={{ fontSize: 14 }} />
              Công khai
            </>
          ) : (
            <>
              <PublicOffIcon sx={{ fontSize: 14 }} />
              Riêng tư
            </>
          )}
        </button>
      )}

      {/* Folder Icon + Title */}
      <div className='flex flex-col items-center mt-2'>
        <div className='w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
          <FolderIcon style={{ color: colors.blue }} size={32} />
        </div>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: colors.dark,
            textAlign: 'center',
            mt: 2,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 2,
          }}
        >
          {folder.title}
        </Typography>
      </div>

      {/* Word Count */}
      <div className='flex justify-center'>
        <div className='text-[10px] font-bold text-dark/60 bg-dark/5 py-1 px-3 rounded-full uppercase tracking-wider'>
          {folder.flashcard_count !== undefined ? folder.flashcard_count : 0} từ vựng
        </div>
      </div>
    </div>
  );
}

export default FolderItem;
