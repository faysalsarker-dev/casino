import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import useAxiosSecure from "../../../hooks/useAxiosSecure/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth/useAuth";
import toast from "react-hot-toast";

const BalanceTransfer = ({ handleOpen, open = false}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { userInfo, setUserInfo } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.put(`/users/${userInfo._id}`, info);
      return data;
    },
    onSuccess: (data) => {
      setUserInfo(data);
      reset();
      handleOpen(!open);
      toast.success("ইনফরমেশন সফলভাবে আপডেট হয়েছে।");
    },
    onError: () => {
      handleOpen(!open);
      toast.error("ইনফরমেশন আপডেট করা যায়নি। দয়া করে আবার চেষ্টা করুন।");
    },
  });

  const onSubmit = (data) => {
    if (parseFloat(data.amount) > userInfo.winBalance) {
      handleOpen(!open);
      toast.error("আপনার ব্যালেন্স যথেষ্ট নয়।");
      return;
    }
    const info = {
      ...userInfo,
      winBalance : userInfo.winBalance - parseFloat(data.amount),
      depositBalance: userInfo.depositBalance + parseFloat(data.amount),
    };
    
    mutateAsync(info);
  };

  return (
    <Dialog open={open} handler={handleOpen} className="bg-background-section">
      <DialogHeader className="text-text-primary">
        Balance Transfer
      </DialogHeader>
      <DialogBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Select Field for Sender */}
          <div>
            <label className="block text-sm font-medium text-text-primary">
            from
            </label>
            <select
              {...register("sender", { required: "প্রেরক নির্বাচন করুন।" })}
              className="block w-full rounded-md bg-background-secondary text-text-primary border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
              disabled
            >
              <option value="winBalance" selected>
                Win Balance
              </option>
            </select>
            {errors.sender && (
              <span className="text-red-500 text-sm">
                {errors.sender.message}
              </span>
            )}
          </div>

          {/* Select Field for Receiver */}
          <div>
            <label className="block text-sm font-medium text-text-primary">
              To
            </label>
            <select
              {...register("receiver", { required: "প্রাপক নির্বাচন করুন।" })}
              className="block w-full rounded-md bg-background-secondary text-text-primary border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
              disabled
            >
              <option value="depositBalance" selected>
                Deposit Balance
              </option>
            </select>
            {errors.receiver && (
              <span className="text-red-500 text-sm">
                {errors.receiver.message}
              </span>
            )}
          </div>

          {/* Input Field for Amount */}
          <div>
            <label className="block text-sm font-medium text-text-primary">
              Amountণ
            </label>
            <input
              type="number"
              {...register("amount", {
                required: "amount is required",
                min: {
                  value: 10,
                  message: "পরিমাণ অবশ্যই ১০ বা তার বেশি হতে হবে।",
                },
              })}
              className="block w-full rounded-md bg-background-secondary text-text-primary border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
              placeholder="Type amount"
            />
            {errors.amount && (
              <span className="text-red-500 text-sm">
                {errors.amount.message}
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
             cencel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Transfer
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

BalanceTransfer.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default BalanceTransfer;
