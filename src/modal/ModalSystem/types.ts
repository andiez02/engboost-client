import { ComponentType } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ModalType = 'center' | 'drawer-left' | 'drawer-right' | 'fullscreen';

export interface ModalOptions {
  size?: ModalSize;
  type?: ModalType;
  customWidth?: string;
  customHeight?: string;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
  preventBackgroundScroll?: boolean;
}

export interface ModalInstance<T = any> {
  id: string;
  component: ComponentType<T>;
  props?: T;
  options?: ModalOptions;
  resolve?: (value: any) => void;
  reject?: (reason?: any) => void;
}

export interface ModalState {
  modals: ModalInstance[];
}
