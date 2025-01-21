import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (typeof document === "undefined") {
	console.log("index.tsx error: document was undefined");
}

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
