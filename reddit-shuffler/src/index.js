import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from "react-router-dom";

const localhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <BrowserRouter basename={localhost ? '' : '/reddit-saved-shuffler'}>
        <App />
      </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
