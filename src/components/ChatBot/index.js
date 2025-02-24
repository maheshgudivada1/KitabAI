import React, { useState } from "react";
import "./index.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Function to send messages
  const handleSendMessage = (text = input) => {
    if (text.trim() === "") return;

    const userMessage = { type: "user", text };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = { type: "ai", text: "This is a simulated AI response." };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }, 1000);

    setInput("");
  };

  // Handler for pre-defined questions
  const handlePresetQuestion = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        <div className="preset-questions">
          <button onClick={() => handlePresetQuestion("Tell me the summary of the book")}>
            Tell me the summary of the book
          </button>
          <button onClick={() => handlePresetQuestion("Let’s have a Q&A from the book")}>
            Let’s have a Q&A from the book
          </button>
        </div>

        <div className="messages">
          {messages.map((message, index) => (
            
            <div
              key={index}
              className={`message ${message.type === "user" ? "user-message" : "ai-message"}`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a question..."
          />
          <button onClick={() => handleSendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
