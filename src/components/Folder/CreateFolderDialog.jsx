import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const CreateFolderDialog = ({
  open,
  onClose,
  newFolderTitle,
  setNewFolderTitle,
  creating,
  handleCreateFolder,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !creating && onClose()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: 'rounded-xl',
      }}
    >
      <DialogTitle className="pb-1">Tạo Folder Mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Tên Folder"
          variant="outlined"
          value={newFolderTitle}
          onChange={(e) => setNewFolderTitle(e.target.value)}
          onKeyPress={(e) =>
            e.key === 'Enter' && !creating && handleCreateFolder()
          }
          margin="dense"
          inputProps={{ maxLength: 30 }}
          disabled={creating}
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {newFolderTitle.length}/30
        </div>
      </DialogContent>
      <DialogActions className="p-3">
        <Button
          onClick={() => onClose()}
          color="inherit"
          size="small"
          disabled={creating}
        >
          Hủy
        </Button>
        <Button
          onClick={handleCreateFolder}
          variant="contained"
          color="primary"
          size="small"
          disabled={!newFolderTitle.trim() || creating}
        >
          {creating ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
