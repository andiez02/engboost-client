import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function LeaveSessionDialog({ open, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Leave session?</DialogTitle>
      <DialogContent>
        <DialogContentText>Your progress will be lost.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Stay
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
}
