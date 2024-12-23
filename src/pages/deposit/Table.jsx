import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";
import { Card, CardBody } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import useAxios from './../../hooks/useAxios/useAxios';
const TABLE_HEAD = ["Payment Type", "Transaction Code", "Number", "Status"];

const Table = () => {
    const axiosSecure = useAxiosSecure();
    const axiosCommon = useAxios()
    const { user } = useAuth();
    const { data = [], isLoading, isError } = useQuery({
        queryKey: ["my-deposit"],
        queryFn: async () => {
          const { data } = await axiosCommon.get(`/deposit/${user?.email}`);
          return data;
        },
      });
    return (
        <div>
                <Card className="overflow-hidden bg-gray-800">
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full table-auto text-left text-gray-300">
            <thead>
              <tr className="bg-gray-700">
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="px-2 py-2 text-sm font-semibold text-gray-400">
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
                      <td key={i} className="px-2 py-2">
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

export default Table;