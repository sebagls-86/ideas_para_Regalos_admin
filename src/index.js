import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import { TokenProvider } from './contexts/TokenContext';

ReactDOM.render(
  <React.StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>,
  document.getElementById('root')
);