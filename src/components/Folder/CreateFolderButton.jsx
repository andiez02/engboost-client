import React from 'react';
import { Plus } from 'lucide-react';
import { Typography } from '@mui/material';
import { gamify as t } from '../../theme';

function CreateFolderButton({ setOpen }) {
  return (
    <div
      onClick={() => setOpen(true)}
      className='rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-150 h-44 w-full group'
      style={{ backgroundColor: t.surface, border: `2px dashed ${t.grayDark}` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.green;
        e.currentTarget.style.backgroundColor = '#F0FFE0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.grayDark;
        e.currentTarget.style.backgroundColor = t.surface;
      }}
    >
      <div className='w-14 h-14 rounded-2xl border-2 border-b-[4px] flex items-center justify-center transition-all duration-150'
        style={{ backgroundColor: t.gray, borderColor: t.grayDark, borderBottomColor: t.sub }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = t.green;
          e.currentTarget.style.borderColor = t.greenDark;
          e.currentTarget.style.borderBottomColor = '#3D8C02';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = t.gray;
          e.currentTarget.style.borderColor = t.grayDark;
          e.currentTarget.style.borderBottomColor = t.sub;
        }}
      >
        <Plus className="transition-colors duration-150" style={{ color: t.sub }} size={28} />
      </div>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: '0.85rem',
          color: t.sub,
          mt: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          '.group:hover &': { color: t.greenDark },
        }}
      >
        Tạo Folder
      </Typography>
    </div>
  );
}

export default CreateFolderButton;
