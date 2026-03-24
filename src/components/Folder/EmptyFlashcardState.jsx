import React from 'react';
import { Box, Typography, Button, Avatar, Paper } from '@mui/material';
import { Add, FolderOutlined } from '@mui/icons-material';

const EmptyFlashcardState = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        padding: '32px 20px',
        borderRadius: '12px',
        bgcolor: '#ffffff',
        border: '1px dashed rgba(0,0,0,0.08)',
      }}
    >
      <Avatar
        sx={{
          bgcolor: 'rgba(59, 130, 246, 0.1)',
          color: 'rgb(59, 130, 246)',
          width: 56,
          height: 56,
          margin: '0 auto 16px',
        }}
      >
        <FolderOutlined sx={{ fontSize: 28 }} />
      </Avatar>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}
      >
        Chưa có từ vựng nào
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#64748b',
          mb: 3,
          maxWidth: '400px',
          mx: 'auto',
        }}
      >
        Hãy thêm từ vựng đầu tiên để người học có thể học tập hiệu quả
      </Typography>
    </Paper>
  );
};

export default EmptyFlashcardState;
