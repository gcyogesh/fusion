// hooks/usePopup.ts
import { useState, useCallback } from "react";

export function usePopup() {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback(() => setIsOpen(true), []);
  const closePopup = useCallback(() => setIsOpen(false), []);
  const togglePopup = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openPopup,
    closePopup,
    togglePopup,
  };
}
