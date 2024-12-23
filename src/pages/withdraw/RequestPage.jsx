import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button, Card, CardBody, Input, Option, Select, Typography } from "@material-tailwind/react";
import useAxios from './../../hooks/useAxios/useAxios';


const RequestPage = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const axiosCommon = useAxios()
    const { user } = useAuth();
  
    const { mutateAsync, isLoading: isRequesting } = useMutation({
      mutationFn: async (info) => {
        const { data } = await axiosCommon.post(`/withdraw`, info);
        return data;
      },
      onSuccess: () => {
        toast.success("Withdrawal request submitted successfully.");
        reset();
       
      },
      onError: () => {
        toast.error("An error occurred while submitting your request.");
      },
    });
  
  
  
    const onSubmit = (formData) => {
      try {
        const requestData = {
          email: user?.email,
          ...formData,
        };
        mutateAsync(requestData);
      } catch (error) {
        console.log(error);
      }
      
    };
  
    return (
        <div>
             <Card className="mb-8 bg-gray-800 text-white">
        <CardBody className="p-6">
          <Typography variant="h6" className="mb-4 text-white">
            Submit a Withdrawal Request
          </Typography>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
         

            <Input
              label="type"
              className="bg-gray-700 text-gray-200"
              {...register("type", { required: true })}
            />
            <Input
              label="Amount"
              className="bg-gray-700 text-gray-200"
              {...register("amount", { required: true })}
            />

            <Input
              label="Number"
              type="number"
              className="bg-gray-700 text-gray-200"
              {...register("number", { required: true })}
            />

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
        </div>
    );
};

export default RequestPage;