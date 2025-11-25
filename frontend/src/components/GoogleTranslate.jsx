import React, { useEffect, useState } from 'react';

const GoogleTranslate = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    if (window.google && window.google.translate && isOnline) {
       // Widget logic
    }

    return () => {
        window.removeEventListener('online', handleStatus);
        window.removeEventListener('offline', handleStatus);
    }
  }, [isOnline]);

  // If offline, don't render the div that triggers the script request
  if (!isOnline) return null;

  return (
    <div className="google-translate-container">
      <div id="google_translate_element"></div> 
    </div>
  );
};

export default GoogleTranslate;