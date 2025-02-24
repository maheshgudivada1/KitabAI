import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import { gapi } from 'gapi-script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import About from './components/About';
import Dashboard from './components/AdminDashboard';
import BookStore from './components/AdminBookStore';
import DatasetApp from './components/Dataset';
import VoiceTranscriber from './components/VoiceTranscriber';
import ChatBot from './components/ChatBot';
const clientId = "818623730310-suqadla5gshddsh7iipagqihufgrq8s9.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      });
    }
    gapi.load('client:auth2', start);
  }, []); // Add empty dependency array to avoid reinitializing gapi

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ConditionalLayout>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/voice-transcriber" element={<VoiceTranscriber />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/admin-book-store' element={<BookStore />} />
          <Route path='/admin-dataset' element={<DatasetApp />} />
          <Route path="/chatbot" element={<ChatBot/>}/>

        </Routes>
      </ConditionalLayout>
    </GoogleOAuthProvider>
  );
}

function ConditionalLayout({ children }) {
  const location = useLocation();

  // Define routes where the layout should be hidden
  const routesWithoutLayout = [
    '/',
    '/about',
  ];

  // Check if the current path matches any of the routes without layout
  const shouldHideLayout = routesWithoutLayout.some(route => {
    const match = new RegExp(`^${route.replace(/:\w+/g, '[^/]+')}$`).test(location.pathname);
    return match;
  });

  return (
    <div className="app">
      {!shouldHideLayout && <Header />}
      <div className="main-body-container">
        {children}
      </div>
    </div>
  );
}

export default App;