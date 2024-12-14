import React from "react";
import { useForm } from "react-hook-form";
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


const TABLE_HEAD = ["Payment Type", "Transaction Code", "Number", "Status"];

const accountDetails = [
  {
    type: "Bkash",
    address: "9823450983484589",
  },
  {
    type: "Nogod",
    address: "9823450983484589",
  },
  {
    type: "Rocket",
    address: "9823450983484589",
  },
];

const TABLE_ROWS = [
  {
    paymentType: "Bank Transfer",
    transactionCode: "TX123456",
    number: "1234567890",
    status: "Pending",
  },
  {
    paymentType: "Credit Card",
    transactionCode: "CC654321",
    number: "0987654321",
    status: "Pending",
  },
  {
    paymentType: "PayPal",
    transactionCode: "PP112233",
    number: "1122334455",
    status: "Success",
  },
  {
    paymentType: "PayPal",
    transactionCode: "PP445566",
    number: "5566778899",
    status: "Success",
  },
  {
    paymentType: "PayPal",
    transactionCode: "PP445566",
    number: "5566778899",
    status: "Success",
  },
];

const DepositRequestPage = () => {
  const { register, handleSubmit, reset } = useForm();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    reset(); // Reset form fields
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-900 text-white">
      <Typography
        variant="h4"
        color="blue"
        textGradient
        className="text-center mb-6"
      >
        Deposit Request
      </Typography>

      {/* Account Details Section */}
      <Card className="mb-8 bg-gray-800 text-white">
        <CardBody className="grid gap-4">
          <Typography variant="h6" color="gray-300" className="mb-4">
            Account Details
          </Typography>
          {accountDetails.map((info) => (
            <div
              key={info.type}
              className="flex justify-between text-white items-center p-4 border border-gray-700 rounded-lg shadow-sm bg-gray-700"
            >
              <div>
                <Typography variant="small" >
                  {info.type}
                </Typography>
                <Typography
                  variant="small"
                
                  className="font-medium"
                >
                  {info.address}
                </Typography>
              </div>
              <IconButton
                variant="text"
                color="blue"
                onClick={() => copyToClipboard(info.address)}
              >
               <FaCopy />
              </IconButton>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Input Form */}
      <Card className="mb-8 text-white bg-gray-800">
        <CardBody className="p-6">
          <Typography variant="h6" className="mb-4 text-white">
            Submit a Deposit Request
          </Typography>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Payment Type */}
            <Select
              label="Payment Type"
              {...register("paymentType", { required: true })}
              className="bg-gray-700 text-gray-200"
            >
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="PayPal">PayPal</Option>
            </Select>

            {/* Transaction Code */}
            <Input
              label="Transaction Code"
              {...register("transactionCode", { required: true })}
              className="bg-gray-700 text-gray-200"
            />

            {/* Number */}
            <Input
              label="Number"
              type="number"
              {...register("number", { required: true })}
              className="bg-gray-700 text-gray-200"
            />

            {/* Submit Button */}
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              type="submit"
              fullWidth
            >
              Submit Request
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Requests Table */}
      <Card className="overflow-hidden bg-gray-800">
        <CardBody className="p-0">
          <table className="w-full table-auto text-left text-gray-300">
            <thead>
              <tr className="bg-gray-700">
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="px-4 py-2 text-sm font-semibold text-gray-400"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(({ paymentType, transactionCode, number, status }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
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
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default DepositRequestPage;
