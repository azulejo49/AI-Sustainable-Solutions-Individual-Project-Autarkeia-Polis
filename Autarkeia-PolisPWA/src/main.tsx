import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CityProvider } from './context/CityContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CityProvider>
      <App />
    </CityProvider>
  </StrictMode>,
);
