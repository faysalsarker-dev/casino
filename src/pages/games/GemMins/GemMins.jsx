import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import gem from "../../../images/gem.png";
import bomb from "../../../images/bomb.png";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../../hooks/useAuth/useAuth";
import bombSoundFile from "../../../audio/bomb.m4a";
import gemSoundFile from "../../../audio/gem.m4a";
import useSound from "use-sound";
import Winning from "../../../components/winning/Winning";
import { Button } from "@material-tailwind/react";
import Loading from "../../../components/loading/Loading";

const GAME_NAME = "mins";

const GemMins = () => {
  const [bombs, setBombs] = useState(1);
  const [betAmount, setBetAmount] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_betAmount`)) || 10);
  const [bombIndexes, setBombIndexes] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_bombIndexes`)) || []);
  const [revealed, setRevealed] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_revealed`)) || []);
  const [gaming, setGaming] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_gaming`)) || false);
  const [showWinningScreen, setShowWinningScreen] = useState(false);
  const [playBombSound] = useSound(bombSoundFile);
  const [playGemSound] = useSound(gemSoundFile);

  const [rows, columns] = useMemo(() => {
    const totalCells = bombs * 10;
    if(!gaming){
setRevealed([]);
    }
    if (bombs === 1) {
    return [4, 3];
  }
    const calculatedRows = Math.ceil(Math.sqrt(totalCells));
    const calculatedColumns = Math.ceil(totalCells / calculatedRows);
    return [calculatedRows, calculatedColumns];
  }, [bombs]);

  const { user, userInfo, setUserInfo, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    localStorage.setItem(`${GAME_NAME}_bombs`, JSON.stringify(bombs));
    localStorage.setItem(`${GAME_NAME}_betAmount`, JSON.stringify(betAmount));
    localStorage.setItem(`${GAME_NAME}_bombIndexes`, JSON.stringify(bombIndexes));
    localStorage.setItem(`${GAME_NAME}_revealed`, JSON.stringify(revealed));
    localStorage.setItem(`${GAME_NAME}_gaming`, JSON.stringify(gaming));
  }, [bombs, betAmount, bombIndexes, revealed, gaming]);

  const generateBombIndexes = useCallback((totalCells, numBombs) => {
    const bombSet = new Set();
    while (bombSet.size < numBombs) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      bombSet.add(randomIndex);
    }
    return Array.from(bombSet);
  }, []);

  const clearData = useCallback(() => {
    localStorage.removeItem(`${GAME_NAME}_bombs`);
    localStorage.removeItem(`${GAME_NAME}_betAmount`);
    localStorage.removeItem(`${GAME_NAME}_bombIndexes`);
    localStorage.removeItem(`${GAME_NAME}_revealed`);
    localStorage.removeItem(`${GAME_NAME}_gaming`);
  }, []);

  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-start`, info);
      return data;
    },
    onSuccess: (data) => {
      setUserInfo(data);
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
    onSuccess: clearData,
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-win`, info);
      return data;
    },
    onSuccess: (data) => {
      toast.success("🎉 Congratulations! You won!");
      setUserInfo(data);
      clearData();
    },
  });

  const handleStartGame = useCallback(() => {
    setShowWinningScreen(false);
    if (userInfo?.depositBalance < betAmount) {
      return toast.error("You don't have enough balance to play this game.");
    }
    if(betAmount < 10){
      return toast.error("Bet amount should be at least 10.")
    }
    setGaming(true);
    const totalCells = bombs * 10;
    gameStart({ userEmail: user?.email, betAmount });
    setBombIndexes(generateBombIndexes(totalCells, bombs));
    setRevealed([]);
    toast.success("🎮 New game started!");
  }, [userInfo, betAmount, bombs, user, gameStart, generateBombIndexes]);

  const handleCellClick = useCallback(
    (index) => {
      if (revealed.includes(index)) return;

      const isBomb = bombIndexes.includes(index);

      if (isBomb) {
        playBombSound();
        gameLost({ userEmail: user?.email, betAmount, status: "lost", gameName: GAME_NAME });
        toast.error("💥 Boom! You hit a bomb!");
        setRevealed(Array.from({ length: rows * columns }, (_, i) => i));
        setGaming(false);
        return;
      }

      playGemSound();
      const updatedRevealed = [...revealed, index];
      setRevealed(updatedRevealed);

      if (updatedRevealed.length === rows * columns - bombs) {
        handleWin();
      }
    },
    [revealed, bombIndexes, bombs, user, rows, columns, playBombSound, playGemSound, gameLost]
  );

  const handleWin = useCallback(() => {
    setGaming(false);
    setShowWinningScreen(true);
    gameWin({ userEmail: user?.email, betAmount, winAmount: betAmount * 50, status: "win", gameName: GAME_NAME });
  }, [user, betAmount, gameWin]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {showWinningScreen && <Winning amount={betAmount * 50} />}
      <div className="flex flex-col lg:flex-row-reverse  items-center gap-6 p-2">
        <div className="w-full h-2/3 mt-24 lg:mt-32 bg-background-section p-2 rounded-lg">
          <div
            className="grid gap-2 justify-items-center items-center"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: rows * columns }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!gaming}
                className={`h-16 w-16 flex items-center justify-center rounded ${
                  revealed.includes(index)
                    ? bombIndexes.includes(index)
                      ? "bg-red-500"
                      : "bg-background-secondary"
                    : "bg-[#557086] hover:bg-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {revealed.includes(index) && bombIndexes.includes(index) && (
                  <motion.img
                    src={bomb}
                    alt="bomb"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {revealed.includes(index) && !bombIndexes.includes(index) && (
                  <motion.img
                    src={gem}
                    alt="gem"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-4 lg:h-full lg:mt-24 h-1/3  mb-12 bg-background-section rounded-lg shadow-lg w-full space-y-6  ">
          <div className="flex justify-between items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">WIN 50x</label>
              <input
                type="number"
                value={betAmount}
                disabled={gaming}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                min={10}
                className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Bombs</label>
              <select
                value={bombs}
                disabled={gaming}
                onChange={(e) => setBombs(Number(e.target.value))}
                className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div> */}
          </div>

          <Button disabled={gaming} onClick={handleStartGame} className="bg-primary w-full" size="lg">
            {gaming ? "Game In Progress" : "Start Game"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GemMins;
