import { alpha } from '@mui/material';

// ─── EngBoost Design Tokens ──────────────────────────────────────────────────

export const tokens = {
  color: {
    primary:      '#4F46E5',
    primaryDark:  '#3730A3',
    primaryLight: '#EEF2FF',
    accentFrom:   '#4F46E5',
    accentVia:    '#7C3AED',
    accentTo:     '#2563EB',
    success:      '#22C55E',
    successBg:    '#F0FDF4',
    error:        '#EF4444',
    errorBg:      '#FEF2F2',
    warning:      '#F59E0B',
    surface:      '#F7F7F7',
    border:       '#E5E5E5',
    borderDark:   '#D5D5D5',
    text:         '#4B4B4B',
    textSub:      '#AFAFAF',
    white:        '#FFFFFF',
    // Gamification
    xp:           '#FF9600',
    xpBg:         '#FFF4E5',
    combo:        '#FF4B4B',
    streak:       '#FF9600',
  },
  radius: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadow: {
    sm: '0 2px 8px rgba(0,0,0,0.06)',
    md: '0 4px 16px rgba(0,0,0,0.08)',
    lg: '0 8px 32px rgba(0,0,0,0.10)',
    xl: '0 16px 48px rgba(0,0,0,0.12)',
  },
};

// ─── Legacy Gamification Palette (kept for back-compat) ───────────────────────

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
  blue:      tokens.color.accentTo,
  blueDark:  '#1899D6',
  blueBg:    '#DDF4FF',
  green:     '#58CC02',
  greenDark: '#46A302',
  greenBg:   '#D7FFB8',
  red:       '#FF4B4B',
  redDark:   '#EA2B2B',
  redBg:     '#FFF0F0',
  gray:      tokens.color.border,
  grayDark:  tokens.color.borderDark,
  surface:   tokens.color.surface,
  text:      tokens.color.text,
  sub:       tokens.color.textSub,
  white:     tokens.color.white,
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
    backgroundColor: alpha(tokens.color.white, 0.4),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(tokens.color.white, 0.6)}`,
    boxShadow: tokens.shadow.sm,
  },
  medium: {
    backgroundColor: alpha(tokens.color.white, 0.6),
    backdropFilter: 'blur(25px)',
    border: `1px solid ${alpha(tokens.color.white, 0.8)}`,
    boxShadow: tokens.shadow.md,
  },
  heavy: {
    backgroundColor: alpha(tokens.color.white, 0.8),
    backdropFilter: 'blur(30px)',
    border: `1px solid ${alpha(tokens.color.white, 0.9)}`,
    boxShadow: tokens.shadow.xl,
  },
};

export const transitions = {
  default: 'all 0.3s ease',
  smooth:  'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce:  'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const theme = {
  tokens,
  colors,
  gamify,
  glassmorphism,
  transitions,
};

export default theme;
