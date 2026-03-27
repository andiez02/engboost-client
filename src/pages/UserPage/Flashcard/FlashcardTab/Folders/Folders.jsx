import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { gamify as t } from '../../../../../theme';

const Folders = () => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folders);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderDetailOpen, setFolderDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  const summary = useMemo(() => {
    const folderList = folders ?? [];
    const totalFolders = folderList.length;
    const totalCards = folderList.reduce(
      (sum, folder) => sum + (folder.flashcard_count ?? 0),
      0
    );

    return {
      totalFolders,
      totalCards,
    };
  }, [folders]);

  const handleCreateFolder = async () => {
    if (!newFolderTitle.trim()) return;

    setCreating(true);
    try {
      await dispatch(
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
        dispatch(fetchFolders());
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

  const handleFolderUpdate = () => {
    dispatch(fetchFolders());
  };

  return (
    <div className='py-4 md:py-6'>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Stats Header ── */}
<div className="rounded-3xl border-2 border-b-[4px] bg-white p-5 md:p-6" style={{ borderColor: t.gray, borderBottomColor: t.grayDark }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📚</span>
                <p className="text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: t.blue }}>
                  BỘ SƯU TẬP
                </p>
              </div>
              <h2 className="text-[26px] font-black tracking-tight" style={{ color: t.text }}>
                Thư mục của bạn
              </h2>
              <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed font-bold" style={{ color: t.sub }}>
                Tổ chức từ vựng theo chủ đề để dễ học, dễ ôn tập.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="min-w-[130px] rounded-2xl border-2 border-b-[4px] px-4 py-3" style={{ borderColor: t.blue, borderBottomColor: t.blueDark, backgroundColor: t.blueBg }}>
                <p className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ color: t.blueDark }}>
                  Thư mục
                </p>
                <p className="mt-1 text-[28px] font-black leading-none" style={{ color: t.blue }}>
                  {summary.totalFolders}
                </p>
              </div>
              <div className="min-w-[130px] rounded-2xl border-2 border-b-[4px] px-4 py-3" style={{ borderColor: t.green, borderBottomColor: t.greenDark, backgroundColor: t.greenBg }}>
                <p className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ color: t.greenDark }}>
                  Từ vựng
                </p>
                <p className="mt-1 text-[28px] font-black leading-none" style={{ color: t.green }}>
                  {summary.totalCards}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Folder Grid ── */}
        <div className="rounded-3xl border-2 border-b-[4px] bg-white p-5 md:p-6" style={{ borderColor: t.gray, borderBottomColor: t.grayDark }}>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-[17px] font-black tracking-tight uppercase" style={{ color: t.text }}>
                Không gian học tập
              </h3>
              <p className="mt-1 text-[12px] font-bold" style={{ color: t.sub }}>
                Chọn thư mục để xem, chỉnh sửa hoặc bắt đầu học.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <CreateFolderButton setOpen={setOpen} />

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
        </div>

        {/* ── Empty State ── */}
        {folders?.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed bg-[#FAFAFA] px-6 py-10 text-center" style={{ borderColor: t.gray }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-white border-2 border-b-[4px]" style={{ borderColor: t.gray, borderBottomColor: t.grayDark }}>
              <span className="text-[2.5rem]">📁</span>
            </div>
            <h3 className="mt-5 text-[18px] font-black tracking-tight" style={{ color: t.text }}>
              Chưa có thư mục nào
            </h3>
            <p className="mt-2 text-[13px] font-bold" style={{ color: t.sub }}>
              Tạo thư mục đầu tiên để bắt đầu sắp xếp flashcards.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mt-5 inline-flex items-center justify-center rounded-2xl border-b-[4px] px-6 py-3 text-[14px] font-black text-white uppercase active:border-b-0 active:translate-y-[4px] transition-all"
              style={{ backgroundColor: t.green, borderBottomColor: t.greenDark }}
            >
              TẠO THƯ MỤC ĐẦU TIÊN
            </button>
          </div>
        )}
      </div>

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
