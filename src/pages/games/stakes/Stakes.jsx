import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import gem from "../../../images/gem.png";
import bomb from "../../../images/bomb.png";

const Stakes = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(5);
  const [bombs, setBombs] = useState(3);
  const [bombIndexes, setBombIndexes] = useState([]);
  const [revealed, setRevealed] = useState([]);

  const generateBombIndexes = (totalCells, numBombs) => {
    const bombSet = new Set();
    while (bombSet.size < numBombs) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      bombSet.add(randomIndex);
    }
    return Array.from(bombSet);
  };

  const handleStartGame = () => {
    const totalCells = rows * columns;
    if (bombs >= totalCells) {
      toast.error("Too many bombs for the grid size!");
      return;
    }
    const newBombIndexes = generateBombIndexes(totalCells, bombs);
    setBombIndexes(newBombIndexes);
    setRevealed([]);
    toast.success("🎮 New game started!");
  };

  const handleCellClick = (index) => {
    if (revealed.includes(index)) return;

    const isBomb = bombIndexes.includes(index);

    if (isBomb) {
      console.log("💥 Bomb clicked!");
      toast.error("💥 Boom! You hit a bomb!");
    } else {
      toast.success("✨ Safe! Found a gem!");
    }

    setRevealed([...revealed, index]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="p-4 flex flex-col items-center gap-6">
        {/* Game Settings */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Rows</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              className="w-full p-2 text-gray-900 rounded bg-gray-200"
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Columns</label>
            <input
              type="number"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
              className="w-full p-2 text-gray-900 rounded bg-gray-200"
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Bombs</label>
            <input
              type="number"
              value={bombs}
              onChange={(e) => setBombs(parseInt(e.target.value) || 0)}
              className="w-full p-2 text-gray-900 rounded bg-gray-200"
              min="0"
            />
          </div>
          <button
            onClick={handleStartGame}
            className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
          >
            Start Game
          </button>
        </div>

        {/* Game Board */}
        <div
          className={`grid gap-2`}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array(rows * columns)
            .fill(null)
            .map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={revealed.includes(index)}
                className={`h-16 w-16 flex items-center justify-center rounded ${
                  revealed.includes(index)
                    ? bombIndexes.includes(index)
                      ? "bg-red-500"
                      : "bg-gray-800"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {revealed.includes(index) && bombIndexes.includes(index) && (
                  <motion.img
                    src={bomb}
                    alt="bomb"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {revealed.includes(index) && !bombIndexes.includes(index) && (
                  <motion.img
                    src={gem}
                    alt="gem"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stakes;
