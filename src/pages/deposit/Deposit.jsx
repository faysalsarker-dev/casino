
import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  Option,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TABLE_HEAD = ["Payment Type", "Transaction Code", "Number", "Status"];

const accountDetails = [
  { type: "Bkash", address: "9823450983484589" },
  { type: "Nogod", address: "9823450983484589" },
  { type: "Rocket", address: "9823450983484589" },
];

const DepositRequestPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { mutateAsync, isLoading: isRequesting } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/deposit`, info);
      return data;
    },
    onSuccess: () => {
      toast.success("Deposit request submitted successfully.");
      reset();
      refetch();
    },
    onError: () => {
      toast.error("An error occurred while submitting your request.");
    },
  });

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["my-deposit"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/deposit/${user?.email}`);
      return data;
    },
  });

  const onSubmit = (formData) => {
    const requestData = {
      email: user?.email,
      ...formData,
    };
    mutateAsync(requestData);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-900 text-white">
      <Typography variant="h4" textGradient className="text-center mb-6 text-primary">
        Deposit Request
      </Typography>

      {/* Account Details Section */}
      <Card className="mb-8 bg-gray-800 text-white">
        <CardBody className="grid gap-4">
          <Typography variant="h6" className="mb-4 text-gray-300">
            Account Details
          </Typography>
          {accountDetails.map((info) => (
            <div
              key={info.type}
              className="flex justify-between items-center p-4 border border-gray-700 rounded-lg bg-gray-700 shadow-sm"
            >
              <div>
                <Typography variant="small">{info.type}</Typography>
                <Typography variant="small" className="font-medium">
                  {info.address}
                </Typography>
              </div>
              <IconButton
                variant="text"
                className="text-primary bg-blue-gray-100"
                onClick={() => copyToClipboard(info.address)}
                aria-label={`Copy ${info.type} address`}
              >
                <FaCopy />
              </IconButton>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Input Form */}
      <Card className="mb-8 bg-gray-800 text-white">
        <CardBody className="p-6">
          <Typography variant="h6" className="mb-4 text-white">
            Submit a Deposit Request
          </Typography>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Payment Type - Select */}
            <Input
              label="Payment Type"
              className="bg-gray-700 text-gray-200"
              {...register("paymentType", { required: "Transaction code is required" })}
            />
            {errors.paymentType && (
              <Typography variant="small" className="text-red-500">
                {errors.paymentType.message}
              </Typography>
            )}

            {/* Transaction Code */}
            <Input
              label="Transaction Code"
              className="bg-gray-700 text-gray-200"
              {...register("transactionCode", { required: "Transaction code is required" })}
            />
            {errors.transactionCode && (
              <Typography variant="small" className="text-red-500">
                {errors.transactionCode.message}
              </Typography>
            )}

            {/* Number */}
            <Input
              label="Number"
              type="number"
              className="bg-gray-700 text-gray-200"
              {...register("number", { required: "Number is required" })}
            />
            {errors.number && (
              <Typography variant="small" className="text-red-500">
                {errors.number.message}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              type="submit"
              fullWidth
              disabled={isRequesting}
            >
              {isRequesting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Requests Table */}
      <Card className="overflow-hidden bg-gray-800">
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full table-auto text-left text-gray-300">
            <thead>
              <tr className="bg-gray-700">
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="px-4 py-2 text-sm font-semibold text-gray-400">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    {TABLE_HEAD.map((_, i) => (
                      <td key={i} className="px-4 py-2">
                        <Skeleton height={20} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="px-4 py-4 text-center text-red-400">
                    Something went wrong. Please try again later.
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="px-4 py-4 text-center text-gray-400">
                    You have no requests yet.
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length > 0 ? (
                data.map(({ paymentType, transactionCode, number, status }, index) => {
                  const isLast = index === data.length - 1;
                  const rowClass = isLast ? "" : "border-b border-gray-700";

                  return (
                    <tr key={transactionCode} className={rowClass}>
                      <td className="px-4 py-2 text-sm">{paymentType}</td>
                      <td className="px-4 py-2 text-sm">{transactionCode}</td>
                      <td className="px-4 py-2 text-sm">{number}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`py-1 px-2 rounded-full text-xs font-medium ${
                            status === "Success"
                              ? "bg-green-700 text-green-300"
                              : "bg-yellow-700 text-yellow-300"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="px-4 py-4 text-center text-gray-400">
                    Invalid data format received.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default DepositRequestPage;
