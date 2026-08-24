import React, { useState } from "react";
import { Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductMediaUpload from "../components/ProductMediaUpload";
import SellerProductCard from "../components/SellerProductCard";

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
];

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct();
  const { loading } = useSelector((state) => state.product);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  // Images state
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Handle text & select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new image files
  const handleAddFiles = (validFiles) => {
    const newSelectedImages = [...selectedImages, ...validFiles];
    setSelectedImages(newSelectedImages);

    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2), // in MB
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove individual image
  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke old URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index].url);

    setSelectedImages(updatedImages);
    setImagePreviews(updatedPreviews);

    setCurrentPreviewIndex((prev) => {
      if (updatedPreviews.length === 0) return 0;
      if (prev >= updatedPreviews.length) return updatedPreviews.length - 1;
      return prev;
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!formData.priceAmount || Number(formData.priceAmount) <= 0) {
      toast.error("Please enter a valid price amount");
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    // Build multipart FormData
    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("priceAmount", formData.priceAmount);
    payload.append("priceCurrency", formData.priceCurrency);

    selectedImages.forEach((file) => {
      payload.append("images", file);
    });

    const result = await handleCreateProduct(payload);

    if (result) {
      toast.success("Product created successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
      });
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setSelectedImages([]);
      setImagePreviews([]);
      setCurrentPreviewIndex(0);
    }
  };

  const selectedCurrencySymbol =
    CURRENCIES.find((c) => c.code === formData.priceCurrency)?.symbol || "₹";

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20 font-sans">
      {/* Minimal Clean Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 sm:px-12 py-3.5 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-semibold tracking-tight">eStore</span>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-xs text-slate-500 font-medium">Create Product</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Discard
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-5xl mx-auto px-6 sm:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Main Form Column */}
          <div className="lg:col-span-7 space-y-7">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                Add new product
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in the basic product information and add photos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Section 1: General Info */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Product Details
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Required fields *
                  </span>
                </div>

                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Product Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Classic Tailored Wool Blazer"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="description"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Description *
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formData.description.length} characters
                    </span>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the material, craftsmanship, fit, sizing, and key styling points..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none resize-y min-h-[110px]"
                  />
                </div>
              </div>

              {/* Section 2: Pricing */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Pricing & Currency
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Set a competitive price in your target marketplace currency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  {/* Currency Picker */}
                  <div className="sm:col-span-5">
                    <label
                      htmlFor="priceCurrency"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm text-slate-900 transition-all outline-none font-medium cursor-pointer"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code} ({curr.symbol}) - {curr.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Price Amount */}
                  <div className="sm:col-span-7">
                    <label
                      htmlFor="priceAmount"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Price Amount *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-medium text-slate-400 select-none">
                        {selectedCurrencySymbol}
                      </span>
                      <input
                        id="priceAmount"
                        type="number"
                        name="priceAmount"
                        min="0"
                        step="any"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Media / Images Upload Component */}
              <ProductMediaUpload
                selectedImages={selectedImages}
                imagePreviews={imagePreviews}
                currentPreviewIndex={currentPreviewIndex}
                onSelectPreview={setCurrentPreviewIndex}
                onRemoveImage={handleRemoveImage}
                onAddFiles={handleAddFiles}
              />

              {/* Bottom CTA for Mobile */}
              <div className="flex sm:hidden pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-medium shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Publishing Product..." : "Publish Product"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Marketplace Card Preview Component */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Live Customer Preview
                </h3>
                <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              <SellerProductCard
                product={{
                  title: formData.title,
                  description: formData.description,
                  priceAmount: formData.priceAmount,
                  priceCurrency: formData.priceCurrency,
                  images: imagePreviews,
                }}
                badgeText="New Arrival"
                footerText="View details"
                externalIndex={currentPreviewIndex}
                onExternalIndexChange={setCurrentPreviewIndex}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}