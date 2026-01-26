import React, { useEffect, useCallback } from 'react';
import { useTableContext } from '../context';

export function TableModal() {
  const { isModalOpen, modalContent, closeModal } = useTableContext();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, handleKeyDown]);

  if (!isModalOpen || !modalContent) {
    return null;
  }

  return (
    <div
      className="bt-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bt-modal bt-modal-md">
        <div className="bt-modal-header">
          <h2 className="bt-modal-title">Detalles</h2>
          <button
            className="bt-modal-close"
            onClick={closeModal}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="bt-modal-body">{modalContent}</div>
      </div>
    </div>
  );
}
