import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function ProductMediaUpload({
  selectedImages,
  imagePreviews,
  currentPreviewIndex,
  onSelectPreview,
  onRemoveImage,
  onAddFiles,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please upload valid image files (JPG, PNG, WEBP)");
      return;
    }

    if (selectedImages.length + validFiles.length > 7) {
      toast.error("Maximum 7 images are allowed");
      return;
    }

    onAddFiles(validFiles);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Product Media
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Upload high quality images (up to 7 photos, 5MB max each).
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {selectedImages.length} / 7
        </span>
      </div>

      {/* Drag and Drop Zone */}
      {selectedImages.length < 7 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-slate-900 bg-slate-100/70"
              : "border-slate-200 hover:border-slate-400 bg-slate-50/40 hover:bg-slate-50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept="image/*"
            className="hidden"
          />

          <div className="mx-auto w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-800">
            Click to upload{" "}
            <span className="text-slate-400 font-normal">
              or drag and drop
            </span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            PNG, JPG, or WEBP (up to 5MB)
          </p>
        </div>
      )}

      {/* Previews Grid */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              onClick={() => onSelectPreview(index)}
              className={`relative group rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square ${
                currentPreviewIndex === index
                  ? "border-slate-900 ring-2 ring-slate-900/20 shadow-xs"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Cover Tag for First Item */}
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md shadow-xs">
                  Cover
                </span>
              )}

              {/* Active Preview indicator */}
              {currentPreviewIndex === index && (
                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow-xs">
                  Previewing
                </span>
              )}

              {/* Delete Button overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(index);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center shadow-md transition-colors"
                title="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* File size indicator */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 text-[10px] text-white truncate font-medium text-right">
                {preview.size} MB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
