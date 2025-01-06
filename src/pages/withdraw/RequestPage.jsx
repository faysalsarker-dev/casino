import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import useAxios from './../../hooks/useAxios/useAxios';
import { useState } from "react";
import PropTypes from 'prop-types';
import { BeatLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";




const RequestPage = ({refetch}) => {
  const [isRequesting,setIsRequesting] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const axiosCommon = useAxios()
    const axiosSecure = useAxiosSecure();
 
    const { user ,userInfo ,setUserInfo} = useAuth();
  

    const { data, isLoading } = useQuery({
      queryKey: ["peyment"],
      queryFn: async () => {
        const { data } = await axiosSecure.get("/peyment");
        return data;
      },
    });


    const { mutateAsync } = useMutation({
      mutationFn: async (info) => {
        const { data } = await axiosCommon.post(`/withdraw`, info);
        return data;
      },
      onSuccess: (data) => {
        toast.success("Withdrawal request submitted successfully.");
        reset();
        refetch()
        setIsRequesting(false);
        setUserInfo(data.user)
       
      },
      onError: () => {
        setIsRequesting(false)
        toast.error("An error occurred while submitting your request.");
      },
    });
  
  
  
    const onSubmit = (formData) => {
      if(userInfo.winBalance < formData.amount){
        toast.error("Insufficient balance")
        reset();
        return
      }
      setIsRequesting(true);
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
             <Card className="mb-8 mt-5 bg-background-secondary text-text-primary">
        <CardBody className="p-3">
          <Typography variant="h6" className="mb-4 text-white">
            Submit a Withdrawal Request
          </Typography>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
         
  <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full bg-background-secondary text-texxt-primary border border-gray-300 rounded-md px-3 py-2"
              {...register("type", { required: "Payment type is required" })}
            >
              <option value="" selected disabled>
                Select payment type
              </option>
              {isLoading ? (
                <Skeleton count={1} height={36} />
              ) : (
                data?.withdrawType.map((info) => (
                  <option key={info?._id} value={info.withdrawType}>
                    {info.withdrawType}
                  </option>
                ))
                
              )}
            </select>
            <Input
              label="Amount"
                 color="white"
              {...register("amount", { required: true })}
            />

            <Input
              label="Number"
              color="white"
              {...register("number", { required: true })}
            />

            <Button
              className="bg-primary  "
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
RequestPage.propTypes = {
  refetch: PropTypes.func.isRequired,
};


export default RequestPage;