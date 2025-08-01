import { useEffect } from 'react';

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function listener(event) {
      // Do nothing if clicking ref's
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
