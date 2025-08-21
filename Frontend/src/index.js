// index.js
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import App from './App';

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Create React root
const root = createRoot(rootElement);

// Render the app
root.render(<App />);

// Optional: Add error boundary for development
if (import.meta.env.DEV) {
  // Log any unhandled errors in development
  window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
  });

  // Log any unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}