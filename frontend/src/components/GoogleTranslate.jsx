import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // This ensures the widget re-initializes if the component remounts
    if (window.google && window.google.translate) {
      // Sometimes needed to refresh the widget styles
    }
  }, []);

  return (
    <div className="google-translate-container">
      {/* This id matches the script in index.html */}
      <div id="google_translate_element"></div> 
    </div>
  );
};

export default GoogleTranslate;