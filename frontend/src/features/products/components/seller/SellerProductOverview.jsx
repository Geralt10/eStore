import React, { useState } from "react";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

function StatCard({ icon, label, value, badge }) {
  return (
    <div className="bg-slate-50/80 rounded-xl p-2.5 sm:p-3">
      <div className="flex items-center gap-1 text-slate-400 mb-0.5">
        {icon}
        <span className="text-[10px] font-normal uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm sm:text-base font-medium text-slate-900 tracking-tight">{value}</span>
        {badge}
      </div>
    </div>
  );
}

export default function SellerProductOverview({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const rawImages = product?.image || product?.images || [];
  const productImages = Array.isArray(rawImages)
    ? rawImages.map((img) => (typeof img === "string" ? { url: img } : img))
    : [];

  const defaultImage = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
  const displayImages = productImages.length > 0 ? productImages : [{ url: defaultImage }];

  const priceAmount = product?.price?.amount ?? product?.priceAmount ?? 0;
  const currencyCode = product?.price?.currency || product?.priceCurrency || "INR";
  const symbol = CURRENCY_SYMBOLS[currencyCode] || "₹";

  const variants = product?.varients || product?.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5 items-start">

        {/* Left — Image Gallery (Horizontal on mobile, vertical on sm+) */}
        <div className="md:col-span-5 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5 items-stretch sm:items-start w-full">
          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex flex-row sm:flex-col gap-1.5 shrink-0 max-w-full sm:max-w-none overflow-x-auto sm:overflow-y-auto sm:max-h-[290px] scrollbar-none py-0.5 w-full sm:w-auto">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-11 h-13 sm:w-12 sm:h-15 rounded-lg overflow-hidden bg-slate-100 shrink-0 transition-all cursor-pointer ${
                    selectedImage === idx
                      ? "ring-1.5 ring-slate-900 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="w-full aspect-square sm:aspect-square sm:max-h-[290px] rounded-xl overflow-hidden bg-slate-100/90 relative">
            <img
              src={displayImages[selectedImage]?.url || defaultImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* LIVE badge */}
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-normal px-2 sm:px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
        </div>

        {/* Right — Info & Stats */}
        <div className="md:col-span-7 flex flex-col gap-2.5 sm:gap-3 pt-0.5">
          {/* Badges row */}
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span className="text-[9px] sm:text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active Listing
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
              ID: {String(product._id || product.id || "").slice(-8)}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-base sm:text-xl font-medium text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>}
              label="Base Price"
              value={`${symbol} ${Number(priceAmount).toLocaleString()}`}
            />
            <StatCard
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>}
              label="Total Variants"
              value={variants.length}
              badge={<span className="text-[11px] text-slate-400 font-normal">Active</span>}
            />
            <StatCard
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
              label="Total Stock"
              value={totalStock}
              badge={
                totalStock > 20
                  ? <span className="text-[9px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">Healthy</span>
                  : totalStock > 0
                  ? <span className="text-[9px] font-normal text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">Low</span>
                  : null
              }
            />
            <StatCard
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
              label="Media Assets"
              value={productImages.length}
              badge={<span className="text-[11px] text-slate-400 font-normal">Photos</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
