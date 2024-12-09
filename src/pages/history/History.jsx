
import {  Typography } from "@material-tailwind/react";
import { FaTrophy, FaTimesCircle } from "react-icons/fa";

const History = () => {
  // Mock data for user game history
  const gameHistory = [
    { id: 1, game: "Game 1", result: "Win", date: "2024-12-01", amount: 500 },
    { id: 2, game: "Game 2", result: "Lose", date: "2024-12-02", amount: -300 },
    { id: 3, game: "Game 3", result: "Win", date: "2024-12-03", amount: 700 },
    { id: 4, game: "Game 4", result: "Lose", date: "2024-12-04", amount: -400 },
    { id: 5, game: "Game 5", result: "Win", date: "2024-12-05", amount: 600 },
  ];

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
        
        <div className="space-y-4">
          {gameHistory.map((item) => (
            <div
              key={item.id}
              className={`flex justify-between items-center p-4 rounded-lg ${
                item.result === "Win" ? "bg-green-700" : "bg-red-700"
              }`}
            >
              <div className="flex items-center space-x-4">
                {item.result === "Win" ? (
                  <FaTrophy className="text-yellow-400 text-2xl" />
                ) : (
                  <FaTimesCircle className="text-red-400 text-2xl" />
                )}
                <div>
                  <p className="font-bold">{item.game}</p>
                  <p className="text-sm opacity-80">{item.date}</p>
                </div>
              </div>
              <p className={`font-bold text-lg ${item.amount > 0 ? "text-green-300" : "text-red-300"}`}>
                ৳ {item.amount > 0 ? "+" : ""}
                {item.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
