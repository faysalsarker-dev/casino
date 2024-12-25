
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
  
  import "react-loading-skeleton/dist/skeleton.css";
  
  
  
  const accountDetails = [
    { type: "Bkash", address: "9823450983484589" },
    { type: "Nogod", address: "9823450983484589" },
    { type: "Rocket", address: "9823450983484589" },
  ];
  
  const Request = () => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
  



    const { data = [], isLoading, isError } = useQuery({
      queryKey: ['peyment'],
      queryFn: async () => {
        const { data } = await axiosSecure.get('/peyment');
        return data;
      },
    });

    const { mutateAsync, isLoading: isRequesting } = useMutation({
      mutationFn: async (info) => {
        const { data } = await axiosSecure.post(`/deposit`, info);
        return data;
      },
      onSuccess: () => {
        toast.success("Deposit request submitted successfully.");
        reset();
    
      },
      onError: () => {
        toast.error("An error occurred while submitting your request.");
      },
    });
  
  
  
    const onSubmit = (formData) => {
      const requestData = {
        email: user?.email,
        status:'pending',
        ...formData,
      };
      mutateAsync(requestData);
    };
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`);
    };
  
    return (
      <div className=" w-full mx-auto bg-gray-900 text-white">
      

        {/* Account Details Section */}
        <Card className="mb-8 bg-gray-800 text-white">
          <CardBody className="grid gap-4">
            <Typography variant="h6" className="mb-4 text-gray-300">
              Account Details
            </Typography>
            {data?.depositAddresses?.map((info) => (
              <div
                key={info.type}
                className="flex justify-between items-center p-4 border border-gray-700 rounded-lg bg-gray-700 shadow-sm"
              >
                <div>
                  <Typography variant="small">{info.paymentType}</Typography>
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
      
      </div>
    );
  };
  
  export default Request;
  