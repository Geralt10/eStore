import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const items = useSelector((state) => state.cart.items) || [];
  const totalCartItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8 lg:gap-12 shrink-0">
            <Link to="/" className="flex items-center tracking-tight group">
              <span className="font-extrabold text-xl sm:text-2xl tracking-[0.18em] uppercase text-zinc-950">
                THREADLY
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-800">
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>

              <Link to="/#new-arrivals" className="hover:text-black transition-colors">
                New Arrivals
              </Link>
              <Link to="/#sale" className="hover:text-black transition-colors">
                Sale
              </Link>
            </nav>
          </div>

          {/* Search Bar matching the design */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-zinc-100 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 placeholder-zinc-400 rounded-lg border border-transparent focus:border-zinc-300 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Action Icons: Profile, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            
            {/* User Profile */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  aria-label="User account"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>

                {/* Account Menu Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-xs font-semibold text-zinc-900 truncate">
                        {user.fullname || user.email}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {user.role === "seller" && (
                      <div className="py-1 border-b border-zinc-100">
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
                        >
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/create"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
                        >
                          + New Product
                        </Link>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Log in"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </Link>
            )}

            {/* Wishlist Icon */}
            <button
              type="button"
              className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors relative cursor-pointer"
              aria-label="Wishlist"
              onClick={() => {}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.7]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.7]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-zinc-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
