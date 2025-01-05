import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth/useAuth";
import { PulseLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user,loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      navigate(location.state?.from || "/");
    } catch (error) {
      console.error("Login failed", error);
      alert("লগইন ব্যর্থ হয়েছে, দয়া করে আবার চেষ্টা করুন।");
    }
  };

  useEffect(() => {
    if (user) {
      navigate(location.state?.from || "/");
    }
  }, [user, location.state, navigate]);

  return (
    <div className="min-h-screen p-3 relative bg-background text-text-primary flex items-center justify-center">
                     <button onClick={()=>navigate('/')} className='absolute top-2 left-4 btn p-4 rounded-lg bg-background-secondary shadow-xl'>
                 <FaArrowLeft />

      </button>
      <div className="bg-background-section rounded-lg p-3 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">লগইন</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              ই-মেইল
            </label>
            <input
              id="email"
              {...register("email", {
                required: "ই-মেইল আবশ্যক",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "সঠিক ই-মেইল ঠিকানা লিখুন",
                },
              })}
              type="email"
              color="white"
              placeholder="ই-মেইল লিখুন"
              className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-500"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password", {
                  required: "পাসওয়ার্ড আবশ্যক",
                  minLength: {
                    value: 6,
                    message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                  },
                })}
                color="white"
                type={showPassword ? "text" : "password"}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-500"
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
                aria-label="পাসওয়ার্ড প্রদর্শন/লুকান"
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
            {/* Forgot Password Link */}
            <div className="text-right">
            <Link to="/reset" className="text-primary hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
            </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 rounded-md"
          >
 {loading ? (
              <div>
              
                <PulseLoader size={8} color="#ffffff" />
              </div>
            ) : (
              "লগইন"
            )}


           
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          আপনার কোনো অ্যাকাউন্ট নেই ?{" "}
          <Link to="/register" className="text-primary hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
