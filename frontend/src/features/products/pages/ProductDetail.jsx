import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");

  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const data = await handleGetProduct(id);
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (priceObj) => {
    if (!priceObj) return "₹0";
    const amount = priceObj.amount ?? 0;
    const currency = priceObj.currency || "INR";
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
    };
    const symbol = symbols[currency] || `${currency} `;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    toast.success(`${product?.title || "Item"} (Size: ${selectedSize}) added to cart`);
  };

  const handleBuyNow = () => {
    toast.success("Proceeding to checkout");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Single-Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-center">
        
        {/* Back Link */}
        <div className="mb-3 sm:mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to catalog
          </Link>
        </div>

        {loading ? (
          /* Compact Loading State */
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse items-center">
            <div className="h-[380px] bg-slate-200/70 rounded-xl w-full" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-200/70 rounded w-3/4" />
              <div className="h-5 bg-slate-200/70 rounded w-1/4" />
              <div className="h-16 bg-slate-200/70 rounded w-full" />
              <div className="h-10 bg-slate-200/70 rounded w-full" />
            </div>
          </div>
        ) : !product ? (
          /* Not Found */
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
          /* Compact Single-View Product Layout */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Left Column: Image (fits view height) */}
              <div className="md:col-span-6 flex flex-col gap-2.5">
                <div className="w-full h-[320px] sm:h-[400px] lg:h-[430px] rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/60">
                  <img
                    src={product.image?.[selectedImage]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails */}
                {product.image && product.image.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {product.image.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-14 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border transition-all cursor-pointer ${
                          selectedImage === idx
                            ? "border-slate-900 ring-1 ring-slate-900"
                            : "border-slate-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Compact Details & Actions */}
              <div className="md:col-span-6 flex flex-col justify-center space-y-4">
                {/* Title & Price */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {product.title}
                  </h1>
                  <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Size Selector */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Select Size
                  </span>
                  <div className="flex items-center gap-2">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    About
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
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
