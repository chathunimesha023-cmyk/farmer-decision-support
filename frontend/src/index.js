import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App'; // මෙතන .jsx කියලා තියෙනවාද බලන්න

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);