import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ModalOptions } from '../types';
import { DEFAULT_MODAL_OPTIONS, MODAL_SIZES } from '../constants';
import { cn } from '../utils/cn';

interface BaseModalProps {
  id: string;
  children: React.ReactNode;
  onClose: (result?: any) => void;
  options?: ModalOptions;
  zIndex: number;
}

const BaseModal: React.FC<BaseModalProps> = ({
  children,
  onClose,
  options = {},
  zIndex,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const config = { ...DEFAULT_MODAL_OPTIONS, ...options };

  // Handle ESC key
  useEffect(() => {
    if (!config.closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.closeOnEsc, onClose]);

  // Prevent scroll
  useEffect(() => {
    if (config.preventBackgroundScroll) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [config.preventBackgroundScroll]);

  const sizeClass = MODAL_SIZES[config.size || 'md'];

  const getAnimationVariants = () => {
    switch (config.type) {
      case 'drawer-right':
        return { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };
      case 'drawer-left':
        return { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } };
      case 'fullscreen':
        return { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
      default:
        return { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.95 } };
    }
  };

  const animations = getAnimationVariants();

  return (
    <div
      className={cn(
        "fixed inset-0 flex p-4 md:p-6 lg:p-10 transition-all duration-300",
        config.type === 'center' && "items-center justify-center",
        config.type === 'drawer-right' && "justify-end items-stretch p-0",
        config.type === 'drawer-left' && "justify-start items-stretch p-0",
        config.type === 'fullscreen' && "p-0"
      )}
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => config.closeOnBackdropClick && onClose()}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        {...animations}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "relative bg-white shadow-2xl overflow-hidden flex flex-col",
          config.type === 'center' && cn("rounded-3xl w-full", sizeClass),
          config.type === 'drawer-right' && cn("w-full h-full rounded-l-3xl", sizeClass),
          config.type === 'drawer-left' && cn("w-full h-full rounded-r-3xl", sizeClass),
          config.type === 'fullscreen' && "w-full h-full",
          config.className
        )}
        style={{
          width: config.customWidth,
          height: config.customHeight,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BaseModal;
