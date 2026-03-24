import React from 'react';
import { Plus } from 'lucide-react';
import { colors } from '../../theme';
import { Typography } from '@mui/material';

function CreateFolderButton({ setOpen }) {
  return (
    <div
      onClick={() => setOpen(true)}
      className='bg-sage/10 backdrop-blur-md border-2 border-dashed border-sage/30 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-sage/20 hover:border-sage transition-all duration-300 h-44 w-full group'
    >
      <div className='w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
        <Plus style={{ color: colors.sage }} size={32} />
      </div>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.95rem',
          color: colors.sage,
          mt: 2,
        }}
      >
        Tạo Folder
      </Typography>
    </div>
  );
}

export default CreateFolderButton;
