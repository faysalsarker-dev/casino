
import { useQuery } from "@tanstack/react-query";
import { FaTrophy, FaRegSadTear } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useAxiosSecure from "../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../hooks/useAuth/useAuth";

const History = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { data: gameHistory = [], isLoading, isError } = useQuery({
    queryKey: ["history", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/history/${user?.email}`);
      return data;
    },
  });

  return (
    <div className="p-4 bg-background text-text-primary">
      {/* Header */}
      <div className="bg-background-section mt-20 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Game History</h1>
        <p className="text-sm opacity-80">Your recent game results</p>
      </div>

      {/* History Section */}
      <div className="bg-background-secondary shadow-md rounded-lg p-4">
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} height={60} className="rounded-lg" />
            ))}
          </div>
        )}

        {isError && <p className="text-red-500">Failed to load game history.</p>}

        {!isLoading && gameHistory.length === 0 && (
          <p className="text-center opacity-70">No game history available.</p>
        )}

        <div className="space-y-4">
          {!isLoading &&
            gameHistory.map((item) => (
              <div
                key={item._id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
                  item.status === "win"
                    ? ""
                    : " text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-4">
                  {item.status === "win" ? (
                    <FaTrophy className="text-yellow-500 text-2xl" />
                  ) : (
                    <FaRegSadTear className="text-gray-500 text-2xl" />
                  )}
                  <div>
                    <p className="font-bold">{item.gameName}</p>
                    <p className="text-sm opacity-80">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-bold text-lg ${
                    item.status === "win"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {item.status === "win" ? `৳ +${item.winAmount}` : `৳ -${item.betAmount}`}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default History;
