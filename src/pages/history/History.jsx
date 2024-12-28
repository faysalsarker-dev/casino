
import {  Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { FaTrophy, FaTimesCircle } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";

const History = () => {
  const axiosSecure = useAxiosSecure();
  const {user} = useAuth();
  const { data:gameHistory = [], isLoading, isError } = useQuery({
    queryKey: ['history',user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/history/${user?.email}`);
      return data;
    },
  });


  return (
    <div className="p-4 bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-primary text-white p-4 rounded-lg mb-6">
        <h1 className="text-xl font-bold">Game History</h1>
        <p className="text-sm opacity-80">Your recent game results</p>
      </div>

      {/* History Section */}
      <div className="bg-gray-800 shadow-md rounded-lg p-4">
      <Typography variant="h4" className="mb-4 text-start pl-2 border-l-4 border-l-primary text-text-white">
      History
      </Typography>
        
        <div className="space-y-4 mb-8">
          {gameHistory.map((item) => (
            <div
              key={item._id}
              className={`flex justify-between items-center p-4 rounded-lg ${
                item.status === "win" ? "bg-green-700" : "bg-red-700"
              }`}
            >
              <div className="flex items-center space-x-4">
                {item.status === "win" ? (
                  <FaTrophy className="text-yellow-400 text-2xl" />
                ) : (
                  <FaTimesCircle className="text-red-400 text-2xl" />
                )}
                <div>
                  <p className="font-bold">{item.gameName}</p>
                  <p className="text-sm opacity-80">{new Date(item.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
              <p className={`font-bold text-lg ${item.winAmount > 0 ? "text-green-300" : "text-red-300"}`}>
                ৳ {item.winAmount > 0 ? "+" : ""}
                {item.winAmount > 0 ? item.winAmount : item.betAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
