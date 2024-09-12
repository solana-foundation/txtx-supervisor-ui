import { useState, useEffect } from 'react';

export default function usePageVisibility() {
  const [isHidden, setIsHidden] = useState(document.hidden);
  const [hasPageLoaded, setHasPageLoaded] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (hasPageLoaded) {
        setIsHidden(document.hidden);
      }
    };

    setHasPageLoaded(true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasPageLoaded]);

  return isHidden;
}
