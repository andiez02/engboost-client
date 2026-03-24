import React, { createContext, useReducer, ReactNode, useMemo } from 'react';
import { ModalInstance, ModalOptions } from './types';

interface ModalContextType {
  modals: ModalInstance[];
  openModal: <T>(component: React.ComponentType<T>, props?: T, options?: ModalOptions) => string;
  openModalAsync: <T, R = any>(component: React.ComponentType<T>, props?: T, options?: ModalOptions) => Promise<R>;
  closeModal: (id?: string, result?: any) => void;
  closeAllModals: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalAction =
  | { type: 'OPEN_MODAL'; payload: ModalInstance }
  | { type: 'CLOSE_MODAL'; payload: { id: string } }
  | { type: 'CLOSE_ALL' };

function modalReducer(state: ModalInstance[], action: ModalAction): ModalInstance[] {
  switch (action.type) {
    case 'OPEN_MODAL':
      return [...state, action.payload];
    case 'CLOSE_MODAL':
      return state.filter((m) => m.id !== action.payload.id);
    case 'CLOSE_ALL':
      return [];
    default:
      return state;
  }
}

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, dispatch] = useReducer(modalReducer, []);

  const openModal = <T,>(
    component: React.ComponentType<T>,
    props?: T,
    options?: ModalOptions
  ): string => {
    const id = Math.random().toString(36).substring(2, 9);
    dispatch({
      type: 'OPEN_MODAL',
      payload: { id, component, props, options } as ModalInstance,
    });
    return id;
  };

  const openModalAsync = <T, R = any>(
    component: React.ComponentType<T>,
    props?: T,
    options?: ModalOptions
  ): Promise<R> => {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(2, 9);
      dispatch({
        type: 'OPEN_MODAL',
        payload: { id, component, props, options, resolve, reject } as ModalInstance,
      });
    });
  };

  const closeModal = (id?: string) => {
    const targetId = id || (modals.length > 0 ? modals[modals.length - 1].id : null);
    if (!targetId) return;

    dispatch({ type: 'CLOSE_MODAL', payload: { id: targetId } });
  };

  const closeAllModals = () => {
    modals.forEach((m) => m.reject?.('All modals closed'));
    dispatch({ type: 'CLOSE_ALL' });
  };

  const value = useMemo(
    () => ({
      modals,
      openModal,
      openModalAsync,
      closeModal,
      closeAllModals,
    }),
    [modals]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
