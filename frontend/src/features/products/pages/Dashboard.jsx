import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useProductFilter } from "../hooks/useProductFilter";
import SellerProductCard from "../components/SellerProductCard";
import DashboardFilterBar from "../components/DashboardFilterBar";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export default function Dashboard() {
  const products = useSelector((state) => state.product.sellerProduct || []);
  const loading = useSelector((state) => state.product.loading);
  const { handleGetSellerProduct } = useProduct();

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    filteredProducts,
  } = useProductFilter(products);

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20 font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 sm:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-base font-semibold tracking-tight text-slate-900 hover:opacity-80 transition-opacity"
            >
              eStore
            </Link>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-xs text-slate-500 font-medium">Seller Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Store Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 space-y-6">
        {/* Sleek Unified Toolbar (Title, Count, Search, Sort, View, Add Button) */}
        <DashboardFilterBar
          totalCount={filteredProducts.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-4/3 bg-slate-100 rounded-2xl w-full" />
                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                <div className="h-4 bg-slate-100 rounded-md w-1/4 pt-2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-center mx-auto text-slate-400 shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {searchTerm ? "No matching products found" : "No products listed yet"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {searchTerm
                  ? "Try searching with a different term or clear the filter."
                  : "Start showcasing your catalog to customers by creating your first product."}
              </p>
            </div>
            <div className="pt-2">
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/seller/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium shadow-md transition-all active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>Create Your First Product</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Product Cards (Grid Mode) */}
        {!loading && filteredProducts.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-1">
            {filteredProducts.map((product) => (
              <SellerProductCard
                key={product._id || product.id}
                product={product}
                badgeText="Live"
                footerText="Manage"
              />
            ))}
          </div>
        )}

        {/* Product List Mode (Compact Table / Row Style) */}
        {!loading && filteredProducts.length > 0 && viewMode === "list" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden pt-1">
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const productId = product._id || product.id;
                const images = product.image || product.images || [];
                const currentImg = images[0];
                const currencySymbol =
                  CURRENCY_SYMBOLS[product.price?.currency] || product.price?.currency || "₹";

                return (
                  <div
                    key={productId}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                        {currentImg?.url ? (
                          <img
                            src={currentImg.url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {product.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            Active
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {images.length} photo(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-slate-900">
                        {currencySymbol} {Number(product.price?.amount || 0).toLocaleString()}
                      </div>
                      <span className="text-xs text-slate-500 font-medium hover:text-slate-900 inline-block mt-1">
                        Edit &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}