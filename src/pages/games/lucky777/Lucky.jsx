import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Typography } from '@material-tailwind/react';
import useAuth from '../../../hooks/useAuth/useAuth';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';
import Winning from '../../../components/winning/Winning';
import Reel from './Reel';
import Loading from '../../../components/loading/Loading';
import useSound from 'use-sound';
import spinSound from '../../../audio/spin.mp3';


const symbols = ['🍒', '🍋', '🍊', '7'];
const GAME_NAME = 'luck777';
const symbolHeight = 112;
const MIN_BET_AMOUNT = 10;

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const Lucky777 = () => {
  const { setUserInfo, user, loading, userInfo } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [play, { stop }] = useSound(spinSound);

  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(null);
  const [betAmount, setBetAmount] = useState(MIN_BET_AMOUNT);
  const [gaming, setGaming] = useState(null);
  const [showWinningScreen, setShowWinningScreen] = useState(false);
  const [message, setMessage] = useState('');


  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => axiosSecure.post('/game/games-start', info).then((res) => res.data),
    onSuccess: (data) => setUserInfo(data),
    onError: () => {
      setSpinning(false);
      toast.error('An error occurred while starting the game.');
    },
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => axiosSecure.post('/game/games-lost', info).then((res) => res.data),
    onError:()=> resetGame,
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => axiosSecure.post('/game/games-win', info).then((res) => res.data),
    onSuccess: (data) => {
      setShowWinningScreen(false);
      setGaming(false);
      setUserInfo(data);
    },
    onError:()=> resetGame,
  });


  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (gaming) {
        event.preventDefault();
        event.returnValue = '';
      
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gaming]);


  useEffect(() => {
    if (spinning) {
      const timer = setTimeout(() => {
        setSpinning(false);
        checkWin(reels);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [spinning, reels]);

  const spinReels = () => {
    if (!user) return toast.error('You need to log in first.');

    if (userInfo?.depositBalance < betAmount) {
      return toast.error("You don't have enough balance to play this game.");
    }

    if (betAmount < MIN_BET_AMOUNT) {
      return toast.error(`Bet amount should be at least ${MIN_BET_AMOUNT}.`);
    }

    play();
    setGaming(true);
    setMessage('');
    setUserInfo({
      ...userInfo, 
      depositBalance: userInfo.depositBalance - betAmount
    });
    
    const gameInfo = { userEmail: user?.email, betAmount };
    gameStart(gameInfo);

    const newReels = Array.from({ length: 3 }, getRandomSymbol);
    setReels(newReels);
    setSpinning(true);
  };

  const checkWin = async (newReels) => {
    stop();

    if (newReels.every((symbol) => symbol === '7')) {
      await handleWin('Jackpot! You won!', betAmount * 5);
    } else if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      await handleWin('You won!', betAmount * 5);
    } else {
      await handleLoss();
    }
  };

  const handleWin = async (message, winAmount) => {
    setMessage(message);
    setShowWinningScreen(true);
    setUserInfo({
      ...userInfo, 
      winBalance: userInfo.winBalance + winAmount
    });
   
    resetGame();
    await gameWin({
      userEmail: user?.email,
      betAmount,
      winAmount,
      status: 'win',
      gameName: GAME_NAME,
    });
  };

  const handleLoss = async () => {
    setMessage('Better luck next time!');
    resetGame();
    await gameLost({
      userEmail: user?.email,
      betAmount,
      status: 'lost',
      gameName: GAME_NAME,
    });
   
  };

  const resetGame = () => {
    setGaming(false);
  };







  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-screen bg-background text-text-primary">
      {showWinningScreen && <Winning amount={betAmount * 5} />}
     
      <div className="w-full mt-20">
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
            <label className="block text-sm font-medium mb-1">WIN 5x</label>
            <input
              type="number"
              value={betAmount}
              min={MIN_BET_AMOUNT}
              onChange={(e) => setBetAmount(Math.max(parseInt(e.target.value, 10), MIN_BET_AMOUNT))}
              className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
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
