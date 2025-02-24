import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import Header from '../Header';
import Chatbot from '../ChatBot';

const VoiceTranscriber = () => {
  const [data, setData] = useState({});
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location to extract query params
  const [isMobile, setIsMobile] = useState(false);

  // Function to get query parameters
  const getQueryParams = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  // Extract ISBN from query parameters
  const isbn = getQueryParams('isbn');

  useEffect(() => {
    // Fetching book details using the ISBN
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getbookrawdata/${isbn}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isbn) {
      fetchData();
    }
  }, [isbn]);

  // Toggle Chatbot visibility
  const toggleChatbot = () => {
    if (isMobile) {
      navigate('/chatbot');
    } else {
      setIsChatbotOpen(!isChatbotOpen);
    }
  };

  // Close Chatbot
  const closeChatbot = () => {
    setIsChatbotOpen(false);
    if (!isMobile) {
      console.log("Close chatbot on desktop");
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mt-5">
      <Header />
      <div className="card">
        <div className="card-body text-center">
          <div className="image-container">
            <img src={data.coverUrl} alt={data.imageAlt} className="img-fluid card-image" />
          </div>
          <div className="description-container">
            <h5 className="card-title">Name: {data.title}</h5>
            <p className="card-text">Author: {data.author}</p>
          </div>
        </div>
      </div>

      {/* Centered and Enlarged Voice Icon */}
      <div className="voice-icon">
        <button className="btn btn-primary voice-icon-style">
          <i className="bi bi-mic"></i>
        </button>
      </div>

      {/* Chat Button at the bottom-right */}
      <button
        className="btn btn-info chat-icon"
        onClick={toggleChatbot}
      >
        <i className="bi bi-chat chat-icon-style"></i>
      </button>

      {isChatbotOpen && !isMobile && (
        <div className="chatbot-box">
          <button className="close-chatbot" onClick={closeChatbot}>
            <i className="bi bi-x-lg"></i>
          </button>
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default VoiceTranscriber;
