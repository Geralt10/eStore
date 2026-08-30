import React, { useState } from "react";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

export default function VariantItem({
  variant,
  index,
  basePrice,
  baseCurrency,
  fallbackImage,
  onUpdateStock,
  disabled = false,
}) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState("");

  const variantId = variant._id || variant.id || index;
  const rawAttrs = variant.attributes || {};
  const attrs = rawAttrs instanceof Map ? Object.fromEntries(rawAttrs) : typeof rawAttrs === "object" ? rawAttrs : {};

  const variantImg = variant.images?.[0]?.url || fallbackImage;
  const vPrice = variant.priceOverride?.amount ?? variant.priceOverride ?? basePrice;
  const vCurrency = variant.priceOverride?.currency || baseCurrency || "INR";
  const symbol = CURRENCY_SYMBOLS[vCurrency] || "₹";
  const stock = Number(variant.stock) || 0;

  const stockBadge =
    stock > 10 ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        {stock} in stock
      </span>
    ) : stock > 0 ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        {stock} low stock
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-[11px] font-semibold">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        0 out of stock
      </span>
    );

  return (
    <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-slate-50/60 transition-colors">
      {/* Variant info */}
      <div className="col-span-5 flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          <img src={variantImg} alt="Variant" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-900 truncate">
            {Object.values(attrs).length > 0 ? Object.values(attrs).join(" / ") : `Variant #${index + 1}`}
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
            ID: {String(variantId).slice(-8)}
          </div>
          {Object.entries(attrs).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {Object.entries(attrs).map(([k, v]) => (
                <span key={k} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] border border-slate-200">
                  <span className="text-slate-400 capitalize">{k}:</span> {String(v)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="col-span-3 text-xs font-semibold text-slate-900 hidden sm:block">
        {symbol} {Number(vPrice).toLocaleString()}
      </div>

      {/* Stock */}
      <div className="col-span-2">
        {editing ? (
          <div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden w-fit bg-white shadow-sm">
            <input
              autoFocus
              type="number"
              min="0"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setEditing(false); onUpdateStock(variantId, Math.max(0, Number(editVal))); }
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-14 text-center text-sm font-bold text-slate-900 border-none outline-none py-1.5 bg-transparent"
            />
            <div className="w-px h-5 bg-slate-200" />
            <button
              onClick={() => { setEditing(false); onUpdateStock(variantId, Math.max(0, Number(editVal))); }}
              className="px-1.5 py-1 text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-1.5 py-1 text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : stockBadge}
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-1">
        {!editing && (
          <button
            onClick={() => { setEditVal(String(stock)); setEditing(true); }}
            disabled={disabled}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-40"
            title="Edit stock"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
