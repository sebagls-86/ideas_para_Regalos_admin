import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from 'app';
import { getConfig } from "./config";
import "../src/assets/css/App.css";


const config = getConfig();

const redirectUri = process.env.NODE_ENV === 'production' ? 'https://ideas-para-regalos-admin.vercel.app/admin/default' : 'http://localhost:3000/admin/default';

console.log(redirectUri)

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={redirectUri}
      audience={config.audience}
      scope="read:current_user update:current_user_metadata"
    >
        <App />
      </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
