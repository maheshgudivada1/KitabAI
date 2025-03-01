import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import { gapi } from 'gapi-script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import About from './components/About';
import Dashboard from './components/AdminDashboard';
import BookStore from './components/AdminBookStore';
import DatasetApp from './components/Dataset';
import VoiceTranscriber from './components/VoiceTranscriber';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './Context/UserContext';
const clientId = "126357156450-tqno9kgndoft3nnbm56of9k9bj8sbrdc.apps.googleusercontent.com";

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
      <UserProvider>
        <ConditionalLayout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/voice-transcriber" element={<VoiceTranscriber />} />
            <Route path="/about" element={<About />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/admin-book-store' element={<BookStore />} />
              <Route path='/admin-dataset' element={<DatasetApp />} />
            </Route>
            <Route path="/chatbot" element={<ChatBot />} />
          </Routes>
        </ConditionalLayout>
      </UserProvider>
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