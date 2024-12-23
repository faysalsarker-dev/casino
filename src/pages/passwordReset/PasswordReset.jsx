
import { useForm } from "react-hook-form";

import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth/useAuth";

const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const {resetPassword}=useAuth()

  const onSubmit = async (data) => {
    const { email } = data;
    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Please check your inbox.");
      reset();
    } catch (error) {
      toast.error(
        error.message || "Failed to send password reset email. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 px-4">
      <div className="w-full max-w-lg -mt-20">
        <Typography
          variant="h4"
          className="text-center font-bold text-primary mb-8"
        >
          Reset Your Password
        </Typography>

        <Card className="bg-gray-800 shadow-lg">
          <CardBody className="p-6 space-y-6">
            <Typography
              variant="paragraph"
              className="text-gray-300 text-center mb-4"
            >
              Enter your registered email address, and we&apos;ll send you a link to
              reset your password.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  error={!!errors.email}
                  className="bg-gray-700 text-gray-200 border-primary"
                />
                {errors.email && (
                  <Typography
                    variant="small"
                    className="text-red-500 mt-1"
                  >
                    {errors.email.message}
                  </Typography>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3"
                disabled={Object.keys(errors).length > 0}
              >
                Send Reset Email
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="mt-6 text-center">
          <Typography
            variant="small"
            className="text-gray-400"
          >
            Remember your password?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Login
            </a>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
