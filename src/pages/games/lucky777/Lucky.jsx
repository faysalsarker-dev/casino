import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const symbols = ['🍒', '🍋', '🍊', '7️⃣', '🍉'];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const Lucky777 = () => {
  const [reels, setReels] = useState(['', '', '']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(100);
  const [message, setMessage] = useState('');

  const spinReels = () => {
    if (spinning) return;

    setSpinning(true);
    setReels(['🔄', '🔄', '🔄']);
    setBalance(balance - 10);
    setMessage('');

    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Animate reels individually with delays
    const delays = [0, 500, 1000];
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setReels((prevReels) => {
          const updatedReels = [...prevReels];
          updatedReels[index] = getRandomSymbol();
          return updatedReels;
        });
      }, delay);
    });

    setTimeout(() => {
      setReels(newReels);
      setSpinning(false);
      checkWin(newReels);
    }, 3000); // Total spin duration
  };

  const checkWin = (newReels) => {
    if (newReels.every((symbol) => symbol === '7️⃣')) {
      setBalance(balance + 100);
      setMessage('Jackpot! You won 100!');
    } else if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      setBalance(balance + 50);
      setMessage('You won 50!');
    } else {
      setMessage('Try again!');
    }
  };

  const resetGame = () => {
    setBalance(100);
    setReels(['', '', '']);
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Lucky 777</h1>
      <div className="flex space-x-4 mb-6">
        {reels.map((symbol, index) => (
          <motion.div
            key={index}
            className="w-24 h-24 flex items-center justify-center bg-gray-800 border-4 border-yellow-500 rounded-lg text-4xl shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              y: { type: 'spring', stiffness: 300, damping: 20 },
              opacity: { duration: 0.2 },
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
      <div className="flex space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={spinReels}
          className={`px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full shadow-xl ${
            spinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={spinning}
        >
          Spin
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetGame}
          className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full shadow-xl"
        >
          Reset
        </motion.button>
      </div>
      <div className="text-2xl mb-4 font-mono">Balance: ${balance}</div>
      {message && (
        <motion.div
          className="text-3xl text-yellow-400 font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

export default Lucky777;
