import './App.css';
import React from 'react';
import Header from "../Header";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from '../HomePage/HomePage';
import AuthCallback from '../AuthCallback/AuthCallback';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HomePage />
            </>
          }/>
          <Route path="/authorize_callback" element={
            <>
              <AuthCallback />
            </>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
