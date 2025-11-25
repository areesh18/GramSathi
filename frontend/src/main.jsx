import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx' // Import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>  {/* Wrap App */}
      <App />
    </LanguageProvider>
  </StrictMode>,
)