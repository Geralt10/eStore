import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

const PRESET_COLORS = [
  { name: "Beige", hex: "#ded8cb", border: "#cfc6b6" },
  { name: "Black", hex: "#18181b", border: "#09090b" },
  { name: "Olive", hex: "#5d674b", border: "#4a533b" },
  { name: "Slate Grey", hex: "#8a9099", border: "#757c85" },
  { name: "White", hex: "#ffffff", border: "#e4e4e7" },
];

const PRESET_SIZES = ["S", "M", "L", "XL"];

export default function ProductInfo({ product, onAddToCart }) {
  const variants = useMemo(() => {
    return product?.varients || product?.variants || [];
  }, [product]);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Extract available sizes from variants or fallback
  const availableSizes = useMemo(() => {
    const sizes = new Set();
    variants.forEach((v) => {
      const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
      if (attrs.size) sizes.add(attrs.size.toUpperCase());
    });
    return sizes.size > 0 ? Array.from(sizes) : PRESET_SIZES;
  }, [variants]);

  // Extract available colors from variants or fallback
  const availableColors = useMemo(() => {
    const colors = [];
    const seen = new Set();
    variants.forEach((v) => {
      const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
      if (attrs.color && !seen.has(attrs.color.toLowerCase())) {
        seen.add(attrs.color.toLowerCase());
        const match = PRESET_COLORS.find((c) => c.name.toLowerCase() === attrs.color.toLowerCase());
        colors.push({
          name: attrs.color,
          hex: match?.hex || "#ded8cb",
          border: match?.border || "#cfc6b6",
        });
      }
    });
    return colors.length > 0 ? colors : PRESET_COLORS;
  }, [variants]);

  // State
  const [selectedSize, setSelectedSize] = useState(availableSizes[1] || availableSizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.name || "Beige");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 639px)").matches);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateViewport = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  // Find matching variant based on size & color
  const currentVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find((v) => {
        const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
        const matchSize = !attrs.size || attrs.size.toUpperCase() === selectedSize.toUpperCase();
        const matchColor = !attrs.color || attrs.color.toLowerCase() === selectedColor.toLowerCase();
        return matchSize && matchColor;
      }) || variants[0]
    );
  }, [variants, selectedSize, selectedColor]);

  // Resolve Images: variant images > product images. Never render placeholder product photos.
  const images = useMemo(() => {
    const rawList = currentVariant?.images?.length
      ? currentVariant.images
      : product?.image?.length
      ? product.image
      : product?.images?.length
      ? product.images
      : [];

    const mapped = rawList.map((item) => (typeof item === "string" ? item : item.url)).filter(Boolean);

    return mapped;
  }, [currentVariant, product]);

  // Stock calculation
  const stock = useMemo(() => {
    if (currentVariant && currentVariant.stock !== undefined) {
      return Number(currentVariant.stock) || 0;
    }
    return 20; // Default matching screenshot "(20 available)"
  }, [currentVariant]);

  // Price calculation
  const priceDisplay = useMemo(() => {
    const amount =
      currentVariant?.priceOverride?.amount ??
      product?.price?.amount ??
      product?.priceAmount ??
      799;
    const currency =
      currentVariant?.priceOverride?.currency ||
      product?.price?.currency ||
      product?.priceCurrency ||
      "INR";
    const symbol = CURRENCY_SYMBOLS[currency] || "₹";
    return `${symbol}${Number(amount).toLocaleString()}`;
  }, [currentVariant, product]);

  // Category
  const categoryName = useMemo(() => {
    if (currentVariant?.attributes) {
      const attrs = currentVariant.attributes instanceof Map
        ? Object.fromEntries(currentVariant.attributes)
        : currentVariant.attributes;
      if (attrs.category) return attrs.category.toUpperCase();
    }
    return "T-SHIRTS";
  }, [currentVariant]);

  // Handlers
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (stock > 0 && next > stock) {
        toast.error(`Only ${stock} items available in stock`);
        return prev;
      }
      return next;
    });
  };

  const handleAddToCartClick = async () => {
    if (stock <= 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await onAddToCart({
        productId: product?._id,
        variantId: currentVariant?._id || currentVariant?.id,
        quantity,
      });
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Added to Wishlist");
      } else {
        toast("Removed from Wishlist");
      }
      return next;
    });
  };

  const galleryIndex = Math.min(selectedImageIndex, Math.max(images.length - 1, 0));
  const activeMainImage = images[galleryIndex] || null;
  const moveImage = (direction) => {
    if (images.length < 2) return;
    setSelectedImageIndex((current) => (current + direction + images.length) % images.length);
  };

  const handleTouchStart = (event) => {
    if (!isMobile) return;
    touchStartRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (!isMobile) return;
    const startX = touchStartRef.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartRef.current = null;
    if (startX === null || endX === undefined || Math.abs(startX - endX) < 40) return;
    moveImage(startX > endX ? 1 : -1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start font-sans">
      
      {/* LEFT COLUMN: Gallery with Vertical Thumbnails and Hero Image */}
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        
        {/* Thumbnails list (5 thumbnails) */}
        <div className="flex sm:flex-col gap-2 shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none">
          {images.map((imgUrl, index) => {
            const isSelected = selectedImageIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-14 h-18 sm:w-16 sm:h-[4.75rem] rounded-xl overflow-hidden bg-zinc-100 transition-all cursor-pointer p-0.5 ${
                  isSelected
                    ? "ring-2 ring-zinc-950 shadow-sm"
                    : "border border-zinc-200/80 hover:border-zinc-400 opacity-80 hover:opacity-100"
                }`}
                aria-label={`Select product image view ${index + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg pointer-events-none"
                />
              </button>
            );
          })}
        </div>

        {/* Main Display Image */}
        <div
          className="relative flex-1 aspect-square sm:aspect-[4/5] bg-[#f4f4f5] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-xs"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out sm:block"
            style={{ transform: isMobile ? `translateX(-${galleryIndex * 100}%)` : `translateY(-${galleryIndex * 100}%)` }}
          >
            {images.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="flex h-full w-full shrink-0 items-center justify-center">
                <img
                  src={imageUrl}
                  alt={`${product?.title || "Product"} view ${index + 1}`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] sm:object-cover"
                />
              </div>
            ))}
          </div>
          {!activeMainImage && <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-zinc-500">Product image unavailable</div>}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => moveImage(-1)}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-800 opacity-0 shadow-md transition-all hover:bg-white hover:scale-105 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                aria-label="Previous product image"
                title="Previous image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveImage(1)}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-800 opacity-0 shadow-md transition-all hover:bg-white hover:scale-105 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                aria-label="Next product image"
                title="Next image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen Expand Button matching bottom-right circle in screenshot */}
          {activeMainImage && <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white text-zinc-800 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
            title="Expand image"
            aria-label="Expand image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15m-11.25 5.25h4.5m-4.5 0v-4.5m0 4.5L9 15"
              />
            </svg>
          </button>}
        </div>
      </div>

      {/* RIGHT COLUMN: Product Info & Actions */}
      <div className="lg:col-span-5 flex flex-col pt-0">
        
        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight leading-tight">
          {product?.title || "Luck 100% Cotton T-Shirt"}
        </h1>

        {/* Price */}
        <div className="mt-3 text-xl font-bold text-zinc-950 tracking-tight">
          {priceDisplay}
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-zinc-500 leading-relaxed line-clamp-3">
          {product?.description ||
            "100% Cotton T-shirt with a bold graphic print and oversized fit, offering unmatched casual comfort and timeless streetwear aesthetics."}
        </p>

        {/* Subtle separator */}
        <div className="border-t border-zinc-100 my-4" />

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-zinc-950 mb-1.5">
            Category
          </label>
          <span className="inline-block bg-zinc-100 text-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-md tracking-wider">
            {categoryName}
          </span>
        </div>

        {/* Color */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-zinc-950 mb-2">
            Color
          </label>
          <div className="flex items-center gap-3">
            {availableColors.map((col) => {
              const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase();
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColor(col.name)}
                  className={`relative w-7.5 h-7.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-zinc-950 ring-offset-2 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: col.hex,
                    boxShadow: col.border ? `inset 0 0 0 1px ${col.border}` : "inset 0 0 0 1px #e4e4e7",
                  }}
                  title={col.name}
                  aria-label={`Select color ${col.name}`}
                />
              );
            })}
          </div>
        </div>

        {/* Size */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-zinc-950 mb-2">
            Size
          </label>
          <div className="flex items-center gap-2.5">
            {availableSizes.map((sz) => {
              const isSelected = selectedSize.toUpperCase() === sz.toUpperCase();
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`min-w-[42px] px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-zinc-950 text-zinc-950 font-semibold shadow-xs"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* In Stock & Quantity */}
        <div className="mt-4">
          <div className="text-xs font-bold text-zinc-950">
            {stock > 0 ? (
              <>
                In Stock <span className="font-normal text-zinc-500">({stock} available)</span>
              </>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Stepper matching screenshot */}
          <div className="mt-2 inline-flex items-center bg-zinc-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || stock <= 0}
              className="w-8 h-8 rounded flex items-center justify-center text-sm text-zinc-700 hover:bg-zinc-200/80 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer select-none"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-semibold text-zinc-950 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={stock > 0 && quantity >= stock}
              className="w-8 h-8 rounded flex items-center justify-center text-sm text-zinc-700 hover:bg-zinc-200/80 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer select-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons: Add to Cart + Add to Wishlist */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-2.5">
          
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={addingToCart || stock <= 0}
            className="flex-1 bg-zinc-950 hover:bg-black active:scale-[0.99] text-white py-3 px-5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingToCart ? (
              <span className="inline-block animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 stroke-[2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
            )}
            <span>{stock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>

          {/* Add to Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`py-3 px-5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              isWishlisted
                ? "bg-zinc-50 border-zinc-900 text-zinc-950"
                : "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-current"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
          </button>

        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-900/70 hover:bg-zinc-950 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={activeMainImage}
              alt="Zoomed product view"
              className="max-h-[82vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
