import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import Toast from '../components/toast/Toast';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [confirmationModal, setConfirmationModal] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    type: 'default',
    onConfirm: null,
    onCancel: null
  });

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
    duration: 3000
  });

  const showConfirmation = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmationModal({
        visible: true,
        title: options.title || '',
        message: options.message || '',
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        type: options.type || 'default',
        onConfirm: () => {
          setConfirmationModal(prev => ({ ...prev, visible: false }));
          resolve(true);
          if (options.onConfirm) {
            options.onConfirm();
          }
        },
        onCancel: () => {
          setConfirmationModal(prev => ({ ...prev, visible: false }));
          resolve(false);
          if (options.onCancel) {
            options.onCancel();
          }
        }
      });
    });
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({
      visible: true,
      message,
      type,
      duration
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const value = {
    showConfirmation,
    showToast,
    hideToast
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ConfirmationModal
        visible={confirmationModal.visible}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

