import React, { useState } from 'react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // If there are no images or only one, don't render the carousel controls
  if (!images || images.length === 0) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Main Image */}
      <div className="w-full h-full bg-cover bg-center transition-transform duration-500" style={{ backgroundImage: `url(${images[currentIndex]})` }}>
      </div>

      {/* Left Arrow */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 focus:outline-none"
        >
          &#10094;
        </button>
      )}

      {/* Right Arrow */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 focus:outline-none"
        >
          &#10095;
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                currentIndex === slideIndex ? 'bg-white' : 'bg-gray-400'
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;