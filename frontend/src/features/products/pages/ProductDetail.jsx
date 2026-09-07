import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useCart } from "../../cart/hook/useCart";

const CURRENCY_SYMBOLS = { INR: "INR ", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

function formatPrice(priceObj) {
  if (!priceObj) return "INR 0";
  const amount = priceObj.amount ?? priceObj ?? 0;
  const currency = priceObj.currency || "INR";
  const prefix = CURRENCY_SYMBOLS[currency] || `${currency} `;
  return `${prefix}${Number(amount).toLocaleString()}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProduct } = useProduct();
  const { handleAddToCart: addToCart } = useCart();

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

  const handleAddToCart = async () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a valid variant");
      return;
    }
    if (stockCount === 0) {
      toast.error("This variant is out of stock");
      return;
    }
    try {
      await addToCart({
        productId: product?._id || id,
        variantId: selectedVariant?._id,
        quantity: 1,
      });
      const attrLabel = Object.values(selectedAttrs).join(" / ");
      toast.success(`${product?.title}${attrLabel ? ` (${attrLabel})` : ""} added to cart!`);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add product to cart";
      toast.error(msg);
    }
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
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-2.5 sm:py-6">
        <div className="mb-2 sm:mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-slate-800 transition-colors"
          >
            ← Back to catalog
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 animate-pulse">
            <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-start w-full">
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-14 shrink-0 overflow-hidden">
                <div className="w-11 h-14 sm:w-14 sm:h-18 bg-slate-100 rounded-sm shrink-0" />
                <div className="w-11 h-14 sm:w-14 sm:h-18 bg-slate-100 rounded-sm shrink-0" />
                <div className="w-11 h-14 sm:w-14 sm:h-18 bg-slate-100 rounded-sm shrink-0" />
              </div>
              <div className="w-full aspect-square sm:aspect-auto sm:flex-1 sm:h-[420px] bg-slate-100 rounded-sm" />
            </div>
            <div className="md:col-span-5 space-y-2.5 sm:space-y-3 pt-1">
              <div className="h-5 bg-slate-100 rounded-sm w-3/4" />
              <div className="h-3.5 bg-slate-100 rounded-sm w-1/4" />
              <div className="h-10 bg-slate-100 rounded-sm w-full" />
              <div className="h-8 bg-slate-100 rounded-sm w-full" />
            </div>
          </div>
        ) : !product ? (
          <div className="py-14 text-center max-w-md mx-auto p-4">
            <p className="text-sm font-normal text-slate-600">Product not found</p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 px-3.5 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">

            {/* Left: Gallery (Horizontal on mobile, vertical on sm+) */}
            <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-start w-full">
              {/* Thumbnails list */}
              {displayImages.length > 1 && (
                <div className="flex flex-row sm:flex-col gap-2 shrink-0 max-w-full sm:max-w-none overflow-x-auto sm:overflow-y-auto sm:max-h-[380px] md:max-h-[420px] scrollbar-none py-0.5 w-full sm:w-auto">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-11 h-14 sm:w-14 sm:h-18 rounded-sm overflow-hidden bg-slate-100 shrink-0 transition-all cursor-pointer ${
                        selectedImage === idx
                          ? "ring-1.5 ring-slate-900 opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img?.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image — swipeable with sliding carousel */}
              <div
                className={`w-full aspect-square sm:aspect-auto sm:flex-1 sm:h-[420px] rounded-sm bg-slate-100/90 overflow-hidden relative group/img select-none ${
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
                      className="min-w-full w-full h-full shrink-0 flex items-center justify-center bg-slate-100/90 overflow-hidden"
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
                  <span className="absolute top-2 left-2 bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-normal px-2 py-0.5 rounded-full z-10">
                    Variant Photo
                  </span>
                )}

                {/* Image Counter Badge */}
                {displayImages.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-normal px-2 py-0.5 rounded-full z-10">
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs backdrop-blur-md opacity-0 group-hover/img:opacity-100 hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-xs backdrop-blur-md opacity-0 group-hover/img:opacity-100 hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1 z-10">
                      {displayImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(i);
                          }}
                          aria-label={`Slide ${i + 1}`}
                          className={`h-1 rounded-full transition-all cursor-pointer ${
                            selectedImage === i ? "w-3 sm:w-3.5 bg-white shadow-xs" : "w-1 bg-white/60 hover:bg-white/90"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:col-span-5 flex flex-col space-y-2.5 sm:space-y-4">

              {/* Title & Price */}
              <div className="space-y-0.5 sm:space-y-1">
                <h1 className="font-sans text-base sm:text-xl font-medium text-slate-900 tracking-tight leading-snug">
                  {product.title}
                </h1>
                <p className="text-xs sm:text-sm font-normal text-slate-500">
                  {displayPrice}
                </p>
              </div>

              {/* Variant Attribute Selectors */}
              {hasVariants && Object.entries(attrOptions).map(([key, values]) => {
                const selectedVal = selectedAttrs[key];
                return (
                  <div key={key} className="space-y-1 sm:space-y-1.5">
                    <span className="text-[11px] sm:text-xs font-normal text-slate-500 capitalize block">
                      {key}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                      {values.map((val) => {
                        const isAvailable = variants.some((v) => {
                          const attrs = v.attributes instanceof Map
                            ? Object.fromEntries(v.attributes)
                            : v.attributes || {};
                          return String(attrs[key]) === val && Number(v.stock) > 0;
                        });

                        const isSelected = selectedVal === val;

                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleAttrSelect(key, val)}
                            disabled={!isAvailable}
                            className={`px-2.5 py-1 text-[11px] sm:text-xs font-normal transition-all cursor-pointer rounded-md ${
                              isSelected
                                ? "bg-slate-900 text-white shadow-xs"
                                : isAvailable
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                                : "bg-slate-50 text-slate-300 cursor-not-allowed line-through"
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
                    <span className="text-[10px] sm:text-[11px] font-normal text-emerald-600">
                      {stockCount} in stock
                    </span>
                  ) : stockCount > 0 ? (
                    <span className="text-[10px] sm:text-[11px] font-normal text-amber-600">
                      Only {stockCount} left in stock
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] font-normal text-rose-500">
                      Out of stock
                    </span>
                  )}
                </div>
              )}

              {/* Description / Details */}
              <div className="space-y-0.5 sm:space-y-1 pt-1 border-t border-slate-100">
                <span className="text-[11px] sm:text-xs font-medium text-slate-900 block">
                  Description
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-0.5 sm:pt-1 flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={stockCount === 0}
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-[11px] sm:text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={stockCount === 0}
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-[11px] sm:text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-900 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Editorial Shipping & Delivery Info */}
              <div className="pt-2 sm:pt-3 border-t border-slate-100 space-y-1 sm:space-y-1.5 text-[10px] sm:text-[11px] font-normal text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-700">Complimentary over INR 10,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Returns</span>
                  <span className="text-slate-700">Within 14 days of delivery</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
