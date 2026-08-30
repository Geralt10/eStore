import React from "react";
import { Link } from "react-router";

export default function SellerHeader({ product }) {
  return (
    <header className="sticky top-0 z-50 h-16 flex items-center bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0 text-sm">
          <Link to="/seller/dashboard" className="font-bold text-slate-900 hover:opacity-70 transition-opacity shrink-0">
            eStore
          </Link>
          <span className="text-slate-300 hidden sm:block">›</span>
          <Link to="/seller/dashboard" className="text-slate-500 hover:text-slate-800 font-medium transition-colors hidden sm:block shrink-0">
            Seller Portal
          </Link>
          <span className="text-slate-300 hidden sm:block">›</span>
          <Link to="/seller/dashboard" className="text-slate-500 hover:text-slate-800 font-medium transition-colors hidden sm:block shrink-0">
            Inventory
          </Link>
          {product && (
            <>
              <span className="text-slate-300 hidden sm:block">›</span>
              <span className="text-slate-800 font-semibold truncate max-w-[180px] hidden sm:block">{product.title}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/seller/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </Link>
          {product && (
            <Link
              to={`/product/${product._id || product.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors shadow-sm"
            >
              Live Preview
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
