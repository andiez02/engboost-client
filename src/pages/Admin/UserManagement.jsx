import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Warning as WarningIcon,
  Folder as FolderIcon,
  Photo as PhotoIcon,
  Description as DescriptionIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { getListUsersAPI, updateUserRoleAPI, deleteUserAPI } from '../../apis';
import { formatDate } from '../../utils/formatter';
import { toast } from 'react-toastify';

function UserManagement() {
  // State cho người dùng và tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [listUsers, setListUsers] = useState([]);

  // State cho phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Hàm lấy danh sách người dùng
  const fetchListUsers = async () => {
    try {
      setLoading(true);
      const response = await getListUsersAPI(page, 10, debouncedSearch);
      setListUsers(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalUsers(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc page, search thay đổi
  useEffect(() => {
    fetchListUsers();
  }, [page, debouncedSearch]);

  // Xử lý các sự kiện
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setSelectedRole('');
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditSubmit = async () => {
    if (selectedUser) {
      try {
        const response = await updateUserRoleAPI(
          selectedUser._id,
          selectedRole
        );

        // Cập nhật danh sách người dùng
        setListUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? { ...user, role: selectedRole }
              : user
          )
        );

        handleEditClose();
        toast.success(response.message || 'Cập nhật vai trò thành công');
      } catch (error) {
        console.error('Failed to update user role:', error);
        toast.error(
          error.response?.data?.message ||
            'Không thể cập nhật vai trò người dùng'
        );
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        setDeleteLoading(true);
        const response = await deleteUserAPI(selectedUser._id);

        // Cập nhật danh sách người dùng sau khi xóa
        setListUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id)
        );

        toast.success(
          response.message ||
            'Người dùng và tất cả dữ liệu liên quan đã được xóa thành công'
        );
        handleDeleteClose();

        // Nếu danh sách trống sau khi xóa và không phải trang đầu, quay lại trang trước
        if (listUsers.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          // Tải lại danh sách để cập nhật phân trang
          fetchListUsers();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);

        // Hiển thị thông báo lỗi cụ thể nếu có
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Không thể xóa người dùng');
        }
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Box */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên, email, username..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleSearchClear}
                  aria-label="Xóa tìm kiếm"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Hiển thị kết quả tìm kiếm */}
      {debouncedSearch && (
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Kết quả tìm kiếm cho "{debouncedSearch}": {totalUsers} người dùng
          </Typography>
        </Box>
      )}

      {/* Thông báo về tài khoản admin */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body2" color="info.main">
          <b>Lưu ý:</b> Tài khoản admin không thể bị xóa trực tiếp. Để xóa tài
          khoản admin, trước tiên hãy thay đổi vai trò của họ thành "Người
          dùng".
        </Typography>
      </Box>

      {/* User Table */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Đang tải...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : listUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      {debouncedSearch
                        ? 'Không tìm thấy người dùng phù hợp'
                        : 'Không có dữ liệu'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                listUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Avatar
                          src={user.avatar}
                          alt={user.fullName || user.username}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.username}
                          </Typography>
                          {user.fullName && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {user.fullName}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'ADMIN' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'
                        }
                        size="small"
                        color={user.isActive ? 'success' : 'warning'}
                        icon={
                          user.isActive ? (
                            <CheckCircleIcon fontSize="small" />
                          ) : (
                            <BlockIcon fontSize="small" />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa vai trò">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(user)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          user.role === 'ADMIN'
                            ? 'Không thể xóa tài khoản admin'
                            : 'Xóa'
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(user)}
                            color="error"
                            disabled={
                              user.role === 'ADMIN' ||
                              user.email === 'admin@yopmail.com'
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa vai trò người dùng</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box
              sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Người dùng
                </Typography>
                <Typography variant="body1">
                  {selectedUser.fullName || selectedUser.username}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={selectedRole}
                  label="Vai trò"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <MenuItem value="CLIENT">Người dùng</MenuItem>
                  <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Hủy</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={selectedRole === selectedUser?.role}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog - Cải tiến */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6">Xác nhận xóa người dùng</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" gutterBottom>
                Bạn có chắc chắn muốn xóa người dùng này?
              </Typography>

              {/* Thông tin người dùng */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}
                >
                  <Avatar
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {selectedUser.fullName || selectedUser.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label={selectedUser.role}
                    size="small"
                    color={
                      selectedUser.role === 'ADMIN' ? 'primary' : 'default'
                    }
                  />
                  <Chip
                    label={
                      selectedUser.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'
                    }
                    size="small"
                    color={selectedUser.isActive ? 'success' : 'warning'}
                  />
                </Box>
              </Box>

              {/* Danh sách dữ liệu sẽ bị xóa */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Dữ liệu sau sẽ bị xóa vĩnh viễn:
                </Typography>
                <List
                  dense
                  sx={{ bgcolor: 'background.default', borderRadius: 1 }}
                >
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Thông tin tài khoản người dùng"
                      secondary="Bao gồm thông tin cá nhân, ảnh đại diện và cài đặt"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FolderIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tất cả thư mục (folders)"
                      secondary="Bao gồm thư mục công khai và riêng tư"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tất cả flashcard"
                      secondary="Bao gồm nội dung, từ vựng và ghi chú"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PhotoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tất cả hình ảnh đã tải lên"
                      secondary="Bao gồm ảnh đại diện và ảnh trong flashcard"
                    />
                  </ListItem>
                </List>
              </Box>

              {/* Cảnh báo */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <WarningIcon color="inherit" fontSize="small" />
                <Typography variant="body2">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ
                  bị xóa vĩnh viễn.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleDeleteClose}
            disabled={deleteLoading}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
