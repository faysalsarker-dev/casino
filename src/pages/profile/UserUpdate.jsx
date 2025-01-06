import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";

const UserUpdate = ({ handleOpen, open = false }) => {
  const { userInfo, user, profileUpdate } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
    });
  }, [userInfo, reset]);

  // Check if the user updated within the last 30 days
  const lastUpdate = new Date(userInfo?.updatedAt);
  const now = new Date();
  const daysSinceLastUpdate = Math.floor(
    (now - lastUpdate) / (1000 * 60 * 60 * 24)
  );
  const isWithin30Days = daysSinceLastUpdate < 30;

  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.put(`/users/${userInfo._id}`, info);
      return data;
    },
    onSuccess: () => {
      reset();
      handleOpen();
      toast.success("Information Updated");
    },
    onError: () => {
      console.error("Failed to update user information.");
      toast.error("something wrong");
    },
  });

  const onSubmit = async (data) => {
    if (user.DisplayName !== data.name) {
      profileUpdate(data.name);
    }
    await mutateAsync(data);
  };

  return (
    <Dialog open={open} handler={handleOpen} className="bg-background-section">
      <DialogHeader className="text-text-primary">
        Update Your Profile 
      </DialogHeader>
      <DialogBody>
        {isWithin30Days && (
          <div className="mb-4 text-red-500 font-medium">
            You cannot update 2 times in a month
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "name is required" })}
              className="block w-full rounded-md bg-background-secondary text-text-primary border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
              disabled={isWithin30Days}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "সঠিক ইমেইল দিন",
                },
              })}
              className="block w-full rounded-md bg-background-secondary text-text-primary border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
              disabled
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary">
              Phone
            </label>
            <input
              type="text"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "সঠিক ফোন নাম্বার দিন",
                },
              })}
              className="block w-full rounded-md bg-background-secondary text-text-primary border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
              disabled={isWithin30Days}
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="text"
              className="border border-secondary text-secondary"
              onClick={handleOpen}
            >
              cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white"
            //   disabled={isWithin30Days}
            >
              Update
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

UserUpdate.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default UserUpdate;
