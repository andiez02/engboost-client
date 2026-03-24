import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { updateFolderAPI } from '../../../../../apis';
import FolderDetailModal from './FolderDetailModal/FolderDetailModal';
import CreateFolderDialog from '../../../../../components/Folder/CreateFolderDialog';
import {
  fetchFolders,
  deleteFolder,
  createFolder,
} from '../../../../../redux/folder/folderSlice';
import CreateFolderButton from '../../../../../components/Folder/CreateFolderButton';
import FolderItem from '../../../../../components/Folder/FolderItem';

const Folders = () => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folders);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderDetailOpen, setFolderDetailOpen] = useState(false);
  const hasFetched = useRef(false);

  // Fetch folders only on initial mount
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchFolders());
      hasFetched.current = true;
    }
  }, [dispatch]);

  const handleCreateFolder = async () => {
    if (!newFolderTitle.trim()) return;

    setCreating(true);
    try {
      const response = await dispatch(
        createFolder({
          title: newFolderTitle.trim(),
        })
      ).unwrap();

      setNewFolderTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenFolder = (folder) => {
    setSelectedFolder(folder);
    setFolderDetailOpen(true);
  };

  const handleEditFolder = async (folderId, data) => {
    try {
      const response = await updateFolderAPI(folderId, data);
      if (response && response.folder) {
        dispatch(fetchFolders()); // Refresh folders after edit
        // Update selected folder state with new data
        setSelectedFolder((prev) => ({
          ...prev,
          ...response.folder,
        }));
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await dispatch(deleteFolder(folderId)).unwrap();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleFolderUpdate = (updatedFolder) => {
    dispatch(fetchFolders()); // Refresh folders to update flashcard count
  };

  return (
    <div className='py-4 md:py-6'>
      {/* Folder Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {/* Create Folder Button */}
        <CreateFolderButton setOpen={setOpen} />

        {/* Existing Folders */}
        {folders?.map((folder) => {
          const folderId = folder.id || folder._id;
          return (
            <FolderItem
              key={folderId}
              folder={folder}
              handleOpenFolder={handleOpenFolder}
            />
          );
        })}
      </div>

      {/* Empty state if no folders */}
      {folders?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Bạn chưa có thư mục nào. Hãy tạo thư mục đầu tiên!
        </div>
      )}

      {/* Dialog for Creating Folder */}
      <CreateFolderDialog
        open={open}
        onClose={() => setOpen(false)}
        newFolderTitle={newFolderTitle}
        setNewFolderTitle={setNewFolderTitle}
        creating={creating}
        handleCreateFolder={handleCreateFolder}
      />

      {/* Folder Detail Modal */}
      <FolderDetailModal
        open={folderDetailOpen}
        onClose={() => setFolderDetailOpen(false)}
        folder={selectedFolder}
        onEdit={handleEditFolder}
        onDelete={handleDeleteFolder}
        onFolderUpdate={handleFolderUpdate}
      />
    </div>
  );
};

export default Folders;
