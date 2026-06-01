import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgress, Dialog, Pagination } from '@mui/material';
import { Search, X, Pencil, Trash2, AlertTriangle, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getListUsersAPI, updateUserRoleAPI, deleteUserAPI, exportUsersExcelAPI } from '../../apis';
import { formatDate } from '../../utils/formatter';
import { toast } from 'react-toastify';

const ACCENT = '#6366F1';
const ACCENT_BG = '#EEF2FF';
const TABLE_HEADERS = [
  'Người dùng',
  'Email',
  'Vai trò',
  'Trạng thái',
  'Level',
  'XP',
  'Streak',
  'Đã ôn',
  'Lần học gần nhất',
  'Ngày tạo',
  '',
];

const getUserId = (user) => user?.id || user?._id;
const formatNumber = (value) => Number(value || 0).toLocaleString('en-US');
const formatOptionalDate = (date) => (date ? formatDate(date) : '--');
const SUMMARY_ITEMS = [
  { key: 'total', label: 'Tổng user', color: '#111827' },
  { key: 'active', label: 'Đang kích hoạt', color: '#059669' },
  { key: 'inactive', label: 'Chưa kích hoạt', color: '#D97706' },
  { key: 'admins', label: 'Admin', color: '#6366F1' },
  { key: 'clients', label: 'Client', color: '#374151' },
];

function RoleBadge({ role }) {
  const isAdmin = role === 'ADMIN';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 700,
      background: isAdmin ? ACCENT_BG : '#F3F4F6',
      color: isAdmin ? ACCENT : '#6B7280',
      border: `1.5px solid ${isAdmin ? '#C7D2FE' : '#E5E7EB'}`,
    }}>
      {isAdmin ? 'Admin' : 'Client'}
    </span>
  );
}

