import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, InputAdornment, Drawer, Divider, List, ListItem,
  ListItemText, Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import StyleIcon from '@mui/icons-material/Style';
import { adminFolderService } from '../../services/adminFolder/adminFolder.service';
import { toast } from 'react-toastify';

const EMPTY_FORM = { title: '', required_level: 1 };

export default function AdminExploreFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Create / Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Flashcard detail drawer
  const [drawerFolder, setDrawerFolder] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFolderService.listPublicFolders();
      setFolders(res.data ?? []);
    } catch {
      toast.error('Failed to load folders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFolders(); }, [fetchFolders]);

  /* ── Drawer ── */
  const openDrawer = async (folder) => {
    setDrawerFolder(folder);
    setFlashcards([]);
    setFlashcardsLoading(true);
    try {
      const res = await adminFolderService.getFolderFlashcards(folder.id);
      setFlashcards(res.data ?? []);
    } catch {
      toast.error('Failed to load flashcards.');
    } finally {
      setFlashcardsLoading(false);
    }
  };

  const closeDrawer = () => { setDrawerFolder(null); setFlashcards([]); };

  /* ── Dialog helpers ── */
  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (folder) => {
    setEditTarget(folder);
    setForm({ title: folder.title, required_level: folder.required_level ?? 1 });
    setDialogOpen(true);
  };
  const closeDialog = () => { if (!submitting) setDialogOpen(false); };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      if (editTarget) {
        await adminFolderService.updatePublicFolder(editTarget.id, {
          title: form.title.trim(),
          required_level: Number(form.required_level),
        });
        toast.success('Folder updated.');
      } else {
        await adminFolderService.createPublicFolder({
          title: form.title.trim(),
          required_level: Number(form.required_level),
        });
        toast.success('Folder created.');
      }
      setDialogOpen(false);
      fetchFolders();
    } catch {
      toast.error('Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await adminFolderService.deletePublicFolder(deleteTarget.id);
      toast.success('Folder deleted.');
      setDeleteTarget(null);
      if (drawerFolder?.id === deleteTarget.id) closeDrawer();
      fetchFolders();
    } catch {
      toast.error('Delete failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const levelColor = (lvl) => {
    if (lvl <= 3) return { bg: '#dcfce7', color: '#16a34a' };
    if (lvl <= 7) return { bg: '#fef9c3', color: '#ca8a04' };
    return { bg: '#fee2e2', color: '#dc2626' };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <LockOpenIcon sx={{ color: '#6366f1' }} />
            <Typography variant="h5" fontWeight={700} color="primary">
              Explore Folders
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage public folders visible in the Explore tab (level-gated)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          New Folder
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Cards</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Required Level</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No explore folders yet. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
              {folders.map((folder) => {
                const lc = levelColor(folder.required_level ?? 1);
                return (
                  <TableRow
                    key={folder.id}
                    hover
                    sx={{ cursor: 'pointer', bgcolor: drawerFolder?.id === folder.id ? '#f0f9ff' : 'inherit' }}
                    onClick={() => openDrawer(folder)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StyleIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                        <Typography fontWeight={600}>{folder.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Badge badgeContent={folder.flashcard_count ?? 0} color="primary" showZero />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`Level ${folder.required_level ?? 1}+`}
                        size="small"
                        sx={{ bgcolor: lc.bg, color: lc.color, fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label="Public" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View flashcards">
                        <IconButton size="small" onClick={() => openDrawer(folder)} sx={{ color: '#6366f1' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(folder)} sx={{ color: '#0ea5e9' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteTarget(folder)} sx={{ color: '#ef4444' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Flashcard Detail Drawer ── */}
      <Drawer
        anchor="right"
        open={!!drawerFolder}
        onClose={closeDrawer}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, p: 0 } }}
      >
        {drawerFolder && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Drawer header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StyleIcon sx={{ color: '#6366f1' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={800} noWrap>{drawerFolder.title}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={`Level ${drawerFolder.required_level ?? 1}+`}
                    size="small"
                    sx={{ ...levelColor(drawerFolder.required_level ?? 1), fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  <Chip
                    label={`${drawerFolder.flashcard_count ?? 0} cards`}
                    size="small"
                    sx={{ bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 700, fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>
              <IconButton size="small" onClick={closeDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Flashcard list */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
              {flashcardsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : flashcards.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <StyleIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">No flashcards in this folder.</Typography>
                </Box>
              ) : (
                <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {flashcards.map((fc, idx) => (
                    <ListItem
                      key={fc.id}
                      disablePadding
                      sx={{
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        bgcolor: '#fff',
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', minWidth: 24, pt: 0.2 }}>
                        {idx + 1}
                      </Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700} fontSize="0.9rem" color="#1e293b">
                          {fc.english}
                        </Typography>
                        <Typography fontSize="0.82rem" color="#64748b" mt={0.3}>
                          {fc.vietnamese}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            {/* Drawer footer */}
            <Box sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => { openEdit(drawerFolder); }}
                sx={{ flex: 1, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteTarget(drawerFolder)}
                sx={{ flex: 1, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editTarget ? 'Edit Folder' : 'Create Explore Folder'}
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Folder Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            inputProps={{ maxLength: 30 }}
            helperText={`${form.title.length}/30`}
            autoFocus
          />
          <TextField
            label="Required Level"
            type="number"
            fullWidth
            value={form.required_level}
            onChange={(e) => setForm((f) => ({ ...f, required_level: Math.max(1, Number(e.target.value)) }))}
            InputProps={{
              startAdornment: <InputAdornment position="start">Lv.</InputAdornment>,
              inputProps: { min: 1 },
            }}
            helperText="Users must reach this level to unlock the folder"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={closeDialog} disabled={submitting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !form.title.trim()}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            {editTarget ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => !submitting && setDeleteTarget(null)}
        maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Folder?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            <strong>"{deleteTarget?.title}"</strong> and all its flashcards will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={submitting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
