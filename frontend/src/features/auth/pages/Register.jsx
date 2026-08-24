import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const result = await handleRegister({
      email: formData.email,
      fullname: formData.fullName,
      password: formData.password,
      contact: formData.contactNumber,
      isSeller: formData.isSeller,
    });

    if (result) {
      toast.success("User registered successfully");
      navigate("/login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] font-sans text-slate-900">
      {/* Sleek Centered Floating Card */}
      <div
        className="relative w-full max-w-[360px] bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-slate-100"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Close 'X' Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tab Switcher: Login | Register */}
        <div className="flex border-b border-slate-200 mb-4">
          <Link
            to="/login"
            className="flex-1 py-2 text-center text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="flex-1 py-2 text-center text-sm font-semibold text-black relative"
          >
            Register
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
            Create an account
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign up to start shopping on eStore
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Full Name */}
          <div className="relative flex items-center border border-slate-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all bg-white">
            <span className="pl-3.5 pr-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>

          {/* Email Address */}
          <div className="relative flex items-center border border-slate-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all bg-white">
            <span className="pl-3.5 pr-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>

          {/* Contact Number */}
          <div className="relative flex items-center border border-slate-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all bg-white">
            <span className="pl-3.5 pr-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.07-5.041-3.285-6.11-6.116l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </span>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact number"
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center border border-slate-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all bg-white">
            <span className="pl-3.5 pr-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="pr-3 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Toggle password"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative flex items-center border border-slate-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all bg-white">
            <span className="pl-3.5 pr-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full py-2.5 px-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="pr-3 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Toggle confirm password"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Seller Toggle Box */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80">
            <div>
              <label
                htmlFor="isSeller"
                className="text-xs font-medium cursor-pointer text-slate-900 block"
              >
                Register as a Seller
              </label>
              <p className="text-[10px] text-slate-500">
                List and sell products on eStore
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, isSeller: !p.isSeller }))}
              className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                formData.isSeller ? "bg-black" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full shadow transform transition-transform duration-300 bg-white ${
                  formData.isSeller ? "translate-x-3" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-sm font-medium tracking-wide transition-all shadow-md active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3.5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-2.5 text-[10px] text-slate-400 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Google Sign In */}
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-sm w-full"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          </svg>
          <span>Google</span>
        </a>

        {/* Bottom Switcher */}
        <div className="text-center mt-3.5">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
