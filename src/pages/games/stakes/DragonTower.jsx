import React, { useState } from "react";
import { motion } from "framer-motion";

const DragonTower = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedPath, setSelectedPath] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  const difficultyConfig = {
    easy: { boxes: 4, booms: 1 },
    medium: { boxes: 3, booms: 1 },
    hard: { boxes: 3, booms: 2 },
  };

  const { boxes, booms } = difficultyConfig[difficulty];

  // Generate the tower dynamically based on difficulty
  const generateTower = () => {
    const rows = 5; // Fixed number of rows
    return Array(rows)
      .fill(null)
      .map(() => {
        const row = Array(boxes).fill(true); // All safe initially
        for (let i = 0; i < booms; i++) {
          row[i] = false; // Add booms
        }
        return row.sort(() => Math.random() - 0.5); // Shuffle the row
      });
  };

  const [tower, setTower] = useState(generateTower);

  const handleTileClick = (index) => {
    if (gameOver || won) return;

    const isSafe = tower[currentLevel][index];
    const newSelectedPath = [...selectedPath, { level: currentLevel, index, isSafe }];
    setSelectedPath(newSelectedPath);

    if (isSafe) {
      if (currentLevel === tower.length - 1) {
        setWon(true); // Player wins if they clear the last level
      } else {
        setCurrentLevel(currentLevel + 1);
      }
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentLevel(0);
    setSelectedPath([]);
    setGameOver(false);
    setWon(false);
    setTower(generateTower());
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    handleRestart(); // Restart the game when difficulty changes
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold my-8">Dragon Tower</h1>

      {/* Difficulty Selector */}
      <div className="mb-6">
        <label htmlFor="difficulty" className="mr-4 text-lg">
          Select Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {tower.map((level, levelIndex) => (
          <motion.div
            key={levelIndex}
            className={`flex justify-center gap-4 ${
              levelIndex === currentLevel ? "ring-4 ring-blue-500 p-2" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.2 }}
          >
            {level.map((tile, tileIndex) => {
              const isSelected = selectedPath.some(
                (p) => p.level === levelIndex && p.index === tileIndex
              );
              const result = selectedPath.find(
                (p) => p.level === levelIndex && p.index === tileIndex
              );

              return (
                <motion.div
                  key={tileIndex}
                  className={`w-16 h-16 flex items-center justify-center rounded-md cursor-pointer ${
                    isSelected
                      ? result?.isSafe
                        ? "bg-green-500"
                        : "bg-red-500"
                      : levelIndex === currentLevel
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-800"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => levelIndex === currentLevel && handleTileClick(tileIndex)}
                >
                  {isSelected && (result?.isSafe ? "✅" : "💀")}
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Game Over! 💀</h2>
          <button
            onClick={handleRestart}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Restart
          </button>
        </div>
      )}

      {won && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-green-500">You Win! 🎉</h2>
          <button
            onClick={handleRestart}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DragonTower;
