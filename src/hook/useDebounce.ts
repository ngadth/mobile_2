import { useEffect, useState, useCallback } from 'react';

const useDebounce = <T extends any[]>(callback: (...args: T) => void, delay: number): ((...args: T) => void) => {
  const [debouncedCallback, setDebouncedCallback] = useState<(...args: T) => void>(callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);

  return useCallback(debouncedCallback, []);
};

export default useDebounce;
