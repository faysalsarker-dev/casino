import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

const Request = ({ refetch }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isRequesting,setIsRequesting] = useState(false);

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["peyment"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/payment");
      return data;
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/deposit`, info);
      return data;
    },
    onSuccess: () => {
      toast.success("Deposit request submitted successfully.");
      reset();
      refetch();
      setIsRequesting(false)
    },
    onError: () => {
      setIsRequesting(false)
      toast.error("An error occurred while submitting your request.");
    },
  });

  const onSubmit = (formData) => {
    setIsRequesting(true);
    const requestData = {
      email: user?.email,
      status: "pending",
      ...formData,
    };
    mutateAsync(requestData);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  return (
    <div className="w-full mx-auto mt-5 text-text-primary">
      {/* Account Details Section */}
      <Card className="mb-8 bg-background-section text-text-primary">
        <div className="grid gap-4 px-3 py-4">
          <Typography variant="h4" className="mb-2">
            Account Details
          </Typography>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                height={80}
                className="rounded-lg"
              />
            ))
          ) : isError ? (
            <Typography variant="small" className="text-red-500">
              Failed to load account details.
            </Typography>
          ) : (
            data?.depositAddresses?.map((info) => (
              <div
                key={info.type}
                className="flex justify-between items-center p-4 border border-gray-700 rounded-lg bg-background-secondary shadow-sm"
              >
                <div>
                  <Typography variant="small">{info.paymentType}</Typography>
                  <Typography variant="small" className="font-medium">
                    {info.address}
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  className="text-primary bg-background-section"
                  onClick={() => copyToClipboard(info.address)}
                  aria-label={`Copy ${info.type} address`}
                >
                  <FaCopy />
                </IconButton>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Input Form */}
      <Card className="mb-12 bg-background-secondary text-white">
        <CardBody className="p-3">
          <Typography variant="h6" className="mb-4 text-white">
            Submit a Deposit Request
          </Typography>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Payment Type - Select */}
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full bg-background-secondary text-texxt-primary border border-gray-300 rounded-md px-3 py-2"
              {...register("paymentType", { required: "Payment type is required" })}
            >
              <option value="" selected disabled>
                Select payment type
              </option>
              {isLoading ? (
                <Skeleton count={1} height={36} />
              ) : (
                data?.depositAddresses?.map((info) => (
                  <option key={info?._id} value={info.paymentType}>
                    {info.paymentType}
                  </option>
                ))
                
              )}
            </select>
            {errors.paymentType && (
              <Typography variant="small" className="text-red-500">
                {errors.paymentType.message}
              </Typography>
            )}

            {/* Transaction Code */}
            <Input
              color="white"
              label="Transaction Code"
              {...register("transactionCode", {
                required: "Transaction code is required",
              })}
            />
            {errors.transactionCode && (
              <Typography variant="small" className="text-red-500">
                {errors.transactionCode.message}
              </Typography>
            )}

            {/* Number */}
            <Input
              label="Number"
              color="white"
              type="number"
              {...register("number", { required: "Number is required" })}
            />
            {errors.number && (
              <Typography variant="small" className="text-red-500">
                {errors.number.message}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              className="bg-primary text-text-primary mb-5"
              type="submit"
              fullWidth
              disabled={isRequesting}
            >
              {isRequesting ? <BeatLoader size={13} color="#ededed" />: "Submit Request"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Request;
