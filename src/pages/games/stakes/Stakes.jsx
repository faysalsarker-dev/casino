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
const Stakes = () => {
  const [bombs, setBombs] = useState(3);
  const [betAmount, setBetAmount] = useState(10);
  const [bombIndexes, setBombIndexes] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [disablility, setDisablility] = useState(false);
const [gameOver, setGameOver] = useState(false); 

console.log(bombIndexes);
  const { user, userInfo,setUserInfo } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [playBombSound] = useSound(bombSoundFile);
  const [playGemSound] = useSound(gemSoundFile);
  
  useEffect(() => {
    const totalCells = bombs * 10;
    if(bombs ===1){
      setRows(2);
    setColumns(5);
      return 
    }else{
      const calculatedRows = Math.ceil(Math.sqrt(totalCells));
      const calculatedColumns = Math.ceil(totalCells / calculatedRows);
      setRows(calculatedRows);
      setColumns(calculatedColumns);
    }
   
  }, [bombs]);

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
  return data
    },
    onSuccess:(data)=>{
      setDisablility(true)
      setUserInfo(data)
    },
    onError: () => {
      setDisablility(false)
      toast.error("An error occurred while submitting your request.");
    },
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-lost`, info);
      return data;
    },
    
  });
  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-win`, info);
      return data;
    },
    onSuccess: (data) => {
      clearGame()
      setUserInfo(data.user);
    }
  });

  const handleStartGame = () => {
    if (userInfo?.depositBalance < betAmount) {
      return toast.error("You don't have enough balance to play this game.");
    }
    const totalCells = bombs * 10;
const gameInfo ={
  userEmail: user?.email,
  betAmount: betAmount,
}

    gameStart(gameInfo);

    const newBombIndexes = generateBombIndexes(totalCells, bombs);
    setBombIndexes(newBombIndexes);
    setRevealed([]);
    toast.success("🎮 New game started!");
  };

  const handleCellClick = (index) => {
    if (revealed.includes(index) || gameOver) return;
  
    const isBomb = bombIndexes.includes(index);
  
    if (isBomb) {
      playBombSound();
      gameLost({ userEmail: user?.email, betAmount, status: "lost", gameName: "mines" });
      toast.error("💥 Boom! You hit a bomb!");
      setRevealed(Array.from({ length: rows * columns }, (_, i) => i));
     setDisablility(true)
      setGameOver(true); 
      setDisablility(true); 
      return;
    }
  
    playGemSound();
    const updatedRevealed = [...revealed, index];
    setRevealed(updatedRevealed);
  
    const totalCells = rows * columns;
    const nonBombCells = totalCells - bombs;
    if (updatedRevealed.length === nonBombCells) {
      Winning({ amount: betAmount * 10 });
      setGameOver(true);
      setDisablility(true); 
      gameWin({ userEmail: user?.email, winAmount: betAmount * 10, status: "win", gameName: "Stakes" });
    }
  };
  
  
  
  const clearGame = () => {

    setBombIndexes([]);
    setRevealed([]);
    setDisablility(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="p-4 flex flex-col items-center gap-6">
        {/* Game Settings */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              disabled={disablility}
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
              className="w-full p-2 text-gray-900 rounded bg-gray-200"
              min="10"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Bombs</label>
            <select
              value={bombs}
              disabled={disablility}
              onChange={(e) => setBombs(parseInt(e.target.value))}
              className="w-2/3 p-2 bg-gray-200 text-gray-900 rounded"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <button
            onClick={handleStartGame}
            className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
          >
            Start Game
          </button>
        </div>

        {/* Game Board */}
        <div
          className={`grid gap-2`}
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
              disabled={gameOver}
              className={`h-16 w-16 flex items-center justify-center rounded ${
                revealed.includes(index)
                  ? bombIndexes.includes(index)
                  ? "bg-red-500"
                  : "bg-gray-800"
        
                  : "bg-gray-700 hover:bg-gray-600" // Default hidden state
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
    </div>
  );
};

export default Stakes;
