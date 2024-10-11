// Slideshow.jsx
import React, { useState, useEffect } from "react";
import "./slideshow.css"; 

const Slideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Automatically change slides every 3 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 3000); // 3 seconds

    // Clear the interval when component unmounts
    return () => clearInterval(slideInterval);
  }, [currentIndex]); // Run the effect on `currentIndex` change

  return (
    <div className="slideshow-container">
      <div className="slideshow-image-container">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="slideshow-image"
        />
      </div>
      <button className="prev-button" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="next-button" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Slideshow;
