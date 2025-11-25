import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-gray-900 text-white text-xs font-bold py-2 px-4 text-center fixed bottom-16 md:bottom-0 left-0 w-full z-[100] flex items-center justify-center gap-2 animate-pulse">
      <WifiOff size={14} />
      You are offline. Practice Mode is active.
    </div>
  );
};

export default OfflineBanner;