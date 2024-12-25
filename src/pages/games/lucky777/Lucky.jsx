import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

// Array of symbols for the slot machine
const symbols = ['🍒', '🍋', '🍊', '7️⃣', '🍉'];

// Helper function to get a random symbol
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

// Animation variants for the spinning effect
const spinVariants = {
  spinning: {
    y: [0, -100, -200, -300, -400, 0], // Adjust these values based on symbol height
    transition: {
      y: {
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      },
    },
  },
  stopped: (finalPosition) => ({
    y: -finalPosition * 100, // Adjust these values based on symbol height
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Reel component to display individual reels with animations
const Reel = ({ isSpinning, finalSymbol }) => {
  const finalPosition = symbols.indexOf(finalSymbol);

  return (
    <div className="overflow-hidden h-24 w-24 border-4 border-yellow-500 rounded-lg">
      <motion.div
        className="flex flex-col"
        variants={spinVariants}
        animate={isSpinning ? 'spinning' : 'stopped'}
        custom={finalPosition}
      >
        {symbols.map((symbol, index) => (
          <div key={index} className="h-24 flex items-center justify-center text-4xl">
            {symbol}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Main Lucky777 component
const Lucky777 = () => {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(100);
  const [message, setMessage] = useState('');

  const spinReels = () => {
    if (spinning) return;

    setSpinning(true);
    setBalance(balance - 10);
    setMessage('');

    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    setReels(newReels);

    setTimeout(() => {
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
    setReels(['🍒', '🍋', '🍊']);
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Lucky 777</h1>
      <div className="flex space-x-4 mb-6">
        {reels.map((symbol, index) => (
          <Reel key={index} isSpinning={spinning} finalSymbol={symbol} />
        ))}
      </div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={spinReels}
          className={`px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full shadow-xl ${
            spinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={spinning}
        >
          Spin
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full shadow-xl"
        >
          Reset
        </button>
      </div>
      <div className="text-2xl mb-4 font-mono">Balance: ${balance}</div>
      {message && (
        <div className="text-3xl text-yellow-400 font-bold">
          {message}
        </div>
      )}
    </div>
  );
};

export default Lucky777;
