import React from "react";
import VariantItem from "./VariantItem";

export default function VariantList({
  variants,
  basePrice,
  baseCurrency,
  fallbackImage,
  onOpenAddModal,
  onUpdateStock,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Variants &amp; Inventory
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {variants.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage SKUs, pricing overrides, and stock levels across all options.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Variant
        </button>
      </div>

      {/* Empty state */}
      {variants.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center gap-4 text-center max-w-lg mx-auto w-full">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">No variants created yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Add size options, color variations, and custom attributes to manage stock for each item.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            + Add First Variant
          </button>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <div className="col-span-5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Variant / SKU</div>
            <div className="col-span-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block">Price</div>
            <div className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Stock Level</div>
            <div className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {variants.map((variant, index) => (
              <VariantItem
                key={variant._id || variant.id || index}
                variant={variant}
                index={index}
                basePrice={basePrice}
                baseCurrency={baseCurrency}
                fallbackImage={fallbackImage}
                onUpdateStock={onUpdateStock}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
