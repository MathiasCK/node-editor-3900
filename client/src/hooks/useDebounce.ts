import { useRef } from 'react';

const useDebounce = (
  callback: (value: string) => void,
  delay: number
): ((value: string) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (value: string) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

export default useDebounce;
