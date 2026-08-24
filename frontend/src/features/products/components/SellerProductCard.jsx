import React, { useState } from "react";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export default function SellerProductCard({
  product,
  badgeText = "Live",
  footerText = "Manage",
  onFooterClick,
  externalIndex,
  onExternalIndexChange,
}) {
  // Support both internal state (for Dashboard grid) and external control (for CreateProduct preview)
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled =
    typeof externalIndex === "number" &&
    typeof onExternalIndexChange === "function";
  const currentIndex = isControlled ? externalIndex : internalIndex;

  const setCurrentIndex = (idx) => {
    if (isControlled) {
      onExternalIndexChange(idx);
    } else {
      setInternalIndex(idx);
    }
  };

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Normalize images
  const rawImages = product?.image || product?.images || [];
  const images = Array.isArray(rawImages)
    ? rawImages.map((img) => (typeof img === "string" ? { url: img } : img))
    : [];

  const title = product?.title?.trim() || "Untitled Product";
  const description =
    product?.description?.trim() || "No description provided.";

  const priceAmount =
    product?.price?.amount ?? product?.priceAmount ?? 0;
  const currencyCode =
    product?.price?.currency || product?.priceCurrency || "INR";
  const currencySymbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode || "₹";

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
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

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Media Carousel Box */}
      <div
        className="relative aspect-4/3 bg-slate-100 overflow-hidden select-none group/media"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <>
            {/* Sliding Images Track */}
            <div
              className="flex h-full w-full transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="min-w-full w-full h-full shrink-0 flex items-center justify-center bg-slate-100 overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={img.name || `${title} slide ${index + 1}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows (Shown on hover if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover/media:opacity-100 hover:scale-105 active:scale-95 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
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

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover/media:opacity-100 hover:scale-105 active:scale-95 z-10 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
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

                {/* Dot Indicators */}
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === i
                          ? "w-5 bg-white shadow-xs"
                          : "w-1.5 bg-white/60 hover:bg-white/90"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Photo Count Badge */}
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs z-10">
                  {currentIndex + 1} / {images.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="text-center p-6 text-slate-400 w-full h-full flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 mx-auto stroke-slate-300 stroke-1 mb-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs font-medium">No images uploaded</span>
          </div>
        )}

        {/* Top Badge */}
        {badgeText && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-xs z-10">
            {badgeText}
          </span>
        )}
      </div>

      {/* Mini Thumbnail Row (Under Preview) */}
      {images.length > 1 && (
        <div className="px-5 pt-3 pb-1 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative shrink-0 w-10 h-10 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                currentIndex === index
                  ? "border-slate-900 ring-2 ring-slate-900/30 opacity-100 shadow-xs"
                  : "border-slate-200 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-black transition-colors">
              {title}
            </h4>
            <span className="text-base font-semibold text-slate-900 shrink-0">
              {currencySymbol} {Number(priceAmount).toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
            {description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{images.length} photo(s) attached</span>
          <button
            type="button"
            onClick={onFooterClick}
            className="text-slate-800 font-medium text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
          >
            {footerText}
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
        </div>
      </div>
    </div>
  );
}
