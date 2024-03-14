import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from 'app';
import { getConfig } from "./config";

const config = getConfig();

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={"http://localhost:3001/admin/default"}
      audience={config.audience}
      scope="read:current_user update:current_user_metadata"
    >
        <App />
      </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
