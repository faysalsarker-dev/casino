import  { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaError, setCaptchaError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Generate random CAPTCHA
  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaError("");
  };

  const onSubmit = (data) => {
    if (data.captchaInput !== captcha) {
      setCaptchaError("Captcha did not match!");
      return;
    }
    alert("Registration successful!");
    reset();
    setCaptcha(generateCaptcha());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">সাইন আপ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm mb-1">ব্যবহারকারীর নাম</label>
            <input
              {...register("username", {
                required: "Username is required",
                minLength: { value: 4, message: "Must be at least 4 characters" },
                maxLength: { value: 15, message: "Must not exceed 15 characters" },
              })}
              type="text"
              placeholder="৪-১৫ অক্ষর নাম্বার এলাউড"
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm mb-1">ফোন নাম্বার</label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Enter a valid phone number (10-15 digits)",
                },
              })}
              type="tel"
              placeholder="আপনার ফোন নাম্বার লিখুন"
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm mb-1">রেফার কোড (ঐচ্ছিক)</label>
            <input
              {...register("referral", {
                maxLength: {
                  value: 10,
                  message: "Referral code must not exceed 10 characters",
                },
              })}
              type="text"
              placeholder="রেফার কোড লিখুন (ঐচ্ছিক)"
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            />
            {errors.referral && (
              <p className="text-red-500 text-sm mt-1">{errors.referral.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Must be at least 6 characters" },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="৬-২০ অক্ষর নাম্বার এলাউড"
                className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">ই-মেইল</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="ই-মেইল"
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* CAPTCHA */}
          <div>
            <label className="block text-sm mb-1">ভেরিফিকেশন কোড</label>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-gray-700 rounded-md font-mono text-lg">
                {captcha}
              </span>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
              >
                ↻
              </button>
            </div>
            <input
              {...register("captchaInput", { required: "Captcha is required" })}
              type="text"
              placeholder="Enter the code above"
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-400 mt-2"
            />
            {errors.captchaInput && (
              <p className="text-red-500 text-sm mt-1">
                {errors.captchaInput.message}
              </p>
            )}
            {captchaError && (
              <p className="text-red-500 text-sm mt-1">{captchaError}</p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-center">
              <input
                {...register("terms", { required: "You must accept the terms" })}
                type="checkbox"
                className="mr-2"
              />
              <span className="text-sm">
                আমি ১৮ বছরের বয়সী এবং শর্তাদি শর্তে সম্মত।
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            নিশ্চিত করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
