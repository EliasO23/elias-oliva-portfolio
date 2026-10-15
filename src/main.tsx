import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { NotFound } from './components/NotFound';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {[import.meta.env.BASE_URL, `${import.meta.env.BASE_URL}index.html`].includes(window.location.pathname) ? <App /> : <NotFound />}
  </React.StrictMode>,
);
