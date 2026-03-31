import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box
} from "@mui/material";

// Style chung cho nút bấm kiểu Duolingo (có đổ bóng phía dưới tạo hiệu ứng 3D)
const duoButtonStyle = (color) => ({
  borderRadius: "16px",
  borderBottom: `4px solid`,
  borderBottomColor: `${color}.dark`,
  fontWeight: "bold",
  padding: "10px 24px",
  textTransform: "uppercase",
  transition: "all 0.1s",
  "&:active": {
    transform: "translateY(2px)",
    borderBottomWidth: "0px",
    mb: "4px"
  }
});

export default function LeaveSessionDialog({ open, onConfirm, onCancel }) {
  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "16px",
          maxWidth: "400px"
        }
      }}
    >
      <Box sx={{ textAlign: 'center', pt: 2 }}>
        {/* Bạn có thể thêm một chiếc Icon hoặc Emoji ở đây để tăng tính biểu cảm */}
        <Typography variant="h1" sx={{ fontSize: "60px", mb: 2 }}>
          🥺
        </Typography>
      </Box>

      <DialogTitle sx={{ 
        textAlign: "center", 
        fontWeight: 800, 
        fontSize: "1.5rem",
        color: "#4b4b4b" 
      }}>
        Bạn muốn bỏ cuộc sao?
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ 
          textAlign: "center", 
          fontWeight: "medium",
          color: "#777"
        }}>
          Mọi nỗ lực nãy giờ của bạn sẽ tan biến như mây khói đấy!
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ flexDirection: "column", gap: 2, px: 3, pb: 2 }}>
        <Button 
          fullWidth
          variant="contained" 
          color="primary"
          onClick={onCancel}
          sx={duoButtonStyle("primary")}
        >
          TIẾP TỤC HỌC THÔI
        </Button>
        
        <Button 
          fullWidth
          variant="text" 
          onClick={onConfirm}
          sx={{ 
            color: "#afafaf", 
            fontWeight: "bold",
            "&:hover": { backgroundColor: "transparent", color: "#ef5350" }
          }}
        >
          TÔI CHẤP NHẬN BỎ LỠ
        </Button>
      </DialogActions>
    </Dialog>
  );
}