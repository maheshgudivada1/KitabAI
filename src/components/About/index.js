import React from 'react';
import './index.css'; // Import the corresponding CSS file

const About = () => {
  return (
    <div className="about-container">
      {/* Top Image */}
      <div className="image-container">
        <img src="https://www.aitota.com/static/media/Vijay%20Kumar%20Circular.525699addc1ebbf83c68.png" alt="Founder" className="about-image" />
      </div>

      {/* Top Heading */}
      <h1 className="about-heading">Vijay Kumar Singh</h1>

      {/* Subheading */}
      <h2 className="about-subheading">Founder - KitabAI.com</h2>
      <h3 className="about-subheading">Mobishaala.com</h3>
      <h4 className="about-subheading">Ex-Intel</h4>

      {/* About the Founder Section */}
      <div className="about-description-container">
        <h2 className="description-heading">About the Founder</h2>
        <p className="description-text">
          KitabAI is revolutionizing the way we interact with books through cutting-edge conversational AI, enabling
          students and teachers to talk to books, solve doubts, and engage in deeper, more meaningful conversations. Our
          mission is to transform the publication industry by making learning and storytelling interactive and
          accessible. At KitabAI, we are dedicated to leveraging technology to bridge the gap between readers and
          knowledge, creating a world where books talk back and inspire higher degrees of understanding and engagement.
        </p>
      </div>
    </div>
  );
};

export default About;
