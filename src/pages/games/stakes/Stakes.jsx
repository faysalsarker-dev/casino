import { useState, useEffect } from "react";
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


const Stakes = () => {
  const [bombs, setBombs] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_bombs`)) || 3);
const [betAmount, setBetAmount] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_betAmount`)) || 10);
const [bombIndexes, setBombIndexes] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_bombIndexes`)) || []);
const [revealed, setRevealed] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_revealed`)) || []);
const [gaming, setGaming] = useState(() => JSON.parse(localStorage.getItem(`${GAME_NAME}_gaming`)) || false);

 
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);

  const [showWinningScreen, setShowWinningScreen] = useState(false); 
  const { user, userInfo, setUserInfo ,loading} = useAuth();
  const axiosSecure = useAxiosSecure();
  const [playBombSound] = useSound(bombSoundFile);
  const [playGemSound] = useSound(gemSoundFile);
  
  useEffect(() => {
  if(!gaming){
    clearGame()
  }
    const totalCells = bombs * 10;
    if (bombs == 1) {
      setRows(2);
      setColumns(5);
    } else {
      const calculatedRows = Math.ceil(Math.sqrt(totalCells));
      const calculatedColumns = Math.ceil(totalCells / calculatedRows);
      setRows(calculatedRows);
      setColumns(calculatedColumns);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bombs]);

  useEffect(() => {
    localStorage.setItem(`${GAME_NAME}_bombs`, JSON.stringify(bombs));
    localStorage.setItem(`${GAME_NAME}_betAmount`, JSON.stringify(betAmount));
    localStorage.setItem(`${GAME_NAME}_bombIndexes`, JSON.stringify(bombIndexes));
    localStorage.setItem(`${GAME_NAME}_revealed`, JSON.stringify(revealed));
    localStorage.setItem(`${GAME_NAME}_gaming`, JSON.stringify(gaming));
  }, [bombs, betAmount, bombIndexes, revealed, gaming]);

  const generateBombIndexes = (totalCells, numBombs) => {
    const bombSet = new Set();
    while (bombSet.size < numBombs) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      bombSet.add(randomIndex);
    }
    return Array.from(bombSet);
  };

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
      toast.error("An error occurred while submitting your request.");
    },
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-lost`, info);
      return data;
    },
    onSuccess:()=>{
      clearData()
    }
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-win`, info);
      return data;
    },
    onSuccess: (data) => {
      toast.success("🎉 Congratulations! You won!");
      setUserInfo(data);
      clearGame()
      clearData()
    },
  });


const clearData =()=>{
  localStorage.removeItem(`${GAME_NAME}_bombs`);
  localStorage.removeItem(`${GAME_NAME}_betAmount`);
  localStorage.removeItem(`${GAME_NAME}_bombIndexes`);
  localStorage.removeItem(`${GAME_NAME}_revealed`);
  localStorage.removeItem(`${GAME_NAME}_gaming`);
}


  const handleStartGame = () => {
    setShowWinningScreen(false); 
    if (userInfo?.depositBalance < betAmount) {
      return toast.error("You don't have enough balance to play this game.");
    }
    setGaming(true);
    const totalCells = bombs * 10;
    const gameInfo = {
      userEmail: user?.email,
      betAmount: betAmount,
    };

    gameStart(gameInfo);

    const newBombIndexes = generateBombIndexes(totalCells, bombs);
    setBombIndexes(newBombIndexes);
    setRevealed([]);
    toast.success("🎮 New game started!");
  };

  const handleCellClick = (index) => {
    if (revealed.includes(index)) return;

    const isBomb = bombIndexes.includes(index);

    if (isBomb) {
      playBombSound();
      gameLost({ userEmail: user?.email, betAmount, status: "lost", gameName: "mines" });
      toast.error("💥 Boom! You hit a bomb!");
      setRevealed(Array.from({ length: rows * columns }, (_, i) => i));
      setGaming(false);
      
      return;
    }

    playGemSound();
    const updatedRevealed = [...revealed, index];
    setRevealed(updatedRevealed);

    const totalCells = rows * columns;
    const nonBombCells = totalCells - bombs;
    if (updatedRevealed.length === nonBombCells) {
      handleWin();
    }
  };

  const handleWin = () => {
    setGaming(false);
    setShowWinningScreen(true); 
    gameWin({ userEmail: user?.email, betAmount, winAmount: betAmount * 10, status: "win", gameName: "mins" });
  };

  const clearGame = () => {
    setRevealed([])
  };


  if(loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {showWinningScreen && <Winning amount={betAmount * 10} />}
      <div className="flex  flex-col items-center gap-6 p-2">
     <div className="w-full h-2/3 mt-24 bg-background-section p-2 rounded-lg">
        
          <div
            className={`grid gap-2  `}
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array(rows * columns)
              .fill(null)
              .map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={!gaming}
                  className={`h-16 w-16 flex items-center justify-center rounded ${
                    revealed.includes(index)
                      ? bombIndexes.includes(index)
                        ? "bg-red-500"
                        : "bg-background-secondary"
                      : " bg-[#557086] hover:bg-gray-600"
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

        <div className="p-4 h-1/3 mb-10 bg-background-section rounded-lg shadow-lg w-full  space-y-6">
      {/* Bet Amount Field */}
      <div className="flex justify-between items-center gap-4">
  <div className="w-1/2">
    <label className="block text-sm font-medium mb-1">Bet Amount (10 min)</label>
    <input
      type="number"
      value={betAmount}
      disabled={gaming}
      onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
      className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
      min="10"
    />
  </div>

  <div className="w-1/2">
    <label className="block text-sm font-medium  mb-2">
          Bombs
        </label>
        <select
          value={bombs}
         disabled={gaming}
         
         onChange={(e) => setBombs(e.target.value)}
      className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
        >
            <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
        </select>
  </div>
</div>

     
      

      {/* Start Game Button */}
      <Button
        disabled={gaming}
        onClick={handleStartGame}
        
        className='bg-primary w-full'
        size="lg"
      >
        {gaming ? "Game In Progress" : "Start Game"}
      </Button>
    </div>
      </div>
    </div>
  );
};

export default Stakes;
