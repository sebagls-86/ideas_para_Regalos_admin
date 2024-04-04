import React from 'react';

function ErrorPage({ error }) {
  return (
    <div className="error-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <img src="https://media.giphy.com/media/YyKPbc5OOTSQE/giphy.gif" alt="Error GIF" />
      <h1>¡Oops!</h1>
      <p>Algo salió mal.</p>
      <p>No te preocupes, estamos trabajando para solucionarlo.</p>
      {error && <p>Mensaje de error: {error.message}</p>}
    </div>
  );
}

export default ErrorPage;