function StatusBadge({ active }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 700,
      background: active ? '#ECFDF5' : '#FFF7ED',
      color: active ? '#059669' : '#D97706',
      border: `1.5px solid ${active ? '#A7F3D0' : '#FDE68A'}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#10B981' : '#F59E0B', display: 'inline-block' }} />
      {active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
    </span>
  );
}

export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialInactiveDays = Number(searchParams.get('inactiveDays') || 0);
  const initialSortBy = searchParams.get('sortBy') || 'createdAt';
  const initialSortOrder = searchParams.get('sortOrder') || 'desc';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [minLevelFilter, setMinLevelFilter] = useState(0);
  const [inactiveDaysFilter, setInactiveDaysFilter] = useState(Number.isNaN(initialInactiveDays) ? 0 : initialInactiveDays);
  const [sortBy, setSortBy] = useState(['createdAt', 'level', 'xp', 'streak', 'lastStudyDate'].includes(initialSortBy) ? initialSortBy : 'createdAt');
  const [sortOrder, setSortOrder] = useState(initialSortOrder === 'asc' ? 'asc' : 'desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [listUsers, setListUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter, statusFilter, minLevelFilter, inactiveDaysFilter, sortBy, sortOrder]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getListUsersAPI(page, 10, debouncedSearch, {
        role: roleFilter,
        status: statusFilter,
        minLevel: minLevelFilter,
        inactiveDays: inactiveDaysFilter,
        sortBy,
        sortOrder,
      });
      setListUsers(res.users || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalUsers(res.pagination?.total || 0);
      setSummary({
        total: res.summary?.total || 0,
        active: res.summary?.active || 0,
        inactive: res.summary?.inactive || 0,
        admins: res.summary?.admins || 0,
        clients: res.summary?.clients || 0,
      });
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter, minLevelFilter, inactiveDaysFilter, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setMinLevelFilter(0);
    setInactiveDaysFilter(0);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const parseFilenameFromDisposition = (disposition) => {
    if (!disposition) return null;
    const match = /filename="?([^"]+)"?/i.exec(disposition);
    return match?.[1] || null;
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const res = await exportUsersExcelAPI(debouncedSearch, {
        role: roleFilter,
        status: statusFilter,
        minLevel: minLevelFilter,
        inactiveDays: inactiveDaysFilter,
        sortBy,
        sortOrder,
      });

      const filename =
        parseFilenameFromDisposition(res.headers?.['content-disposition']) ||
        'engboost-users.xlsx';

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Đã export Excel');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể export Excel');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleEditSubmit = async () => {
    const selectedUserId = getUserId(selectedUser);
    try {
      const res = await updateUserRoleAPI(selectedUserId, selectedRole);
      setListUsers((prev) => prev.map((u) => (getUserId(u) === selectedUserId ? { ...u, role: selectedRole } : u)));
      setEditOpen(false);
      toast.success(res.message || 'Cập nhật vai trò thành công');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật vai trò');
    }
  };

  const handleDeleteConfirm = async () => {
    const selectedUserId = getUserId(selectedUser);
    try {
      setDeleteLoading(true);
      const res = await deleteUserAPI(selectedUserId);
      setListUsers((prev) => prev.filter((u) => getUserId(u) !== selectedUserId));
      toast.success(res.message || 'Đã xóa người dùng');
      setDeleteOpen(false);
      if (listUsers.length === 1 && page > 1) setPage(page - 1);
      else fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa người dùng');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, background: '#F8F9FA', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color={ACCENT} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Quản lý người dùng
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>
            {totalUsers > 0 ? `${totalUsers} người dùng` : ''}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 16, display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.key} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E5E7EB', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 6 }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: item.color }}>
              {formatNumber(summary[item.key])}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 420 }}>
        <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên, email, username..."
          style={{
            width: '100%', padding: '9px 36px 9px 36px', borderRadius: 10,
            border: '1.5px solid #E5E7EB', background: '#fff',
            fontSize: '0.85rem', fontWeight: 500, color: '#111827',
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}>
            <X size={14} color="#9CA3AF" />
          </button>
        )}
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
            background: '#fff', padding: '0 12px', fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', fontFamily: 'inherit', outline: 'none',
          }}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="ADMIN">Chỉ Admin</option>
          <option value="CLIENT">Chỉ User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
            background: '#fff', padding: '0 12px', fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', fontFamily: 'inherit', outline: 'none',
          }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đã kích hoạt</option>
          <option value="INACTIVE">Chưa kích hoạt</option>
        </select>
        <select
          value={String(minLevelFilter)}
          onChange={(e) => setMinLevelFilter(Number(e.target.value))}
          style={{
            height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
            background: '#fff', padding: '0 12px', fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', fontFamily: 'inherit', outline: 'none',
          }}
        >
          <option value="0">Level bất kỳ</option>
          <option value="5">Level từ 5+</option>
          <option value="10">Level từ 10+</option>
          <option value="20">Level từ 20+</option>
        </select>
        <select
          value={String(inactiveDaysFilter)}
          onChange={(e) => setInactiveDaysFilter(Number(e.target.value))}
          style={{
            height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
            background: '#fff', padding: '0 12px', fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', fontFamily: 'inherit', outline: 'none',
          }}
        >
          <option value="0">Hoạt động: tất cả</option>
          <option value="7">Không học 7+ ngày</option>
          <option value="14">Không học 14+ ngày</option>
          <option value="30">Không học 30+ ngày</option>
          <option value="60">Không học 60+ ngày</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
            background: '#fff', padding: '0 12px', fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', fontFamily: 'inherit', outline: 'none',
          }}
        >
          <option value="createdAt">Sắp xếp: Ngày tạo</option>
          <option value="xp">Sắp xếp: XP</option>
          <option value="level">Sắp xếp: Level</option>
          <option value="streak">Sắp xếp: Streak</option>
          <option value="lastStudyDate">Sắp xếp: Lần học gần nhất</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            height: 36, borderRadius: 10, border: '1.5px solid #E5E7EB',
            background: '#fff', padding: '0 12px', fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', fontFamily: 'inherit', outline: 'none',
          }}
        >
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
        <button
          type="button"
          onClick={handleResetFilters}
          style={{
            height: 36,
            borderRadius: 10,
            border: '1.5px solid #E5E7EB',
            background: '#fff',
            padding: '0 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#374151',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Reset bộ lọc
        </button>
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={exporting}
          style={{
            height: 36,
            borderRadius: 10,
            border: 'none',
            background: exporting ? '#E5E7EB' : ACCENT,
            padding: '0 14px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: exporting ? '#9CA3AF' : '#fff',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {exporting ? 'Đang export...' : 'Export Excel'}
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', overflow: 'hidden', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #F3F4F6' }}>
              {TABLE_HEADERS.map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length} style={{ padding: '48px 0', textAlign: 'center' }}>
                  <CircularProgress size={24} sx={{ color: ACCENT }} />
                </td>
              </tr>
            ) : listUsers.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length} style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600 }}>
                  {debouncedSearch ? `Không tìm thấy kết quả cho "${debouncedSearch}"` : 'Không có dữ liệu'}
                </td>
              </tr>
            ) : listUsers.map((user, i) => {
              const isProtected = user.email === 'admin@yopmail.com';
              const userId = getUserId(user);
              return (
              <tr key={userId} style={{ borderBottom: i < listUsers.length - 1 ? '1px solid #F9FAFB' : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: ACCENT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 800, color: ACCENT }}>
                        {(user.username?.[0] ?? '?').toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{user.username}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#6B7280' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}><RoleBadge role={user.role} /></td>
                <td style={{ padding: '12px 16px' }}><StatusBadge active={user.isActive} /></td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', whiteSpace: 'nowrap' }}>{user.level ?? 1}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', whiteSpace: 'nowrap' }}>{formatNumber(user.xp)}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', whiteSpace: 'nowrap' }}>{user.streak ?? 0} ngày</td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', whiteSpace: 'nowrap' }}>{formatNumber(user.totalReviewed)}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{formatOptionalDate(user.lastStudyDate)}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{formatOptionalDate(user.createdAt || user.created_at)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { if (!isProtected) { setSelectedUser(user); setSelectedRole(user.role); setEditOpen(true); } }}
                      disabled={isProtected}
                      title={isProtected ? 'Không thể chỉnh sửa tài khoản root admin' : 'Chỉnh sửa vai trò'}
                      style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: isProtected ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', opacity: isProtected ? 0.35 : 1 }}
                      onMouseEnter={e => { if (!isProtected) { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = ACCENT_BG; } }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
                    >
                      <Pencil size={13} color={ACCENT} />
                    </button>
                    <button
                      onClick={() => { if (!isProtected && user.role !== 'ADMIN') { setSelectedUser(user); setDeleteOpen(true); } }}
                      disabled={isProtected || user.role === 'ADMIN'}
                      title={isProtected ? 'Không thể xóa root admin' : user.role === 'ADMIN' ? 'Không thể xóa admin' : 'Xóa'}
                      style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: (isProtected || user.role === 'ADMIN') ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', opacity: (isProtected || user.role === 'ADMIN') ? 0.35 : 1 }}
                      onMouseEnter={e => { if (!isProtected && user.role !== 'ADMIN') { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; } }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
                    >
                      <Trash2 size={13} color="#EF4444" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} shape="rounded"
            sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 2 }, '& .Mui-selected': { background: `${ACCENT_BG} !important`, color: ACCENT, border: `1.5px solid #C7D2FE` } }}
          />
        </div>
      )}

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1.5px solid #E5E7EB', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', p: 0 } }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid #F3F4F6' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Chỉnh sửa vai trò</div>
          {selectedUser && <div style={{ marginTop: 2, fontSize: '0.8rem', color: '#6B7280' }}>{selectedUser.email}</div>}
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 8, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Vai trò</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['CLIENT', 'ADMIN'].map((role) => (
              <button key={role} onClick={() => setSelectedRole(role)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '0.82rem', fontWeight: 700, transition: 'all 0.15s',
                  border: `1.5px solid ${selectedRole === role ? ACCENT : '#E5E7EB'}`,
                  background: selectedRole === role ? ACCENT_BG : '#fff',
                  color: selectedRole === role ? ACCENT : '#6B7280',
                }}>
                {role === 'CLIENT' ? 'Người dùng' : 'Quản trị viên'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setEditOpen(false)} style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
            Hủy
          </button>
          <button onClick={handleEditSubmit} disabled={selectedRole === selectedUser?.role}
            style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: selectedRole !== selectedUser?.role ? ACCENT : '#E5E7EB', fontSize: '0.82rem', fontWeight: 700, color: selectedRole !== selectedUser?.role ? '#fff' : '#9CA3AF', cursor: selectedRole !== selectedUser?.role ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            Lưu thay đổi
          </button>
        </div>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={deleteOpen} onClose={() => !deleteLoading && setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, border: '1.5px solid #E5E7EB', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', p: 0 } }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1.5px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Xác nhận xóa</div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          {selectedUser && (
            <>
              <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
                Bạn có chắc muốn xóa <strong>{selectedUser.username}</strong>? Hành động này không thể hoàn tác.
              </p>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FEF2F2', border: '1.5px solid #FECACA', fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>
                ⚠️ Tất cả dữ liệu liên quan (folders, flashcards, ảnh) sẽ bị xóa vĩnh viễn.
              </div>
            </>
          )}
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteOpen(false)} disabled={deleteLoading}
            style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '0.82rem', fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
            Hủy
          </button>
          <button onClick={handleDeleteConfirm} disabled={deleteLoading}
            style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: '#EF4444', fontSize: '0.82rem', fontWeight: 700, color: '#fff', cursor: deleteLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, opacity: deleteLoading ? 0.7 : 1 }}>
            {deleteLoading && <CircularProgress size={13} sx={{ color: '#fff' }} />}
            {deleteLoading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
