import './App.css';
import React from 'react';
import Header from "../Header";
import { Routes, Route } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from "react-router-dom";
import HomePage from '../HomePage/HomePage';
import AuthCallback from '../AuthCallback/AuthCallback';
import LoggedIn from '../LoggedIn/LoggedIn';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['userToken', 'loginState', 'username']);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    console.log(cookies);
    // if there is already a valid token go to main content
    if (cookies.userToken) {
      if (location.pathname !== '/logged_in') {
        navigate('/logged_in');
      }
    }
    else {
      if (location.pathname !== '/' && location.pathname !== '/homepage') {
        navigate('/homepage');
      }
    }
  });

  return (
    <div className="app">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Header />
        <div className='app-main-wrapper'>
          <Routes>
            {/* Due to the way the callback works, authorize callback needs to be the root directory (github pages will give 404 otherwise) */}
            <Route path="/" element={
              <>
                <AuthCallback cookies={cookies} setCookie={setCookie} removeCookie={removeCookie} />
              </>
            }/>
            <Route path="/homepage" element={
              <>
                <HomePage cookies={cookies} setCookie={setCookie} removeCookie={removeCookie} />
              </>
            }/>
            <Route path="/logged_in" element={
              <>
                <LoggedIn cookies={cookies} setCookie={setCookie} removeCookie={removeCookie} />
              </>
            }/>
          </Routes>
        </div>
    </div>
  );
}

export default App;
