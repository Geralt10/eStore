import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import heroBg from "../../../assets/estore_clean_hero_bg.png";
import ContinueWithGoogle from "../components/continueWithGoogle";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin({
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      navigate("/");
    }
  };

  const inputStyle = {
    backgroundColor: "rgba(14, 14, 14, 0.85)",
    color: "#e5e2e1",
    borderColor: "#2d2d2d",
    fontSize: "13px",
  };

  const onFocusHandler = (e) => {
    e.target.style.borderColor = "#EAB308";
    e.target.style.boxShadow = "0 0 0 1px rgba(234, 179, 8, 0.4)";
  };

  const onBlurHandler = (e) => {
    e.target.style.borderColor = "#2d2d2d";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative select-none bg-[#080808]">
      {/* 1. Responsive Full-Screen Background Artwork */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-all duration-500 opacity-100
          bg-[length:cover] bg-[position:center_20%] 
          sm:bg-[position:center_25%] 
          md:bg-[position:center_30%] md:bg-cover 
          lg:bg-[position:center_center] lg:bg-cover"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* 2. Responsive Dark Overlay for Contrast & Legibility */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-300
          bg-[#080808]/30 md:bg-[#080808]/20 lg:bg-[#080808]/15"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 25% 40%, rgba(234, 179, 8, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, rgba(8, 8, 8, 0.5) 100%)
          `,
        }}
      />

      {/* Top Header Logo Only */}
      <header className="w-full px-5 sm:px-8 lg:px-12 py-2.5 sm:py-3 flex items-center justify-start relative z-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#EAB308]/30 shadow-md backdrop-blur-md bg-[#EAB308]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-[#EAB308]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            e<span className="text-[#EAB308]">Store</span>
          </span>
        </div>
      </header>

      {/* Main Content Layout (Guaranteed 100vh viewport fit on 1366x768) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 flex flex-col lg:flex-row items-center justify-start lg:justify-between relative z-10 overflow-y-auto lg:overflow-hidden pt-1 pb-4 lg:py-2">

        {/* Left Side: Marketing Hero Copy & Feature Badges (Hidden on small screens < lg) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center text-left pr-8">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2 border border-[#EAB308]/30 w-fit backdrop-blur-md bg-[#EAB308]/10 text-[#EAB308]">
            PREMIUM FASHION E-COMMERCE
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2 tracking-tight">
            Curated Fashion For Your <span className="text-[#EAB308]">Unique Style</span>
          </h1>

          <p className="text-xs text-[#9b8f79] leading-relaxed max-w-md mb-3.5">
            Join thousands of shoppers and sellers on eStore. Access exclusive clothing collections, effortless ordering, and seller privileges today.
          </p>

          {/* 3 Circular Feature Badges */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md border-t border-white/10 pt-3">
            <div className="flex flex-col items-start gap-0.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EAB308]/30 backdrop-blur-md font-bold text-[11px] bg-[#EAB308]/10 text-[#EAB308]">
                %
              </div>
              <div className="font-bold text-xs text-white">100%</div>
              <div className="text-[10px] text-[#9b8f79]">Authentic Brands</div>
            </div>

            <div className="flex flex-col items-start gap-0.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EAB308]/30 backdrop-blur-md text-[11px] bg-[#EAB308]/10 text-[#EAB308]">
                🚚
              </div>
              <div className="font-bold text-xs text-white">Fast</div>
              <div className="text-[10px] text-[#9b8f79]">Express Shipping</div>
            </div>

            <div className="flex flex-col items-start gap-0.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EAB308]/30 backdrop-blur-md text-[11px] bg-[#EAB308]/10 text-[#EAB308]">
                🏪
              </div>
              <div className="font-bold text-xs text-white">Seller</div>
              <div className="text-[10px] text-[#9b8f79]">Direct Marketplace</div>
            </div>
          </div>
        </div>

        {/* Right Side: Compact Glassmorphism Form Card */}
        <div className="w-full lg:w-[430px] flex items-center justify-center pt-0 pb-3 px-1 sm:px-4 lg:px-0">

          <div
            className="w-full rounded-2xl p-5 sm:p-7 backdrop-blur-2xl transition-all duration-300 shadow-2xl"
            style={{
              backgroundColor: "rgba(10, 10, 10, 0.35)",
              boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Form Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
                Welcome Back
              </h2>
              <p style={{ fontSize: "12px", color: "#9b8f79" }}>
                Sign in to access your <span style={{ color: "#EAB308", fontWeight: "600" }}>eStore</span> account
              </p>
            </div>

            {/* Form Fields */}
            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>

              {/* Email Address */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6b6256]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={onFocusHandler}
                  onBlur={onBlurHandler}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6b6256]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg border outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={onFocusHandler}
                  onBlur={onBlurHandler}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#6b6256] hover:text-[#EAB308] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Sign In Button (Gradient + Arrow) */}
              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-lg font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 text-[#111111] shadow-lg shadow-[#EAB308]/15 mt-2"
                style={{
                  background: "linear-gradient(90deg, #EAB308 0%, #f59e0b 100%)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 20px -10px rgba(234, 179, 8, 0.15)";
                }}
              >
                <span>Sign In</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* OR Divider */}
              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-[#2a2a2a]" />
                <span className="px-2 text-[9.5px] text-[#6b6256] uppercase tracking-wider">OR</span>
                <div className="flex-1 border-t border-[#2a2a2a]" />
              </div>

              {/* Google Sign In Button */}
              <ContinueWithGoogle />


            </form>

            {/* Footer Sign Up Link */}
            <div className="mt-4 text-center">
              <p style={{ fontSize: "11px", color: "#9b8f79" }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold transition-colors duration-200"
                  style={{ color: "#EAB308" }}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Login;