import { useState, useCallback } from 'react';

export const useModalParams = (defaultOpen = false, defaultParam = null) => {
  const [isModalOpen, setIsModalOpen] = useState(defaultOpen);
  const [modalParam, setModalParam] = useState(defaultParam);

  const openModal = useCallback((param = null) => {
    setModalParam(param);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback((clearParam) => {
    setIsModalOpen(false);
    if (clearParam) {
      setModalParam(null);
    }
  }, []);

  const updateModalParam = useCallback((param) => {
    setModalParam(param);
  }, []);

  return [isModalOpen, modalParam, openModal, closeModal, updateModalParam];
}
