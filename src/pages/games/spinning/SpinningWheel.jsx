import { useState, useEffect, useCallback, useMemo } from 'react';
import { memo } from 'react';
import useAuth from '../../../hooks/useAuth/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';
import Winning from '../../../components/winning/Winning';
import Loading from '../../../components/loading/Loading';
import SpinWheel from './SpinWheel';
import useSound from 'use-sound';
import spinSound from "../../../audio/spin.mp3";
const GAME_NAME = "spinning-wheel";

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [gaming, setGaming] = useState(false);
  const [showWinningScreen, setShowWinningScreen] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
const [playSpinSound] = useSound(spinSound);
  const { setUserInfo, user, loading,userInfo } = useAuth();
  const axiosSecure = useAxiosSecure();

  const segments = useMemo(
    () => [
      { option: '2x', multiplier: 2, style: { backgroundColor: '#009688', textColor: '#fff' } },
      { option: '0.2x', multiplier: 0.2, style: { backgroundColor: '#FFC107', textColor: '#fff' } },
      { option: '10x', multiplier: 10, style: { backgroundColor: '#9C27B0', textColor: '#fff' } },
      { option: '0.0x', multiplier: 0.0, style: { backgroundColor: '#8BC34A', textColor: '#fff' } },
      { option: '0.2x', multiplier: 0.2, style: { backgroundColor: '#FF5722', textColor: '#fff' } },
      { option: '5x', multiplier: 5, style: { backgroundColor: '#E91E63', textColor: '#fff' } },
      { option: '0.2x', multiplier: 0.2, style: { backgroundColor: '#FF9800', textColor: '#fff' } },
      { option: '4x', multiplier: 4, style: { backgroundColor: '#3F51B5', textColor: '#fff' } },
    ],
    []
  );

  useEffect(() => {
    const storedState = ["mustSpin", "prizeNumber", "betAmount", "gaming"].reduce(
      (acc, key) => ({ ...acc, [key]: JSON.parse(localStorage.getItem(`${GAME_NAME}_${key}`)) }),
      {}
    );
    if (storedState.mustSpin) setMustSpin(storedState.mustSpin);
    if (storedState.prizeNumber !== null) setPrizeNumber(storedState.prizeNumber);
    if (storedState.betAmount !== null) setBetAmount(storedState.betAmount);
    if (storedState.gaming) setGaming(storedState.gaming);

    if (storedState.mustSpin) {
      setTimeout(() => setMustSpin(true), 0);
    }
  }, []);

  const saveStateToLocalStorage = useCallback(
    (state) => {
      Object.entries(state).forEach(([key, value]) =>
        localStorage.setItem(`${GAME_NAME}_${key}`, JSON.stringify(value))
      );
    },
    []
  );

  useEffect(() => {
    saveStateToLocalStorage({ mustSpin, prizeNumber, betAmount, gaming });
  }, [mustSpin, prizeNumber, betAmount, gaming, saveStateToLocalStorage]);

  const clearGame = useCallback(() => {
    ["mustSpin", "prizeNumber", "betAmount", "gaming"].forEach((key) =>
      localStorage.removeItem(`${GAME_NAME}_${key}`)
    );
  }, []);

  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => (await axiosSecure.post(`/game/games-start`, info)).data,
    onSuccess: (data) => {
     setUserInfo(data);
     playSpinSound()
    },
    onError: () => {
      setGaming(false);
      toast.error("An error occurred while starting the game.");
    },
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => (await axiosSecure.post(`/game/games-lost`, info)).data,
    onError: () => toast.error("An error occurred while processing the loss."),
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => (await axiosSecure.post(`/game/games-win`, info)).data,
    onSuccess: (data) => setUserInfo(data),
  });

  const handleSpinClick = useCallback(async () => {
    if (gaming) {
      toast.error("Game is already in progress.");
      return;
    }
    if (userInfo?.depositBalace < betAmount ) {
      toast.error("You don't have enough balance to play this game.");
      return;
    }
    if ( betAmount < 10 ) {
      toast.error("Minimum bet amount is 10.");
      return;
    }

    setShowWinningScreen(false);
    setGaming(true);
    try {
      await gameStart({ userEmail: user?.email, betAmount });
      const randomPrize = Math.floor(Math.random() * segments.length);
      setPrizeNumber(randomPrize);
      setMustSpin(true);
     
    } catch {
      setGaming(false);
    }
  }, [gaming, user?.email, betAmount, gameStart, segments.length]);

  const handleSpinEnd = useCallback(async () => {
    setMustSpin(false);
    const result = segments[prizeNumber];
    if (result.multiplier === 0) {
      await gameLost({ userEmail: user?.email, betAmount, status: "lost", gameName: GAME_NAME });
      clearGame();
      toast.error("You lost! Better luck next time.");
    } else {
      const winnings = betAmount * result.multiplier;
      setWinAmount(winnings);
      setShowWinningScreen(true);
      await gameWin({ userEmail: user?.email, betAmount, winAmount: winnings, status: "win", gameName: GAME_NAME });
      clearGame();
    }
    setGaming(false);
  }, [segments, prizeNumber, betAmount, user?.email, gameLost, gameWin, clearGame]);

  const handleBetChange = useCallback(
    (e) => setBetAmount(Math.max(parseInt(e.target.value))),
    []
  );

  if (loading) return <Loading />;

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary px-4 sm:px-8 md:px-16 lg:px-32">
  {showWinningScreen && <Winning amount={winAmount} />}

  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-10 w-full max-w-5xl">
    <div className="h-2/3 lg:h-auto lg:w-1/2">
      <SpinWheel
        mustSpin={mustSpin}
        prizeNumber={prizeNumber}
        segments={segments}
        handleSpinEnd={handleSpinEnd}
      />
    </div>

    <div className="p-4 lg:w-1/3 mt-10 mb-10 bg-background-section rounded-lg shadow-lg space-y-6">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Minimum bet amount is 10
          </label>
          <input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <Button
        disabled={gaming}
        onClick={handleSpinClick}
        className="bg-primary w-full"
        size="lg"
      >
        {gaming ? "Game In Progress" : "Start Game"}
      </Button>
    </div>
  </div>
</div>

  );
};

export default memo(SpinningWheel);
