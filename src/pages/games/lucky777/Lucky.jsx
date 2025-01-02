import  { useState, useRef } from 'react';
import { motion } from 'framer-motion';

import { Button,  Typography } from '@material-tailwind/react';
import useAuth from '../../../hooks/useAuth/useAuth';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure/useAxiosSecure';
import toast from 'react-hot-toast';
import Winning from '../../../components/winning/Winning';
import Reel from './Reel';
import Loading from './../../../components/loading/Loading';


const symbols = ['🍒', '🍋', '🍊','7'];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const GAME_NAME = "luck777";
// Main Lucky777 component
const Lucky777 = () => {
  const symbolHeight = 112; 
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const {setUserInfo,user,loading} = useAuth();
  const [betAmount, setBetAmount] = useState(10);
  const [message, setMessage] = useState('');
  const [gaming, setGaming] = useState(false);
  const spinSound = useRef(new Audio('/spin.mp3')); 
  const winSound = useRef(new Audio('/win.mp3'));
  const axiosSecure = useAxiosSecure()
  const [showWinningScreen, setShowWinningScreen] = useState(false); 

  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-start`, info);
  return data
    },
    onSuccess:(data)=>{
  
      setUserInfo(data)
    },
    onError: () => {
     
      toast.error("An error occurred while submitting your request.");
    },
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-lost`, info);
      return data;
    },
    onSuccess:()=>{
      setGaming(false);
    }
  });
  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-win`, info);
      return data;
    },
    onSuccess: (data) => {
      setShowWinningScreen(false)
      setGaming(false);
      setUserInfo(data);
    },
    onError: () => {
      setShowWinningScreen(false)
      setGaming(false);
    }
  });

  const spinReels = () => {
    setGaming(true);
    const gameInfo ={
      userEmail: user?.email,
      betAmount: betAmount,
    }
    gameStart(gameInfo)

    setSpinning(true);
    setMessage('');
    spinSound.current.play();

    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    setReels(newReels);
console.log(newReels);
    setTimeout(() => {
      setSpinning(false);
      checkWin(newReels);
    }, 3000); 
  };

  const checkWin = async(newReels) => {
    if (newReels.every((symbol) => symbol === '7')) {
      await gameWin({ userEmail: user?.email ,betAmount ,winAmount:400,status:"win" ,gameName:GAME_NAME});
      setMessage('Jackpot! You won 100!');
      winSound.current.play();
      setShowWinningScreen(true);
    } else if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      await gameWin({ userEmail: user?.email ,betAmount,winAmount:100 ,status:"win" ,gameName:GAME_NAME});
      setMessage('You won 50!');
      winSound.current.play();
      setShowWinningScreen(true);
    } else {
      await gameLost({ userEmail: user?.email, betAmount ,status:"lost" ,gameName:GAME_NAME});
      setMessage('Try again!');
    }
  };


  if(loading) return <Loading />;

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
          <Reel  key={index} symbols={symbols} isSpinning={spinning} finalSymbol={symbol} symbolHeight={symbolHeight} />
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
      ):'Try your luck!'}
          </Typography>
        </div>
      <div className="p-4 h-1/3 mb-10 bg-background-section rounded-lg shadow-lg w-full  space-y-6">
          {/* Bet Amount Field */}
          <div className="flex justify-between items-center gap-4">
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Bet Amount (10 min)</label>
        <input
          type="number"
          value={betAmount}
          // disabled={gaming}
          onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
          className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
          min="10"
        />
      </div>
    
     
    </div>
    
         
          
    
          {/* Start Game Button */}
          <Button
            disabled={gaming}
            onClick={spinReels}
            
            className='bg-primary w-full'
            size="lg"
          >
            {gaming ? "Game In Progress" : "Start Game"}
          </Button>
        </div>
     
     
    </div>
  );
};

export default Lucky777;
