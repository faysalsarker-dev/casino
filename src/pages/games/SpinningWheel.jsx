import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import useAuth from './../../hooks/useAuth/useAuth';
import useAxiosSecure from './../../hooks/useAxiosSecure/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const { userInfo, setUserInfo ,user} = useAuth();
  const [betAmount, setBetAmount] = useState(10);
  const [disabled, setDisabled] = useState(false);
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

  const handleSpinClick = async () => {
    if (disabled) {
      toast.error("Game is already in progress.");
      return;
    }
    const gameInfo ={
      userEmail: user?.email,
      betAmount: betAmount,
    }
    setDisabled(true);
    try {
      await gameStart(gameInfo);
      const randomPrize = Math.floor(Math.random() * segments.length);
      setPrizeNumber(randomPrize);
      setMustSpin(true);
    } catch (error) {
      setDisabled(false);
    }
  };

  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-start`, info);
      return data;
    },
    onSuccess: (data) => {
      setDisabled(true);
      setUserInfo(data);
    },
    onError: () => {
      setDisabled(false);
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
      setUserInfo(data.user);
    },
  });

  const handleSpinEnd = async () => {
    setMustSpin(false);
    const result = segments[prizeNumber];

    if (result.multiplier === 0) {
      await gameLost({ userEmail: user?.email, betAmount ,status:"lost" ,gameName:"spinning wheel"});
      toast.error("You lost! Better luck next time.");
    } else {
      const winnings = betAmount * result.multiplier;
      await gameWin({ userEmail: user?.email ,betAmount ,status:"win" ,gameName:"spinning wheel"});
      toast.success(`Congratulations! You won ${winnings}$!`);
    }

    setDisabled(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-white">Bet Amount</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseInt(e.target.value) || 10)}
          className="w-full p-2 text-gray-900 rounded bg-gray-200"
          min="10"
          disabled={disabled}
        />
      </div>
      <Button onClick={handleSpinClick} disabled={disabled} className="mb-4">
        {disabled ? "Game in Progress" : "Start Game"}
      </Button>
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
          spinDuration={1.0} // Moderate spin duration
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-10"></div>
      </div>
    </div>
  );
};

export default SpinningWheel;
