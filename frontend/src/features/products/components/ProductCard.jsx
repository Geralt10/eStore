import React, { useState } from "react";
import { Link } from "react-router";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export default function ProductCard({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Normalize images
  const rawImages = product?.image || product?.images || [];
  const images = Array.isArray(rawImages)
    ? rawImages.map((img) => (typeof img === "string" ? { url: img } : img))
    : [];

  const defaultImage =
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";

  const displayImages =
    images.length > 0 ? images : [{ url: defaultImage, name: product?.title }];

  const formatPrice = (priceObj) => {
    if (!priceObj) return "₹0";
    const amount = priceObj.amount ?? 0;
    const currency = priceObj.currency || "INR";
    const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // Touch Swipe
  const minSwipeDistance = 40;
  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < displayImages.length - 1) {
      e.preventDefault();
      setCurrentIndex((prev) => prev + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      e.preventDefault();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex flex-col bg-transparent transition-all duration-300"
    >
      {/* Photo Container with Slider */}
      <div
        className="relative w-full aspect-[3/4] rounded-sm bg-slate-100/90 overflow-hidden mb-2.5 select-none group/slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Images Track */}
        <div
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {displayImages.map((img, index) => (
            <div
              key={index}
              className="min-w-full w-full h-full shrink-0 flex items-center justify-center bg-slate-100/90 overflow-hidden"
            >
              <img
                src={img.url || defaultImage}
                alt={img.name || `${product.title} - image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out pointer-events-none"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Carousel Controls (if multiple images) */}
        {displayImages.length > 1 && (
          <>
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs backdrop-blur-md transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-105 active:scale-95 z-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs backdrop-blur-md transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-105 active:scale-95 z-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => handleDotClick(e, i)}
                  className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                    currentIndex === i
                      ? "w-3.5 bg-white shadow-xs"
                      : "w-1 bg-white/60 hover:bg-white/90"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>

            {/* Slide Count Badge */}
            <span className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10">
              {currentIndex + 1}/{displayImages.length}
            </span>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="px-0.5 space-y-1">
        <h3 className="font-sans text-xs sm:text-sm font-normal text-slate-800 line-clamp-1 group-hover:text-slate-950 transition-colors leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-sans text-xs sm:text-sm font-medium text-slate-900">
            {formatPrice(product.price)}
          </span>
          <span className="font-sans text-[11px] font-normal text-slate-400 group-hover:text-slate-700 transition-colors inline-flex items-center gap-0.5">
            View
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

