import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { setupServiceWorker } from './pwaRegister';
import './index.css';

// Initialize PWA Service Worker for offline capability
setupServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary isRoot sectionName="Aplicação Principal">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
