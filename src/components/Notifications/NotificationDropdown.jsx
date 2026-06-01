import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

function NotificationDropdown({ notifications, unreadCount, markAsRead, markAllAsRead, onClose }) {
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1,
        width: 360,
        maxHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '2px solid #E5E5E5',
        borderBottom: '4px solid #E5E5E5',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={800} fontSize="1.1rem" color="#4B4B4B">
          Thông báo
        </Typography>
        {unreadCount > 0 && (
          <Typography 
            onClick={markAllAsRead} 
            sx={{ 
              fontWeight: 700, 
              fontSize: '0.8rem', 
              color: '#3B82F6', 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            Đánh dấu đã đọc tất cả
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: '#F0F0F0' }} />

      <Box sx={{ overflowY: 'auto', flex: 1, pb: 1 }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography fontSize="0.9rem" color="#AFAFAF" fontWeight={600}>
              Bạn chưa có thông báo nào.
            </Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <ButtonBase
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              sx={{
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                p: 2,
                gap: 2,
                bgcolor: notif.is_read ? '#fff' : '#F0F7FF',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: notif.is_read ? '#F9F9F9' : '#E6F0FF' },
              }}
            >
              {/* Icon Based on Type */}
              <Box 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%',
                  bgcolor: notif.type === 'STREAK_WARNING' ? '#FFF0DE' : '#F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {notif.type === 'STREAK_WARNING' ? (
                  <LocalFireDepartmentIcon sx={{ color: '#FF9600', fontSize: 26 }} />
                ) : (
                  <NotificationsRoundedIcon sx={{ color: '#AFAFAF', fontSize: 26 }} />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={notif.is_read ? 600 : 800} fontSize="0.95rem" color="#4B4B4B" sx={{ mb: 0.5 }}>
                  {notif.title}
                </Typography>
                <Typography fontWeight={500} fontSize="0.85rem" color="#777" sx={{ mb: 0.5, lineHeight: 1.4 }}>
                  {notif.message}
                </Typography>
                <Typography fontWeight={600} fontSize="0.75rem" color="#1CB0F6">
                  {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: vi })}
                </Typography>
              </Box>

              {/* Unread indicator dot */}
              {!notif.is_read && (
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: '#3B82F6',
                    mt: 1,
                    flexShrink: 0
                  }} 
                />
              )}
            </ButtonBase>
          ))
        )}
      </Box>
    </Paper>
  );
}

export default NotificationDropdown;
