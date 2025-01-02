import { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import useAuth from './../../hooks/useAuth/useAuth';
import useAxiosSecure from './../../hooks/useAxiosSecure/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';
import Winning from '../../components/winning/Winning';
import { SyncLoader } from 'react-spinners';
import Loading from '../../components/loading/Loading';


const GAME_NAME = "spinning-wheel";

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [gaming, setGaming] = useState(false);
  const [showWinningScreen, setShowWinningScreen] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  const { setUserInfo, user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const segments = [
    { option: '2x', multiplier: 2, style: { backgroundColor: '#009688', textColor: '#fff' } },
    { option: '0.2x', multiplier: 0.2, style: { backgroundColor: '#FFC107', textColor: '#fff' } },
    { option: '10x', multiplier: 10, style: { backgroundColor: '#9C27B0', textColor: '#fff' } },
    { option: '0.0x', multiplier: 0.0, style: { backgroundColor: '#8BC34A', textColor: '#fff' } },
    { option: '0.2x', multiplier: 0.2, style: { backgroundColor: '#FF5722', textColor: '#fff' } },
    { option: '5x', multiplier: 5, style: { backgroundColor: '#E91E63', textColor: '#fff' } },
    { option: '0.2x', multiplier: 0.2, style: { backgroundColor: '#FF9800', textColor: '#fff' } },
    { option: '4x', multiplier: 4, style: { backgroundColor: '#3F51B5', textColor: '#fff' } },
  ];




  useEffect(() => {
    // Restore game state from localStorage
    const storedMustSpin = JSON.parse(localStorage.getItem(`${GAME_NAME}_mustSpin`));
    const storedPrizeNumber = JSON.parse(localStorage.getItem(`${GAME_NAME}_prizeNumber`));
    const storedBetAmount = JSON.parse(localStorage.getItem(`${GAME_NAME}_betAmount`));
    const storedGaming = JSON.parse(localStorage.getItem(`${GAME_NAME}_gaming`));

    if (storedMustSpin) setMustSpin(storedMustSpin);
    if (storedPrizeNumber !== null) setPrizeNumber(storedPrizeNumber);
    if (storedBetAmount !== null) setBetAmount(storedBetAmount);
    if (storedGaming) setGaming(storedGaming);

   
    if (storedMustSpin) {
      setTimeout(() => {
        setMustSpin(true);
        console.log('spinning');
      }, 0);
    }
  }, []);

  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-start`, info);
      return data;
    },
    onSuccess: () => {
      setGaming(true);
    },
    onError: () => {
      setGaming(false);
      toast.error("An error occurred while starting the game.");
    },
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-lost`, info);
      return data;
    },
    onError: () => {
      toast.error("An error occurred while processing the loss.");
    },
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-win`, info);
      return data;
    },
    onSuccess: (data) => {
      setUserInfo(data);
    },
  });

  const handleSpinClick = async () => {
    if (gaming) {
      toast.error("Game is already in progress.");
      return;
    }
    setShowWinningScreen(false);
    const gameInfo = {
      userEmail: user?.email,
      betAmount: betAmount,
    };
    setGaming(true);
    try {
      await gameStart(gameInfo);
      const randomPrize = Math.floor(Math.random() * segments.length);
      setPrizeNumber(randomPrize);
      setMustSpin(true);
    } catch {
      setGaming(false);
    }
  };

  const handleSpinEnd = async () => {
    setMustSpin(false);
    console.log('spin end');
    const result = segments[prizeNumber];
    if (result.multiplier === 0) {
      await gameLost({ userEmail: user?.email, betAmount, status: "lost", gameName: GAME_NAME });
      toast.error("You lost! Better luck next time.");
      setGaming(false);
    } else {
      const winnings = betAmount * result.multiplier;
      setWinAmount(winnings);
      setShowWinningScreen(true);
      await gameWin({ userEmail: user?.email, betAmount, winAmount: winnings, status: "win", gameName: GAME_NAME });
      setGaming(false);
    }
    
    clearGame();
  };

  const clearGame = () => {
    localStorage.removeItem(`${GAME_NAME}_mustSpin`);
    localStorage.removeItem(`${GAME_NAME}_prizeNumber`);
    localStorage.removeItem(`${GAME_NAME}_betAmount`);
    localStorage.removeItem(`${GAME_NAME}_gaming`);
    setMustSpin(false);
    
  };

  useEffect(() => {
    // Save game state to localStorage
    localStorage.setItem(`${GAME_NAME}_mustSpin`, JSON.stringify(mustSpin));
    localStorage.setItem(`${GAME_NAME}_prizeNumber`, JSON.stringify(prizeNumber));
    localStorage.setItem(`${GAME_NAME}_betAmount`, JSON.stringify(betAmount));
    localStorage.setItem(`${GAME_NAME}_gaming`, JSON.stringify(gaming));
  }, [mustSpin, prizeNumber, betAmount, gaming]);

  if(loading) return <Loading />;


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary">
      {showWinningScreen && <Winning amount={winAmount} />}

      <div className="relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={segments}
          onStopSpinning={handleSpinEnd}
          outerBorderColor="#fff"
          outerBorderWidth={10}
          radiusLineWidth={5}
          radiusLineColor="#ccc"
          textColors={['#fff']}
          fontSize={25}
          spinDuration={0.3}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-10"> . </div>
      </div>

      <div className="p-4 h-1/3 mt-10 mb-10 bg-background-section rounded-lg shadow-lg w-full space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Bet Amount (10 min)</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
              className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
              min="10"
            />
          </div>
        </div>

        <Button
          disabled={gaming}
          onClick={handleSpinClick}
          className='bg-primary w-full'
          size="lg"
        >
          {gaming ? "Game In Progress" : "Start Game"}
        </Button>
      </div>
    </div>
  );
};

export default SpinningWheel;
