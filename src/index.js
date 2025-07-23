import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="isam-optimus.us.auth0.com"
    clientId="SN4b809bEIMwBwJqC3yXvo99rxwjGPi8"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://isam-optimus.us.auth0.com/api/v2/"
    }}
    cacheLocation="memory" // Changes from localStorage to memory storage
    useRefreshTokens={true} // Enables silent authentication
    useRefreshTokensFallback={true} // Ensures it works in all browsers
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);