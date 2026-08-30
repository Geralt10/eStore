import React, { useState } from "react";

export default function StockControl({ stockCount, onUpdateStock, disabled = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(stockCount));

  const handleSave = () => {
    const num = Number(inputValue);
    if (isNaN(num) || num < 0) {
      return;
    }
    onUpdateStock(num);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(String(stockCount));
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-16 px-2 py-1 text-xs font-bold text-center bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
            autoFocus
          />
          <button
            type="button"
            disabled={disabled}
            onClick={handleSave}
            className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 text-white rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setInputValue(String(stockCount));
            }}
            className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          {/* Decrement Button */}
          <button
            type="button"
            disabled={stockCount <= 0 || disabled}
            onClick={() => onUpdateStock(Math.max(0, stockCount - 1))}
            className="w-7 h-7 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Decrease stock by 1"
          >
            -
          </button>

          {/* Click to Edit Direct Stock Value */}
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setInputValue(String(stockCount));
            }}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200/70 rounded-xl text-xs font-bold text-slate-900 min-w-[64px] text-center shadow-2xs cursor-pointer"
            title="Click to enter exact stock count"
          >
            {stockCount} <span className="text-[10px] text-slate-400 font-normal">qty</span>
          </button>

          {/* Increment Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onUpdateStock(stockCount + 1)}
            className="w-7 h-7 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
            title="Increase stock by 1"
          >
            +
          </button>

          {/* Quick +10 button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onUpdateStock(stockCount + 10)}
            className="px-2 py-1 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
            title="Add 10 to stock"
          >
            +10
          </button>
        </>
      )}
    </div>
  );
}

