import React from 'react';
import { useModal } from '../useModal';
import { TriangleAlert } from 'lucide-react';
import { cn } from '../utils/cn';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
}) => {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    closeModal(undefined, true);
  };

  const handleCancel = () => {
    closeModal(undefined, false);
  };

  const colors = {
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          type === 'danger' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
        )}>
          <TriangleAlert size={24} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 font-medium">Please confirm your choice</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 flex-grow">
        <p className="text-gray-600 leading-relaxed font-medium">{message}</p>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-all duration-200"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={cn(
            "px-6 py-2.5 rounded-xl font-extrabold shadow-lg shadow-black/5 active:scale-95 transition-all duration-200",
            colors[type]
          )}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
