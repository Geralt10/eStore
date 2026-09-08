import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../hook/useCart';
import Navbar from '../../products/components/Navbar';
    
// ─── Quantity Stepper ──────────────────────────────────────────────────────────
const QuantityStepper = React.memo(function QuantityStepper({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center border border-slate-300 rounded">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-l transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-slate-900 border-x border-slate-300 select-none">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-r transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
});

// ─── Cart Item Card ────────────────────────────────────────────────────────────
const CartItemCard = React.memo(function CartItemCard({ item, onRemove, onIncrement, onDecrement }) {
  const { product, quantity, price, variant } = item;

  const productId = product?._id ? product._id.toString() : product?.toString();
  const variantId = variant?._id ? variant._id.toString() : variant?.toString();

  // Get the first product image URL
  const imageUrl = product?.image?.[0]?.url || null;

  // Format price
  const formatPrice = (priceObj) => {
    const amount = priceObj?.amount ?? 0;
    const currency = priceObj?.currency ?? 'INR';
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    return `${currency} ${amount}`;
  };

  // Variant attributes display
  const variantData = product?.varients?.find(v => (v._id?.toString() || v.id) === variantId);
  const variantAttrs = variantData?.attributes
    ? Object.entries(variantData.attributes).map(([k, v]) => `${k}: ${v}`).join(' | ')
    : variantId ? `Variant: ${String(variantId).slice(-6)}` : null;

  const handleDecrease = () => onDecrement({ productId, variantId })
  const handleIncrease = () => onIncrement({ productId, variantId })
  const handleRemoveItem = () => onRemove({ productId, variantId })

  return (
    <div className="group flex flex-col sm:flex-row gap-3 pb-4 border-b border-slate-200/70 relative">
      {/* Product Image */}
      <div className="w-full sm:w-20 sm:h-28 aspect-[4/5] sm:aspect-auto bg-slate-100 overflow-hidden flex-shrink-0 rounded-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.title || 'Product'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-start min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-medium text-slate-900 leading-snug mb-1 truncate">
              {product?.title || 'Product'}
            </h3>
            <p className="text-sm text-slate-500 mb-2 line-clamp-2 leading-relaxed">
              {product?.description || ''}
            </p>
            {/* Variant Pill */}
            {variantAttrs && (
              <div className="inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200 mb-1">
                <span className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                  {variantAttrs}
                </span>
              </div>
            )}
          </div>
          {/* Price */}
          <div className="text-right flex-shrink-0 ml-2">
            <span className="text-lg font-semibold text-slate-900 font-sans">
              {formatPrice(price)}
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex justify-between items-center mt-2 pt-1">
          <QuantityStepper
            quantity={quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />
          {/* Remove Button */}
          <button
            type="button"
            aria-label="Remove item"
            onClick={handleRemoveItem}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors duration-200 group/del cursor-pointer text-xs font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover/del:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// ─── Order Summary ─────────────────────────────────────────────────────────────
const OrderSummary = React.memo(function OrderSummary({ items }) {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = useMemo(() => {
    return safeItems.reduce((acc, item) => acc + (item.price?.amount ?? 0) * (item.quantity ?? 1), 0);
  }, [safeItems]);
  const totalItems = useMemo(() => {
    return safeItems.reduce((acc, item) => acc + (item.quantity ?? 1), 0);
  }, [safeItems]);

  const formatINR = (amt) => `₹${amt.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white border border-slate-200/80 rounded-sm p-4 sticky top-20 shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
      <h2 className="font-serif text-lg font-medium text-slate-900 mb-3 pb-2 border-b border-slate-200/70">
        Order Summary
      </h2>

      <div className="space-y-2 text-sm mb-3">
        {/* Subtotal */}
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-slate-800">{formatINR(subtotal)}</span>
        </div>
        {/* Delivery */}
        <div className="flex justify-between text-slate-600">
          <span>Delivery</span>
          <span className="text-emerald-600 font-semibold tracking-wide text-xs uppercase">Free</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-slate-200/70 pt-3 mb-1 flex justify-between items-baseline">
        <span className="text-base font-semibold text-slate-900">Total</span>
        <span className="font-serif text-2xl text-slate-900">{formatINR(subtotal)}</span>
      </div>
      <p className="text-[11px] text-slate-400 mb-3 text-right tracking-normal">
        * Inclusive of all taxes. Shipping calculated at checkout.
      </p>

      {/* Checkout Button */}
      <button
        id="checkout-btn"
        type="button"
        className="w-full bg-slate-900 text-white text-xs font-semibold uppercase tracking-widest py-3 hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
      >
        Proceed to Checkout
      </button>

      {/* Security Badge */}
      <div className="mt-3.5 flex items-center justify-center gap-2 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-[11px] font-semibold tracking-wide uppercase">Secure &amp; Encrypted Checkout</span>
      </div>
    </div>
  );
});

// ─── Empty Cart State ──────────────────────────────────────────────────────────
function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-28 px-4 text-center animate-[fadeInUp_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
      {/* Shopping bag outline icon */}
      <div className="mb-8 text-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-900 mb-4 tracking-tight">
        Your cart is empty
      </h1>
      <p className="text-sm text-slate-500 mb-10 max-w-xs leading-relaxed">
        Looks like you haven't added anything yet. Discover our latest collections and find something you love.
      </p>
      <button
        id="start-shopping-btn"
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center justify-center bg-slate-900 text-white text-xs font-semibold uppercase tracking-widest px-10 py-4 hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
      >
        Start Shopping
      </button>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <div className="lg:w-3/5 space-y-8">
        {[1, 2].map(i => (
          <div key={i} className="flex gap-6 pb-8 border-b border-slate-200/70 animate-pulse">
            <div className="w-36 h-44 bg-slate-200 rounded-sm flex-shrink-0" />
            <div className="flex-grow space-y-3">
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-3.5 bg-slate-200 rounded w-full" />
              <div className="h-3.5 bg-slate-200 rounded w-4/5" />
              <div className="h-6 bg-slate-200 rounded-full w-28 mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:w-2/5">
        <div className="bg-white border border-slate-200 rounded-sm p-6 animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-12 bg-slate-200 rounded mt-6" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Cart Page ────────────────────────────────────────────────────────────
const Cart = () => {
  const { handleGetCart, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity } = useCart();
  const rawItems = useSelector((state) => state.cart.items);
  const items = Array.isArray(rawItems) ? rawItems : [];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await handleGetCart();
      } catch (err) {
        // silently fail – items stays empty
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity ?? 1), 0);
  }, [items]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-slate-900">
      {/* Global keyframe for empty state animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7">

        {loading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center space-x-2 text-[11px] font-semibold tracking-widest uppercase text-slate-400">
                <li>
                  <Link to="/" className="hover:text-slate-700 transition-colors">Home</Link>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li aria-current="page" className="text-slate-900">Cart</li>
              </ol>
            </nav>

            {/* Page Header */}
            <header className="mb-4 pb-3 border-b border-slate-200/80">
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight mb-1">
                Your Cart
              </h1>
              <p className="text-[11px] uppercase tracking-widest text-slate-400">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </header>

            {/* Cart Layout: 2-column desktop */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

              {/* ── Left: Cart Items ── */}
              <section className="flex-1 flex flex-col space-y-0" aria-label="Cart items">
                {items.map((item) => (
                  <CartItemCard
                    key={item._id}
                    item={item}
                    onRemove={handleRemoveFromCart}
                    onIncrement={handleIncrementQuantity}
                    onDecrement={handleDecrementQuantity}
                  />
                ))}

                {/* Continue Shopping */}
                <div className="pt-3">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </section>

              {/* ── Right: Order Summary ── */}
              <aside className="w-full lg:w-72 shrink-0">
                <OrderSummary items={items} />
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;