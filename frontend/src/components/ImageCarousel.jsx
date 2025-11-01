import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageCarousel = ({ images = [], autoSlide = true, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Auto-slide
  useEffect(() => {
    if (!autoSlide || images.length <= 1) return;
    const slideTimer = setInterval(goToNext, interval);
    return () => clearInterval(slideTimer);
  }, [currentIndex, autoSlide, interval, images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-800/70 rounded-2xl flex flex-col items-center justify-center text-gray-400">
        <div className="text-5xl mb-2">🖼️</div>
        <p className="text-gray-400 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[28rem] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
      {/* Smooth image transition */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute w-full h-full object-contain md:object-cover rounded-2xl"
        />
      </AnimatePresence>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition hover:scale-110"
          >
            ‹
          </button>

          <button
            onClick={goToNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition hover:scale-110"
          >
            ›
          </button>

          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  currentIndex === i
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
