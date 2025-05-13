import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';

function Root() {
  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')  // Register sw.js from the public folder
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
