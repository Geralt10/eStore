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
      className="group flex flex-col bg-white rounded-2xl p-2.5 border border-slate-200/70 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
    >
      {/* Photo Container with Slider */}
      <div
        className="relative w-full aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden mb-3 select-none group/slider"
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
              className="min-w-full w-full h-full shrink-0 flex items-center justify-center bg-slate-100 overflow-hidden"
            >
              <img
                src={img.url || defaultImage}
                alt={img.name || `${product.title} - image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-110 active:scale-95 z-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
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
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-110 active:scale-95 z-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => handleDotClick(e, i)}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    currentIndex === i
                      ? "w-4 bg-white shadow-xs"
                      : "w-1.5 bg-white/60 hover:bg-white/90"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>

            {/* Slide Count Badge */}
            <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md z-10">
              {currentIndex + 1}/{displayImages.length}
            </span>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="px-1 pb-1 space-y-1">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h2>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs sm:text-sm font-bold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

