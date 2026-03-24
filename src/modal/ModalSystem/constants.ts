import { ModalOptions } from './types';

export const DEFAULT_MODAL_OPTIONS: ModalOptions = {
  size: 'md',
  type: 'center',
  closeOnBackdropClick: true,
  closeOnEsc: true,
  showCloseButton: true,
  preventBackgroundScroll: true,
};

export const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full m-4',
};

export const Z_INDEX_BASE = 1000;
