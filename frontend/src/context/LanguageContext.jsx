import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Auth
    welcome: "Welcome",
    login: "Login",
    guest: "Continue as Guest",
    offline_mode: "You are offline. Using limited mode.",
    
    // Navigation
    dashboard: "Dashboard",
    practice: "Practice",
    learn: "Learn",
    admin: "Admin",
    profile: "Profile",
    logout: "Logout",
    
    // Headings
    daily_challenge: "Daily Challenge",
    update: "Govt Update",
    quick_services: "Quick Services",
    
    // Services
    schemes: "Gov Schemes",
    doctors: "Find Doctor",
    mandi: "Mandi Prices",
    land: "Land Records",
    job: "Job Card",
    complaint: "Complaint"
  },
  hi: {
    // Auth
    welcome: "नमस्ते",
    login: "लॉग इन करें",
    guest: "गेस्ट मोड (बिना इंटरनेट)",
    offline_mode: "आप ऑफ़लाइन हैं। सीमित मोड सक्रिय है।",
    
    // Navigation
    dashboard: "होम",
    practice: "अभ्यास",
    learn: "सीखें",
    admin: "एडमिन",
    profile: "प्रोफ़ाइल",
    logout: "लॉग आउट",
    
    // Headings
    daily_challenge: "आज की चुनौती",
    update: "सरकारी अपडेट",
    quick_services: "सुविधाएं",
    
    // Services
    schemes: "योजनाएं",
    doctors: "डॉक्टर खोजें",
    mandi: "मंडी भाव",
    land: "जमीन का रिकॉर्ड",
    job: "जॉब कार्ड",
    complaint: "शिकायत"
  }
};

export const LanguageProvider = ({ children }) => {
  // 1. Initialize from localStorage if available
  const [lang, setLangState] = useState(localStorage.getItem('app_lang') || 'en');

  // 2. Wrapper to save to localStorage whenever lang changes
  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);