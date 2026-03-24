import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useModal } from './useModal';
import BaseModal from './components/BaseModal';

const ModalContainer: React.FC = () => {
  const { modals, closeModal } = useModal();

  return (
    <div id="modal-portal-root">
      <AnimatePresence>
        {modals.map((modal, index) => {
          const Component = modal.component;
          return (
            <BaseModal
              key={modal.id}
              id={modal.id}
              options={modal.options}
              zIndex={1000 + index * 10}
              onClose={(result) => {
                if (modal.resolve) modal.resolve(result);
                closeModal(modal.id);
              }}
            >
              <Component {...modal.props} />
            </BaseModal>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ModalContainer;
