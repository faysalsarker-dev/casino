import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button, Typography } from '@material-tailwind/react';
import useAuth from '../../../hooks/useAuth/useAuth';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';
import Winning from '../../../components/winning/Winning';
import Reel from './Reel';
import Loading from './../../../components/loading/Loading';

const symbols = ['🍒', '🍋', '🍊', '7'];
const GAME_NAME = 'luck777';
const symbolHeight = 112;

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const Lucky777 = () => {
  const { setUserInfo, user, loading } = useAuth();
  const spinSound = useRef(new Audio('/spin.mp3'));
  const winSound = useRef(new Audio('/win.mp3'));
  const axiosSecure = useAxiosSecure();

  const [reels, setReels] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_reels`)) || ['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_spinning`)) || false);
  const [betAmount, setBetAmount] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_betAmount`)) || 10);
  const [message, setMessage] = useState('');
  const [gaming, setGaming] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_gaming`)) || false);
  const [showWinningScreen, setShowWinningScreen] = useState(false);

  const saveGameState = useCallback(() => {
    localStorage.setItem(`${GAME_NAME}_reels`, JSON.stringify(reels));
    localStorage.setItem(`${GAME_NAME}_betAmount`, JSON.stringify(betAmount));
    localStorage.setItem(`${GAME_NAME}_gaming`, JSON.stringify(gaming));
    localStorage.setItem(`${GAME_NAME}_spinning`, JSON.stringify(spinning));
  }, [reels, betAmount, gaming, spinning]);

  useEffect(() => {
    saveGameState();
  }, [saveGameState]);

  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => axiosSecure.post(`/game/games-start`, info).then(res => res.data),
    onSuccess: (data) => setUserInfo(data),
    onError: () => toast.error('An error occurred while starting the game.'),
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => axiosSecure.post(`/game/games-lost`, info).then(res => res.data),
    onSuccess: () => setGaming(false),
    onError: () => setGaming(false),
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => axiosSecure.post(`/game/games-win`, info).then(res => res.data),
    onSuccess: (data) => {
      setShowWinningScreen(false);
      setGaming(false);
      setUserInfo(data);
    },
    onError: () => {
      setShowWinningScreen(false);
      setGaming(false);
    },
  });

  useEffect(() => {
    if (spinning) {
      const timer = setTimeout(() => {
        setSpinning(false);
        checkWin(reels, user?.email);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [spinning, reels, user?.email]);

  const spinReels = () => {
    if (betAmount < 10) {
      toast.error('Minimum bet amount is 10.');
      return;
    }

    setGaming(true);
    const gameInfo = { userEmail: user?.email, betAmount };
    gameStart(gameInfo);

    setSpinning(true);
    setMessage('');
    resetAudio(spinSound.current);
    spinSound.current.play();

    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    setReels(newReels);

    setTimeout(() => {
      setSpinning(false);
      checkWin(newReels);
    }, 3000);
  };

  const checkWin = async (newReels, userEmail = user?.email) => {
    if (newReels.every((symbol) => symbol === '7')) {
      await gameWin({
        userEmail,
        betAmount,
        winAmount: betAmount * 100,
        status: 'win',
        gameName: GAME_NAME,
      });
      postWinActions('Jackpot! You won 100!', betAmount * 100);
    } else if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      await gameWin({
        userEmail,
        betAmount,
        winAmount: betAmount * 10,
        status: 'win',
        gameName: GAME_NAME,
      });
      postWinActions('You won 50!', betAmount * 10);
    } else {
      await gameLost({
        userEmail,
        betAmount,
        status: 'lost',
        gameName: GAME_NAME,
      });
      postLoseActions();
    }
  };

  const resetAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
  };

  const postWinActions = (messageText, amount) => {
    clearData();
    setGaming(false);
    setMessage(messageText);
    resetAudio(winSound.current);
    winSound.current.play();
    setShowWinningScreen(true);
  };

  const postLoseActions = () => {
    clearData();
    setGaming(false);
    setMessage('Try again!');
  };

  const clearData = () => {
    setTimeout(() => {
      localStorage.removeItem(`${GAME_NAME}_reels`);
      localStorage.removeItem(`${GAME_NAME}_betAmount`);
      localStorage.removeItem(`${GAME_NAME}_gaming`);
      localStorage.removeItem(`${GAME_NAME}_spinning`);
    }, 100);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary">
      {showWinningScreen && <Winning amount={betAmount * 10} />}
      <div className="w-full">
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 w-full text-center py-4 shadow-md">
          <Typography variant="h2" className="text-3xl font-bold text-white">
            Lucky 777
          </Typography>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 mt-12 bg-background-secondary px-0">
        {reels.map((symbol, index) => (
          <Reel
            key={index}
            symbols={symbols}
            isSpinning={spinning}
            finalSymbol={symbol}
            symbolHeight={symbolHeight}
          />
        ))}
      </div>
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 w-full text-center py-4 shadow-md">
        <Typography variant="h2" className="text-3xl font-bold text-white">
          {message ? (
            <motion.div
              className="text-3xl text-yellow-400 font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {message}
            </motion.div>
          ) : (
            'Try your luck!'
          )}
        </Typography>
      </div>
      <div className="p-4 h-1/3 mb-10 bg-background-section rounded-lg shadow-lg w-full space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              Bet Amount (10 min)
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(parseInt(e.target.value) || 0, 10))}
              className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
              min="10"
            />
          </div>
        </div>
        <Button
          disabled={gaming}
          onClick={spinReels}
          className="bg-primary w-full"
          size="lg"
        >
          {gaming ? 'Game In Progress' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default Lucky777;
