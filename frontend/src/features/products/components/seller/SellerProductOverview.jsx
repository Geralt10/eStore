import React, { useState } from "react";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

function StatCard({ icon, label, value, badge }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
      <div className="flex items-center gap-1 text-slate-400 mb-1.5">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold text-slate-900 tracking-tight">{value}</span>
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left — Image Gallery */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {/* Main image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={displayImages[selectedImage]?.url || defaultImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* LIVE badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/85 backdrop-blur-sm border border-emerald-200 text-emerald-700 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </div>
          </div>

          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-1.5">
              {displayImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 transition-all cursor-pointer ${
                    selectedImage === idx
                      ? "border-slate-900 opacity-100"
                      : "border-transparent opacity-55 hover:opacity-90"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info & Stats */}
        <div className="lg:col-span-8 flex flex-col gap-3 pt-0.5">
          {/* Badges row */}
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
              Active Listing
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ID: {String(product._id || product.id || "").slice(-8)}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
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
              badge={<span className="text-xs text-slate-400 font-medium">Active</span>}
            />
            <StatCard
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
              label="Total Stock"
              value={totalStock}
              badge={
                totalStock > 20
                  ? <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Healthy</span>
                  : totalStock > 0
                  ? <span className="text-[9px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Low</span>
                  : null
              }
            />
            <StatCard
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
              label="Media Assets"
              value={productImages.length}
              badge={<span className="text-xs text-slate-400 font-medium">Photos</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
