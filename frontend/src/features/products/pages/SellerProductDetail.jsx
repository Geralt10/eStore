import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import toast from "react-hot-toast";

import SellerHeader from "../components/seller/SellerHeader";
import SellerProductOverview from "../components/seller/SellerProductOverview";
import VariantList from "../components/seller/VariantList";
import AddVariantModal from "../components/seller/AddVariantModal";

export default function SellerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProduct, handleCreateVariant, handleUpdateVariantStock } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProductData = async () => {
    setLoading(true);
    const data = await handleGetProduct(id);
    if (data) setProduct(data);
    setLoading(false);
  };

  useEffect(() => { if (id) fetchProductData(); }, [id]);

  const handleAddVariantSubmit = async (formData, onSuccess) => {
    setActionLoading(true);
    try {
      const updated = await handleCreateVariant(id, formData);
      if (updated) setProduct(updated); else await fetchProductData();
      toast.success("Variant created successfully!");
      setShowAddModal(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add variant");
    } finally { setActionLoading(false); }
  };

  const handleStockUpdate = async (variantId, newStock) => {
    setActionLoading(true);
    try {
      const updated = await handleUpdateVariantStock(id, variantId, newStock);
      if (updated) setProduct(updated); else await fetchProductData();
      toast.success(`Stock updated to ${newStock}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    } finally { setActionLoading(false); }
  };


  const defaultImage = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
  const rawImages = product?.image || product?.images || [];
  const primaryFallback = (Array.isArray(rawImages) && rawImages[0]?.url) || defaultImage;
  const basePrice = product?.price?.amount ?? product?.priceAmount ?? 0;
  const baseCurrency = product?.price?.currency || product?.priceCurrency || "INR";
  const variants = product?.varients || product?.variants || [];

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24">
      <SellerHeader product={product} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        {loading ? (
          /* Skeleton */
          <div className="bg-white rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 animate-pulse shadow-xs">
            <div className="md:col-span-5 flex flex-col-reverse sm:flex-row gap-2.5 w-full">
              <div className="flex flex-row sm:flex-col gap-1.5 w-full sm:w-12 shrink-0 overflow-hidden">
                <div className="w-12 h-14 sm:h-15 bg-slate-100 rounded-lg shrink-0" />
                <div className="w-12 h-14 sm:h-15 bg-slate-100 rounded-lg shrink-0" />
                <div className="w-12 h-14 sm:h-15 bg-slate-100 rounded-lg shrink-0" />
              </div>
              <div className="w-full aspect-square sm:aspect-square sm:max-h-[290px] rounded-xl bg-slate-100" />
            </div>
            <div className="md:col-span-7 space-y-3 pt-1">
              <div className="h-4 rounded-md bg-slate-100 w-24" />
              <div className="h-6 rounded-md bg-slate-100 w-3/4" />
              <div className="h-4 rounded-md bg-slate-100 w-full" />
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100" />)}
              </div>
            </div>
          </div>
        ) : !product ? (
          /* Not found */
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-3 text-center max-w-sm mx-auto my-12 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-slate-900">Product not found</h2>
              <p className="text-xs text-slate-500 mt-0.5">The URL may be incorrect or the product was deleted.</p>
            </div>
            <button onClick={() => navigate("/seller/dashboard")} className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            <SellerProductOverview product={product} />
            <VariantList
              variants={variants}
              basePrice={basePrice}
              baseCurrency={baseCurrency}
              fallbackImage={primaryFallback}
              onOpenAddModal={() => setShowAddModal(true)}
              onUpdateStock={handleStockUpdate}
              disabled={actionLoading}
            />
          </>
        )}
      </main>

      <AddVariantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVariantSubmit}
        basePrice={basePrice}
        baseCurrency={baseCurrency}
        loading={actionLoading}
      />
    </div>
  );
}
