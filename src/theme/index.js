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
  glassmorphism,
  transitions,
};

export default theme;
