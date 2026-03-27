import { useCallback, useEffect, useRef, useState } from 'react';

export default function useFloatingNotification() {
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hideNotification = useCallback(() => {
    clearTimer();
    setNotification(null);
  }, [clearTimer]);

  const showNotification = useCallback((payload) => {
    clearTimer();

    const nextNotification = {
      id: `${Date.now()}-${Math.random()}`,
      durationMs: 5000,
      ...payload,
    };

    setNotification(nextNotification);

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, nextNotification.durationMs);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    notification,
    showNotification,
    hideNotification,
  };
}
