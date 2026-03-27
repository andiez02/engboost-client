import { alpha } from '@mui/material';

export const colors = {
  sage: '#8fa17d',
  rose: '#c79a8d',
  blue: '#7c98ab',
  sand: '#fdfcf0',
  sandDark: '#f3f1e0',
  dark: '#2d3436',
  white: '#ffffff',
};

export const gamify = {
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  blueBg: '#DDF4FF',
  green: '#58CC02',
  greenDark: '#46A302',
  greenBg: '#D7FFB8',
  red: '#FF4B4B',
  redDark: '#EA2B2B',
  redBg: '#FFF0F0',
  gray: '#E5E5E5',
  grayDark: '#D5D5D5',
  surface: '#F7F7F7',
  text: '#4B4B4B',
  sub: '#AFAFAF',
  white: '#ffffff',
};

// Helper for 3D "pushable" buttons
export const btn3d = (bg, border) => ({
  borderRadius: 3,
  textTransform: 'uppercase',
  fontWeight: 900,
  fontSize: '0.8rem',
  boxShadow: 'none',
  bgcolor: bg,
  color: '#fff',
  border: `2px solid ${bg}`,
  borderBottom: `4px solid ${border}`,
  '&:hover': { bgcolor: bg },
  '&:active': { borderBottomWidth: 0, transform: 'translateY(4px)' },
  '&:disabled': {
    bgcolor: gamify.gray,
    borderColor: gamify.gray,
    borderBottomColor: gamify.grayDark,
    color: gamify.sub,
  },
});

export const glassmorphism = {
  light: {
    backgroundColor: alpha(colors.white, 0.4),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(colors.white, 0.6)}`,
    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
  },
  medium: {
    backgroundColor: alpha(colors.white, 0.6),
    backdropFilter: 'blur(25px)',
    border: `1px solid ${alpha(colors.white, 0.8)}`,
    boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
  },
  heavy: {
    backgroundColor: alpha(colors.white, 0.8),
    backdropFilter: 'blur(30px)',
    border: `1px solid ${alpha(colors.white, 0.9)}`,
    boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
  },
};

export const transitions = {
  default: 'all 0.3s ease',
  smooth: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const theme = {
  colors,
  gamify,
  glassmorphism,
  transitions,
};

export default theme;
