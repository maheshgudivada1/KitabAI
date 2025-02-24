import React, { useState, useEffect } from 'react';
import './index.css';

const CarouselControlled = () => {
  const images = [
    "https://i.ytimg.com/vi/Q87ioFaNKCs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDBqXEc2P4uxNE-NymwVg9dEbXrGg",
    'https://www.iasgyan.in//ig-uploads/images//BBV.png', 
    'https://cdn1.byjus.com/wp-content/uploads/2018/11/free-ias-prep/2016/02/12110421/books_banner.jpg', 
    'https://www.upscprep.com/content/images/size/w600/2022/06/Booklist.jpg', 
    'https://cdn1.byjus.com/wp-content/uploads/2018/11/free-ias-prep/2018/06/11140550/Complete-List-of-NCERT-Books-Needed-for-UPSC-Preparation.png', 
    'https://pluspramesh.in/wp-content/uploads/2022/09/UPSC-Topper-Books-General-Studies.jpg',
    "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/e4ed2308-433b-43b3-ae52-55a048414e78.jpg",
    'https://data.testprepkart.com/micro_media/Best%20Books%20To%20Prepare%20For%20NEET%20Examination.png', 
    "https://i.ytimg.com/vi/Q87ioFaNKCs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDBqXEc2P4uxNE-NymwVg9dEbXrGg",
    'https://www.iasgyan.in//ig-uploads/images//BBV.png', 
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // Empty dependency array to ensure effect runs once

  return (
    <div className="carousel-container1">
      <div className="carousel">
        <img
          src={process.env.PUBLIC_URL + images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="carousel-image"
        />
      </div>

      {/* Dots Navigation */}
      <div className="dots-container">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CarouselControlled;
