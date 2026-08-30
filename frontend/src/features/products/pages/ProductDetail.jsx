import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

function formatPrice(priceObj) {
  if (!priceObj) return "₹0";
  const amount = priceObj.amount ?? priceObj ?? 0;
  const currency = priceObj.currency || "INR";
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${Number(amount).toLocaleString()}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Track selected value per attribute key (e.g. {size:"M", color:"Blue"})
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const SWIPE_THRESHOLD = 40;

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await handleGetProduct(id);
      if (data) setProduct(data);
      setLoading(false);
    }
    if (id) fetch();
  }, [id]);

  const variants = product?.varients || product?.variants || [];

  // Build unique attribute keys + values from all variants
  const attrOptions = useMemo(() => {
    const map = {};
    variants.forEach((v) => {
      const attrs = v.attributes instanceof Map
        ? Object.fromEntries(v.attributes)
        : typeof v.attributes === "object" && v.attributes
        ? v.attributes
        : {};
      Object.entries(attrs).forEach(([key, val]) => {
        if (!map[key]) map[key] = new Set();
        map[key].add(String(val));
      });
    });
    // Convert Sets to sorted arrays
    return Object.fromEntries(
      Object.entries(map).map(([k, s]) => [k, [...s]])
    );
  }, [variants]);

  // Auto-select the first variant's attrs on load
  useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedAttrs).length === 0) {
      const firstAttrs = variants[0].attributes instanceof Map
        ? Object.fromEntries(variants[0].attributes)
        : variants[0].attributes || {};
      setSelectedAttrs(firstAttrs);
    }
  }, [variants]);

  // Derive the best matching variant from selectedAttrs
  useEffect(() => {
    if (!variants.length) { setSelectedVariant(null); return; }
    const match = variants.find((v) => {
      const attrs = v.attributes instanceof Map
        ? Object.fromEntries(v.attributes)
        : v.attributes || {};
      return Object.entries(selectedAttrs).every(
        ([k, val]) => String(attrs[k]) === String(val)
      );
    });
    setSelectedVariant(match || null);
    setSelectedImage(0); // reset image when variant changes
  }, [selectedAttrs, variants]);

  // Images: use selected variant's images if any, else product images
  const productImages = useMemo(() => {
    const raw = product?.image || product?.images || [];
    return Array.isArray(raw)
      ? raw.map((i) => (typeof i === "string" ? { url: i } : i))
      : [];
  }, [product]);

  const variantImages = useMemo(() => {
    const imgs = selectedVariant?.images || [];
    return imgs.filter((i) => i?.url);
  }, [selectedVariant]);

  const displayImages =
    variantImages.length > 0 ? variantImages : productImages.length > 0
      ? productImages
      : [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80" }];

  // Price: variant override or product base
  const displayPrice = selectedVariant?.priceOverride
    ? formatPrice(selectedVariant.priceOverride)
    : formatPrice(product?.price);

  const stockCount = selectedVariant ? Number(selectedVariant.stock) || 0 : null;
  const hasVariants = variants.length > 0;

  const getAttrs = (v) =>
    v.attributes instanceof Map
      ? Object.fromEntries(v.attributes)
      : v.attributes || {};

  const prevImage = () => setSelectedImage((i) => (i > 0 ? i - 1 : displayImages.length - 1));
  const nextImage = () => setSelectedImage((i) => (i < displayImages.length - 1 ? i + 1 : 0));

  // Touch Swipe Handlers
  const onTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const dist = touchStartX - touchEndX;
    if (dist > SWIPE_THRESHOLD) nextImage();
    else if (dist < -SWIPE_THRESHOLD) prevImage();
  };

  // Mouse Drag Handlers (for desktop drag/swipe)
  const onMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
  };
  const onMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dist = dragStartX - e.clientX;
    if (dist > SWIPE_THRESHOLD) nextImage();
    else if (dist < -SWIPE_THRESHOLD) prevImage();
  };
  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const handleAttrSelect = (key, val) => {
    const newAttrs = { ...selectedAttrs, [key]: val };

    // 1. Try exact match with current selection
    const exact = variants.find((v) => {
      const a = getAttrs(v);
      return Object.entries(newAttrs).every(([k, v]) => String(a[k]) === String(v));
    });
    if (exact) { setSelectedAttrs(newAttrs); return; }

    // 2. Snap to nearest in-stock variant that has this key=val
    const nearest = variants.find((v) => {
      const a = getAttrs(v);
      return String(a[key]) === String(val) && Number(v.stock) > 0;
    }) || variants.find((v) => String(getAttrs(v)[key]) === String(val));

    if (nearest) {
      setSelectedAttrs(getAttrs(nearest));
    } else {
      setSelectedAttrs(newAttrs);
    }
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a valid variant");
      return;
    }
    if (stockCount === 0) {
      toast.error("This variant is out of stock");
      return;
    }
    const attrLabel = Object.values(selectedAttrs).join(" / ");
    toast.success(`${product?.title}${attrLabel ? ` (${attrLabel})` : ""} added to cart!`);
  };

  const handleBuyNow = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a valid variant");
      return;
    }
    if (stockCount === 0) {
      toast.error("This variant is out of stock");
      return;
    }
    toast.success("Proceeding to checkout");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to catalog
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-[380px] bg-slate-200/70 rounded-xl w-full" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-200/70 rounded w-3/4" />
              <div className="h-5 bg-slate-200/70 rounded w-1/4" />
              <div className="h-16 bg-slate-200/70 rounded w-full" />
              <div className="h-10 bg-slate-200/70 rounded w-full" />
            </div>
          </div>
        ) : !product ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 max-w-md mx-auto p-6">
            <p className="text-sm font-semibold text-slate-700">Product not found</p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">

              {/* Left: Images */}
              <div className="md:col-span-6 flex flex-col gap-2.5">
                {/* Main image — swipeable with sliding carousel */}
                <div
                  className={`w-full h-[320px] sm:h-[400px] lg:h-[430px] rounded-xl bg-slate-100 overflow-hidden border border-slate-200/60 relative group/img select-none ${
                    isDragging ? "cursor-grabbing" : displayImages.length > 1 ? "cursor-grab" : ""
                  }`}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                >
                  {/* Sliding Track */}
                  <div
                    className="flex h-full w-full transition-transform duration-300 ease-out"
                    style={{
                      transform: `translateX(-${selectedImage * 100}%)`,
                    }}
                  >
                    {displayImages.map((img, index) => (
                      <div
                        key={index}
                        className="min-w-full w-full h-full shrink-0 flex items-center justify-center bg-slate-100 overflow-hidden"
                      >
                        <img
                          src={img?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}
                          alt={`${product.title} - ${index + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Variant image badge */}
                  {variantImages.length > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md z-10">
                      Variant Photo
                    </span>
                  )}

                  {/* Image Counter Badge */}
                  {displayImages.length > 1 && (
                    <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md z-10">
                      {selectedImage + 1}/{displayImages.length}
                    </span>
                  )}

                  {/* Arrows — show only when multiple images */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        aria-label="Previous image"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover/img:opacity-100 hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        aria-label="Next image"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover/img:opacity-100 hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center gap-1.5 z-10">
                        {displayImages.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(i);
                            }}
                            aria-label={`Slide ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              selectedImage === i ? "w-4 bg-white shadow-xs" : "w-1.5 bg-white/60 hover:bg-white/90"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {displayImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {displayImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-14 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border-2 transition-all cursor-pointer ${
                          selectedImage === idx
                            ? "border-slate-900 opacity-100"
                            : "border-transparent opacity-55 hover:opacity-90"
                        }`}
                      >
                        <img src={img?.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="md:col-span-6 flex flex-col space-y-4">

                {/* Title & Price */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {product.title}
                  </h1>
                  <p className="text-xl font-black text-slate-900 mt-1">{displayPrice}</p>
                </div>

                {/* Variant Attribute Selectors */}
                {hasVariants && Object.entries(attrOptions).map(([key, values]) => {
                  const selectedVal = selectedAttrs[key];
                  return (
                    <div key={key}>
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5 capitalize">
                        {key}
                        {selectedVal && (
                          <span className="ml-1.5 font-bold text-slate-900">{selectedVal}</span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {values.map((val) => {
                          // Check if this value is available (any variant matching current + this val has stock)
                          const isAvailable = variants.some((v) => {
                            const attrs = v.attributes instanceof Map
                              ? Object.fromEntries(v.attributes)
                              : v.attributes || {};
                            return String(attrs[key]) === val && Number(v.stock) > 0;
                          });

                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleAttrSelect(key, val)}
                              disabled={!isAvailable}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                selectedVal === val
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : isAvailable
                                  ? "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                                  : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Stock status */}
                {hasVariants && (
                  <div>
                    {stockCount > 10 ? (
                      <span className="text-xs text-emerald-600 font-semibold">✓ In stock ({stockCount} available)</span>
                    ) : stockCount > 0 ? (
                      <span className="text-xs text-amber-600 font-semibold">⚠ Only {stockCount} left!</span>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold">✕ Out of stock</span>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">About</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={stockCount === 0}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={stockCount === 0}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-black text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
