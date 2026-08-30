import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { handleGetAllProducts } = useProduct();
  const allProducts = useSelector((state) => state.product.allProducts) || [];
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

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
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Outlet for modal overlays */}
      <Outlet />
    </div>
  );
}