import React, { useState } from "react";
import toast from "react-hot-toast";

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const COMMON_COLORS = ["Black", "White", "Navy", "Grey", "Beige", "Red", "Blue", "Olive", "Brown"];
const ALLOWED_CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

export default function AddVariantModal({ isOpen, onClose, onSubmit, basePrice = 0, baseCurrency = "INR", loading = false }) {
  const [sizeType, setSizeType] = useState("M");
  const [customSize, setCustomSize] = useState("");
  const [color, setColor] = useState("");
  const [customAttributes, setCustomAttributes] = useState([]);
  const [stock, setStock] = useState(20);
  const [priceAmount, setPriceAmount] = useState(basePrice || "");
  const [priceCurrency, setPriceCurrency] = useState(baseCurrency || "INR");
  const [variantImages, setVariantImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + variantImages.length > 5) { toast.error("Max 5 images per variant"); return; }
    setVariantImages((p) => [...p, ...files]);
    setImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    setVariantImages((p) => p.filter((_, idx) => idx !== i));
    setImagePreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const chosenSize = sizeType === "Custom" ? customSize.trim() : sizeType;
    const attributesObj = {};
    if (chosenSize) attributesObj.size = chosenSize;
    if (color.trim()) attributesObj.color = color.trim();
    customAttributes.forEach(({ key, value }) => {
      const k = key.trim().toLowerCase();
      if (k && value.trim()) attributesObj[k] = value.trim();
    });
    if (!Object.keys(attributesObj).length) { toast.error("Provide at least one attribute (Size or Color)"); return; }
    const finalPrice = priceAmount !== "" ? Number(priceAmount) : Number(basePrice);
    if (isNaN(finalPrice) || finalPrice < 0) { toast.error("Enter a valid price"); return; }
    const fd = new FormData();
    fd.append("stock", Math.max(0, Number(stock) || 0));
    fd.append("priceAmount", finalPrice);
    fd.append("priceCurrency", priceCurrency || baseCurrency || "INR");
    fd.append("attributes", JSON.stringify(attributesObj));
    variantImages.forEach((f) => fd.append("images", f));
    onSubmit(fd, () => {
      setSizeType("M"); setCustomSize(""); setColor(""); setCustomAttributes([]);
      setStock(20); setPriceAmount(basePrice || ""); setPriceCurrency(baseCurrency || "INR");
      setVariantImages([]); setImagePreviews([]);
    });
  };

  const inputCls = "w-full border border-slate-200 rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/50 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add New Variant</h3>
            <p className="text-xs text-slate-500 mt-0.5">Specify attributes, stock, and optional price override.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1">

          {/* Section 1 */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">1. Variant Attributes</p>

            {/* Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[...COMMON_SIZES, "Custom"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSizeType(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                      sizeType === sz
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {sizeType === "Custom" && (
                <input type="text" placeholder="e.g. 32W × 34L, UK 9" value={customSize} onChange={(e) => setCustomSize(e.target.value)} className={inputCls} required />
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Color (optional)</label>
              <input type="text" list="colors" placeholder="e.g. Midnight Black, Pearl White" value={color} onChange={(e) => setColor(e.target.value)} className={inputCls} />
              <datalist id="colors">{COMMON_COLORS.map((c) => <option key={c} value={c} />)}</datalist>
            </div>

            {/* Custom attrs */}
            {customAttributes.map((attr, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Attribute" value={attr.key} onChange={(e) => setCustomAttributes((p) => p.map((a, i) => i === idx ? { ...a, key: e.target.value } : a))} className={`${inputCls} flex-1`} required />
                <input type="text" placeholder="Value" value={attr.value} onChange={(e) => setCustomAttributes((p) => p.map((a, i) => i === idx ? { ...a, value: e.target.value } : a))} className={`${inputCls} flex-1`} required />
                <button type="button" onClick={() => setCustomAttributes((p) => p.filter((_, i) => i !== idx))} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setCustomAttributes((p) => [...p, { key: "", value: "" }])} className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Custom Attribute
            </button>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-2">2. Inventory &amp; Price</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Stock Units <span className="text-red-500">*</span></label>
                <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={`${inputCls} font-bold`} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Price Override (optional)</label>
                <div className="flex gap-1.5">
                  <select value={priceCurrency} onChange={(e) => setPriceCurrency(e.target.value)} className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-2 py-2.5 outline-none cursor-pointer">
                    {ALLOWED_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" min="0" placeholder={String(basePrice)} value={priceAmount} onChange={(e) => setPriceAmount(e.target.value)} className={`${inputCls} font-bold flex-1`} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-2">3. Variant Images (Max 5)</p>
            <div className="flex items-center gap-2 flex-wrap">
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(idx)} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/65 text-white flex items-center justify-center text-[9px] cursor-pointer">✕</button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-100 transition-colors text-slate-400">
                  <span className="text-xl leading-none">+</span>
                  <span className="text-[9px] font-medium">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-[11px] text-slate-400">If no images are uploaded, the product's default image will be used.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-black shadow-sm transition-colors cursor-pointer disabled:opacity-50">
            {loading ? "Creating…" : "Create Variant"}
          </button>
        </div>
      </div>
    </div>
  );
}
