import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios/useAxios";
import PulseLoader from "react-spinners/PulseLoader";
import { Button } from "@material-tailwind/react";
const Register = () => {
  const navigate = useNavigate();
  const axiosCommon = useAxios();
  const { createUser, profileUpdate } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosCommon.post(`/users`, info);
      return data;
    },
    onSuccess: () => {
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।");
    },
    onError: () => {
      toast.error("দুঃখিত, কিছু ভুল হয়েছে।");
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
  
    try {
      const checkUser = { email: data.email, phone: data.phone };
      const { data: isExists } = await axiosCommon.post(`/users/check`, checkUser);
  
      if (isExists.exists) {
        toast.error(`${isExists.message}`);
        setLoading(false);
        return;
      }
  
      // Proceed with registration
      const info = await createUser(data.email, data.password);
      await profileUpdate(data.name);
  
      const saveUser = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        referral: data.referral || null,
        uid: info.user.uid,
      };
  
      await mutateAsync(saveUser);
      reset();
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("নিবন্ধন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  
  
  return (
    <div className="min-h-screen p-3 relative bg-background text-text-primary flex items-center justify-center">
      <button
        onClick={() => navigate("/")}
        className="absolute top-2 left-4 btn p-4 rounded-lg bg-background-secondary shadow-xl"
      >
        <FaArrowLeft />
      </button>
      <div className="bg-background-section rounded-lg p-3 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">সাইন আপ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm mb-1">ব্যবহারকারীর নাম</label>
            <input
              {...register("name", {
                required: "ব্যবহারকারীর নাম আবশ্যক।",
                minLength: {
                  value: 4,
                  message: "নাম অন্তত ৪ অক্ষরের হতে হবে।",
                },
                maxLength: {
                  value: 15,
                  message: "নাম সর্বাধিক ১৫ অক্ষরের হতে পারে।",
                },
              })}
              type="text"
              placeholder="৪-১৫ অক্ষর লিখুন"
              className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-400"
              aria-label="ব্যবহারকারীর নাম"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm mb-1">ফোন নাম্বার</label>
            <input
              {...register("phone", {
                required: "ফোন নাম্বার আবশ্যক।",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "১০-১৫ ডিজিটের সঠিক ফোন নাম্বার দিন।",
                },
              })}
              type="tel"
              placeholder="আপনার ফোন নাম্বার লিখুন"
              className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-400"
              aria-label="ফোন নাম্বার"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">ই-মেইল</label>
            <input
              {...register("email", {
                required: "ই-মেইল আবশ্যক।",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "সঠিক ই-মেইল ঠিকানা দিন।",
                },
              })}
              type="email"
              placeholder="ই-মেইল"
              className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-400"
              aria-label="ই-মেইল"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "পাসওয়ার্ড আবশ্যক।",
                  minLength: {
                    value: 6,
                    message: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="৬-২০ অক্ষর লিখুন"
                className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-400"
                aria-label="পাসওয়ার্ড"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
                aria-label="পাসওয়ার্ড দেখুন"
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

          {/* Referral Code */}
          <div>
            <label className="block text-sm mb-1">রেফার কোড (ঐচ্ছিক)</label>
            <input
              {...register("referral", {
                maxLength: {
                  value: 10,
                  message: "রেফার কোড সর্বাধিক ১০ অক্ষরের হতে পারে।",
                },
              })}
              color="white"
              type="text"
              placeholder="রেফার কোড লিখুন (ঐচ্ছিক)"
              className="w-full px-4 py-2 border rounded-md bg-background-secondary text-text-primary focus:outline-none focus:ring focus:ring-blue-400"
              aria-label="রেফার কোড"
            />
            {errors.referral && (
              <p className="text-red-500 text-sm mt-1">
                {errors.referral.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-center">
              <input
                {...register("terms", {
                  required: "আপনাকে শর্তসমূহ মেনে নিতে হবে।",
                })}
                type="checkbox"
                className="mr-2"
              />
              <span className="text-sm">আমি ১৮ বছরের এবং শর্তাদি সম্মত।</span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full mb-5 bg-primary hover:bg-green-700 text-white  flex justify-center items-center"
          >
            {loading ? (
              <div>
              
                <PulseLoader size={8} color="#ffffff" />
              </div>
            ) : (
              "নিশ্চিত করুন"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
