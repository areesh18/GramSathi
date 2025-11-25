import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    welcome: "Welcome",
    practice: "Practice Mode",
    login: "Login",
    guest: "Continue as Guest",
    offline_mode: "You are offline. Some features may be limited.",
    dashboard: "Dashboard",
    learn: "Learn",
    services: "Services"
  },
  hi: {
    welcome: "नमस्ते",
    practice: "अभ्यास मोड",
    login: "लॉग इन करें",
    guest: "गेस्ट के रूप में जारी रखें",
    offline_mode: "आप ऑफ़लाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।",
    dashboard: "डैशबोर्ड",
    learn: "सीखें",
    services: "सेवाएं"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);