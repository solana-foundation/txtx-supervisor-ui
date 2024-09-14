import { useState, useEffect } from 'react';

export default function usePageVisibility() {
  const [isBrowserTabHidden, setIsBrowserTabHidden] = useState(document.hidden);
  const [hasPageLoaded, setHasPageLoaded] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (hasPageLoaded) {
        setIsBrowserTabHidden(document.hidden);
      }
    };

    setHasPageLoaded(true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasPageLoaded]);

  return isBrowserTabHidden;
}
