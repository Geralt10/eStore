import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import ProductInfo from "../components/ProductInfo";
import YouMayAlsoLike from "../components/YouMayAlsoLike";

import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hook/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { handleGetProduct, handleGetSuggestedProducts } = useProduct();
  const { handleAddToCart } = useCart();

  const suggestedProducts =
    useSelector((state) => state.product.suggestedProducts) || [];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setSuggestionsLoading(true);

        const productData = await handleGetProduct(id);
        setProduct(productData);

        if (id) {
          await handleGetSuggestedProducts(id);
        }
      } catch (error) {
        console.error("Product detail error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
        setSuggestionsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-60 bg-zinc-100 rounded-md mb-8 animate-pulse" />

          {/* Product Detail Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 animate-pulse">
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
              <div className="flex sm:flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-zinc-100 shrink-0"
                  />
                ))}
              </div>
              <div className="flex-1 aspect-square sm:aspect-[4/5] rounded-2xl bg-zinc-100" />
            </div>

            <div className="lg:col-span-5 space-y-6 pt-2">
              <div className="h-9 w-3/4 rounded-lg bg-zinc-100" />
              <div className="h-8 w-1/4 rounded-lg bg-zinc-100" />
              <div className="h-14 rounded-lg bg-zinc-100" />
              <div className="h-6 w-20 rounded-md bg-zinc-100" />
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-zinc-100" />
                ))}
              </div>
              <div className="flex gap-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-12 h-10 rounded-lg bg-zinc-100" />
                ))}
              </div>
              <div className="h-10 w-28 rounded-lg bg-zinc-100" />
              <div className="h-12 rounded-xl bg-zinc-100" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not found fallback
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-950">Product Not Found</h2>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            We couldn't find the product you're looking for. It may have been removed or the link might be broken.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-zinc-950 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-black transition-colors cursor-pointer"
          >
            Back to Collection
          </button>
        </main>
      </div>
    );
  }

  // Extract category for breadcrumb
  const firstVariant =
    product.varients?.[0] || product.variants?.[0];
  const variantAttrs =
    firstVariant?.attributes instanceof Map
      ? Object.fromEntries(firstVariant.attributes)
      : firstVariant?.attributes || {};

  const category = variantAttrs.category || "T-SHIRTS";

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      {/* Threadly Navigation */}
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Breadcrumb matching screenshot: Home > T-SHIRTS > Product Title */}
        <nav
          className="mb-3 flex items-center gap-2 overflow-hidden text-xs sm:text-sm text-zinc-400 font-normal"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="shrink-0 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Home
          </Link>

          <span className="text-zinc-300">›</span>

          <Link
            to="/"
            className="shrink-0 text-zinc-500 hover:text-zinc-900 transition-colors uppercase"
          >
            {category}
          </Link>

          <span className="text-zinc-300">›</span>

          <span className="truncate text-zinc-900 font-medium">
            {product.title}
          </span>
        </nav>

        {/* Product Gallery & Info Section */}
        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
        />

        {/* You May Also Like Recommendation Carousel/Grid */}
        <YouMayAlsoLike
          products={suggestedProducts.filter(
            (item) => String(item._id) !== String(product._id)
          )}
          loading={suggestionsLoading}
        />

      </main>
    </div>
  );
};

export default ProductDetail;
