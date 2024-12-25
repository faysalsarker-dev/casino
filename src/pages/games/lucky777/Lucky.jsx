import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

import { Typography } from '@material-tailwind/react';

// Array of symbols for the slot machine
const symbols = ['🍒', '🍋', '🍊'];

// Helper function to get a random symbol
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

// Reel component to display individual reels with animations
const Reel = ({ isSpinning, finalSymbol, symbolHeight }) => {
  const finalPosition = symbols.indexOf(finalSymbol);

  const spinVariants = {
    spinning: {
      y: [0, -symbolHeight * symbols.length],
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.2, // Faster spin duration
          ease: 'linear',
        },
      },
    },
    stopped: {
      y: -finalPosition * symbolHeight,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div
      className="overflow-hidden h-28 w-28 border-4 rounded-lg shadow-lg neon-border"
      style={{
        height: `${symbolHeight}px`,
        backgroundColor: '#1a1a2e',
        boxShadow: '0 0 20px #e0aaff, inset 0 0 10px #e0aaff',
        border: '2px solid #e0aaff',
      }}
    >
      <motion.div
        className="flex flex-col"
        variants={spinVariants}
        animate={isSpinning ? 'spinning' : 'stopped'}
      >
        {symbols.map((symbol, index) => (
          <div
            key={index}
            className="h-28 flex items-center justify-center text-4xl font-extrabold text-yellow-400"
            style={{ height: `${symbolHeight}px` }}
          >
            {symbol}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Main Lucky777 component
const Lucky777 = () => {
  const symbolHeight = 112; // Dynamically adjust symbol height here
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(100);
  const [message, setMessage] = useState('');
  const spinSound = useRef(new Audio('/spin.mp3')); // Add spin sound file
  const winSound = useRef(new Audio('/win.mp3')); // Add win sound file

  const spinReels = () => {
    if (spinning || balance < 10) {
      if (balance < 10) setMessage('Insufficient balance! Please reset.');
      return;
    }

    setSpinning(true);
    setBalance(balance - 10);
    setMessage('');
    spinSound.current.play();

    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    setReels(newReels);

    setTimeout(() => {
      setSpinning(false);
      checkWin(newReels);
    }, 2000); // Shorter spin duration
  };

  const checkWin = (newReels) => {
    if (newReels.every((symbol) => symbol === '7️⃣')) {
      setBalance(balance + 100);
      setMessage('Jackpot! You won 100!');
      winSound.current.play();
    } else if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      setBalance(balance + 50);
      setMessage('You won 50!');
      winSound.current.play();
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
      <div className="w-full">
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 w-full text-center py-4 shadow-md">
          <Typography variant="h2" className="text-3xl font-bold text-white">
            Lucky 777
          </Typography>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 mt-12">
        {reels.map((symbol, index) => (
          <Reel key={index} isSpinning={spinning} finalSymbol={symbol} symbolHeight={symbolHeight} />
        ))}
      </div>
      <div className="flex space-x-6 mb-6">
        <button
          onClick={spinReels}
          className={`px-8 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform ${
            spinning || balance < 10 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={spinning || balance < 10}
        >
          Spin
        </button>
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform"
        >
          Reset
        </button>
      </div>
      <div className="text-2xl mb-4 font-mono">Balance: ${balance}</div>
      {message && (
        <motion.div
          className="text-3xl text-yellow-400 font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

export default Lucky777;
