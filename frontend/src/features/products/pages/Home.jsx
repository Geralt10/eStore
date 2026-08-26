import React, { useEffect } from "react";
import { Link, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";

export default function Home() {
  const { handleGetAllProducts } = useProduct();
  const allProducts = useSelector((state) => state.product.allProducts) || [];
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Catalog */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              New Arrivals
            </h1>
            <p className="text-xs text-slate-500">
              {allProducts.length} {allProducts.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && allProducts.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2.5">
                <div className="w-full aspect-[3/4] bg-slate-200/70 rounded-2xl" />
                <div className="h-4 bg-slate-200/70 rounded-md w-3/4" />
                <div className="h-3.5 bg-slate-200/70 rounded-md w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-16 text-center">
            <p className="text-sm text-slate-600">Failed to load collection</p>
            <button
              onClick={() => handleGetAllProducts()}
              className="mt-3 px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : allProducts.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center">
            <p className="text-sm text-slate-500">No items available yet.</p>
          </div>
        ) : (
          /* Modern Apparel Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allProducts.map((product) => {
              const primaryImage = product.image?.[0]?.url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";
              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group flex flex-col bg-white rounded-2xl p-2.5 border border-slate-200/70 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                >
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden mb-3">
                    <img
                      src={primaryImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.image?.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        +{product.image.length - 1}
                      </span>
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
            })}
          </div>
        )}
      </main>

      {/* Outlet for modal overlays */}
      <Outlet />
    </div>
  );
}