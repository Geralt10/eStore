import React, { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

export default function YouMayAlsoLike({ products = [], loading = false }) {
  const [wishlistMap, setWishlistMap] = useState({});

  const toggleCardWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistMap((prev) => {
      const nextState = !prev[productId];
      if (nextState) {
        toast.success("Added to Wishlist");
      } else {
        toast("Removed from Wishlist");
      }
      return { ...prev, [productId]: nextState };
    });
  };

  // Show up to 4 real products from DB only
  const displayItems = React.useMemo(() => {
    const valid = Array.isArray(products) ? products.filter(Boolean) : [];
    return valid.slice(0, 4);
  }, [products]);

  const getProductImage = (item) => {
    if (item.image && item.image[0]?.url) return item.image[0].url;
    if (item.images && item.images[0]?.url) return item.images[0].url;
    if (item.varients && item.varients[0]?.images?.[0]?.url) {
      return item.varients[0].images[0].url;
    }
    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  const getProductPrice = (item) => {
    const amount =
      item.price?.amount ??
      item.priceAmount ??
      item.varients?.[0]?.priceOverride?.amount ??
      0;
    return `₹${Number(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <section className="mt-16 pt-8 border-t border-zinc-100">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-zinc-100 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-square w-full rounded-xl bg-zinc-100" />
              <div className="h-4 w-3/4 bg-zinc-100 rounded-md" />
              <div className="h-4 w-1/2 bg-zinc-100 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-zinc-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
          You may also like
        </h2>
        <Link
          to="/"
          className="text-xs sm:text-sm font-semibold text-zinc-950 hover:text-black flex items-center gap-1 group transition-colors"
        >
          <span>View all</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {displayItems.map((item) => {
          const isWishlisted = !!wishlistMap[item._id];

          return (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group flex flex-col cursor-pointer"
            >
              {/* Card Image Container */}
              <div className="relative aspect-square w-full rounded-xl bg-[#f4f4f5] overflow-hidden flex items-center justify-center p-2 transition-colors group-hover:bg-[#ebebed]">
                
                {/* Wishlist Heart Icon */}
                <button
                  type="button"
                  onClick={(e) => toggleCardWishlist(e, item._id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-zinc-700 shadow-xs z-10 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-3.5 h-3.5 transition-colors ${
                      isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-current"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>

                {/* Product Image */}
                <img
                  src={getProductImage(item)}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Title & Price */}
              <div className="mt-2.5">
                <h3 className="font-sans text-xs sm:text-sm font-normal text-slate-800 truncate group-hover:text-slate-950 transition-colors">
                  {item.title}
                </h3>
                <div className="mt-0.5 font-sans text-xs sm:text-sm font-medium text-slate-900">
                  {getProductPrice(item)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
