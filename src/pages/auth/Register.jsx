import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Card, Typography } from "@material-tailwind/react";

export default function CasinoRegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background-dark">
      <Card className="w-full max-w-lg p-8 bg-background h-full mt-72 shadow-lg border border-primary-600">
        <Typography
          variant="h3"
          className="text-center text-primary font-bold mb-6"
        >
          Join the Casino
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <Input
            size="lg"
            label="Username"
            color="primary"
            className="text-white placeholder-gray-400"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}

          {/* Email */}
          <Input
            size="lg"
            type="email"
            label="Email"
            color="primary"
            className="text-white placeholder-gray-400"
            {...register("email", {
              required: "Email is required",
              pattern: /^\S+@\S+$/i,
            })}
            error={!!errors.email}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          {/* Phone Number */}
          <Input
            size="lg"
            type="tel"
            label="Phone Number"
            color="primary"
            className="text-white placeholder-gray-400"
            {...register("phone", {
              required: "Phone number is required",
              minLength: 10,
              maxLength: 15,
            })}
            error={!!errors.phone}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}

          {/* Password */}
          <div className="relative">
            <Input
              size="lg"
              type={showPassword ? "text" : "password"}
              label="Password"
              color="primary"
              className="text-white placeholder-gray-400"
              {...register("password", {
                required: "Password is required",
                minLength: 6,
              })}
              error={!!errors.password}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 cursor-pointer text-primary-400"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            color="primary"
            fullWidth
            className="bg-gradient-to-r from-primary-600 to-primary text-black font-bold"
          >
            Register Now
          </Button>
        </form>

        <Typography
          variant="small"
          className="mt-6 text-center text-gray-400"
        >
          Already have an account?{" "}
          <span className="text-primary-400 cursor-pointer">Log In</span>
        </Typography>
      </Card>
    </div>
  );
}
