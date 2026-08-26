import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const { handleLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-slate-950 uppercase">
              e<span className="text-slate-500 font-normal">Store</span>
            </span>
          </Link>

          {/* Minimal Search Bar (UI only) */}
          <div className="hidden sm:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/70 hover:bg-slate-100 text-slate-900 placeholder-slate-400 rounded-lg border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-colors"
                readOnly
              />
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Cart UI */}
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100"
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart (0)</span>
            </button>

            {/* Auth Actions */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-medium text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="max-w-[100px] truncate">
                    {user.fullname || user.email}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Account Menu Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.fullname || user.email}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {user.role === "seller" && (
                      <div className="py-1 border-b border-slate-100">
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/create"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
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
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
