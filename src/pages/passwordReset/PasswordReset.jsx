
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
import { Link } from "react-router-dom";

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
    <div className="flex items-center justify-center h-screen bg-background px-4 text-text-primary">
      <div className="w-full max-w-lg  text-text-primary">
        <Typography
          variant="h4"
          className="text-center font-bold text-primary mb-8"
        >
          Reset Your Password
        </Typography>

        <Card className="bg-background-section text-text-primary shadow-lg">
          <CardBody className="p-6 space-y-6">
            <Typography
              variant="paragraph"
              className=" text-center mb-4"
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
                  color="white"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  error={!!errors.email}
                  className="bg-background-secondary  border-primary text-text-primary"
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
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
