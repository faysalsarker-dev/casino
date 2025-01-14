import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import egg from "../.../../../../images/egg.png";
import bomb from "../.../../../../images/bomb.png";
import { Button } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure/useAxiosSecure";
import useAuth from "../../../hooks/useAuth/useAuth";
import Winning from "../../../components/winning/Winning";
import bombSoundFile from "../../../audio/bomb.m4a";
import gemSoundFile from "../../../audio/gem.m4a";
import useSound from "use-sound";
import Loading from "../../../components/loading/Loading";
import toast from "react-hot-toast";
const GAME_NAME = "dragon-tower";

const DragonTower = () => {
  const axiosSecure = useAxiosSecure();
  const { user, setUserInfo ,loading ,userInfo} = useAuth();

  const [currentLevel, setCurrentLevel] = useState(
    () => JSON.parse(localStorage.getItem(`${GAME_NAME}_currentLevel`)) || 0
  );
  const [selectedPath, setSelectedPath] = useState(
    () => JSON.parse(localStorage.getItem(`${GAME_NAME}_selectedPath`)) || []
  );
  const [difficulty] = useState("medium");
  const [betAmount, setBetAmount] = useState(
    () => JSON.parse(localStorage.getItem(`${GAME_NAME}_betAmount`)) || 10
  );
  const [gaming, setGaming] = useState(
    () => JSON.parse(localStorage.getItem(`${GAME_NAME}_gaming`)) || false
  );
 const [playBombSound] = useSound(bombSoundFile);
  const [playEggSound] = useSound(gemSoundFile);
  const generateTower = (bombCount) => {
    const rows = 5;
    return Array(rows)
      .fill(null)
      .map(() => {
        const row = Array(4).fill(true);
        for (let i = 0; i < bombCount; i++) {
          row[i] = false;
        }
        return row.sort(() => Math.random() - 0.5);
      });
  };
  const getBombs = (difficulty) => (difficulty === "easy" ? 1 : 2);
  const [tower, setTower] = useState(() => generateTower(getBombs(difficulty)));
  const [showWinningScreen, setShowWinningScreen] = useState(false);

  useEffect(() => {
    localStorage.setItem(`${GAME_NAME}_currentLevel`, JSON.stringify(currentLevel));
    localStorage.setItem(`${GAME_NAME}_selectedPath`, JSON.stringify(selectedPath));
    localStorage.setItem(`${GAME_NAME}_difficulty`, difficulty);
    localStorage.setItem(`${GAME_NAME}_betAmount`, JSON.stringify(betAmount));
    localStorage.setItem(`${GAME_NAME}_gaming`, JSON.stringify(gaming));
  }, [currentLevel, selectedPath, difficulty, betAmount, gaming]);




  const { mutateAsync: gameStart } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-start`, info);
      return data;
    },
    onSuccess: (data) => {
      setGaming(true);
      setUserInfo(data);
    },
    onError: () => setGaming(false),
  });

  const { mutateAsync: gameLost } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-lost`, info);
      return data;
    },
    onSuccess:()=>{
      clearGameData()
      
    },
  });

  const { mutateAsync: gameWin } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.post(`/game/games-win`, info);
      return data;
    },
    onSuccess: (data) => {
      clearGameData();
      setUserInfo(data);
    },
  });

  const handleTileClick = (index) => {
    if (!gaming) return;
console.log(tower);
    const isSafe = tower[currentLevel][index];
    const newSelectedPath = [...selectedPath, { level: currentLevel, index, isSafe }];
    setSelectedPath(newSelectedPath);

    if (isSafe) {
      if (currentLevel === tower.length - 1) {
        setGaming(false);
        setShowWinningScreen(true);
        playEggSound();
        setUserInfo({
          ...userInfo, 
          winBalance: userInfo.winBalance + betAmount * 100
        });
        gameWin({
          userEmail: user?.email,
          betAmount,
          winAmount: betAmount * 100,
          status: "win",
          gameName: GAME_NAME,
        });
      } else {
        playEggSound();
        setCurrentLevel(currentLevel + 1);
      }
    } else {
      playBombSound();
      setGaming(false);
      gameLost({
        userEmail: user?.email,
        betAmount,
        status: "lost",
        gameName: GAME_NAME,
      });
      revealAllBombs();
      clearGameData()
    }
  };

  const revealAllBombs = () => {
    const allRevealedPath = tower.map((level, levelIndex) =>
      level.map((tile, index) => ({
        level: levelIndex,
        index,
        isSafe: tile,
      }))
    );
    setSelectedPath(allRevealedPath.flat());
  };

  const handleGameStart = () => {
   if (userInfo?.depositBalance < betAmount) {
      return toast.error("You don't have enough balance to play this game.");
    }
    if(betAmount < 10){
      return toast.error("Bet amount should be at least 10.")
    }
    setUserInfo({
      ...userInfo, 
      depositBalance: userInfo.depositBalance - betAmount
    });
    resetGame();
    gameStart({ userEmail: user?.email, betAmount });
  };

  const resetGame = () => {
    const bombCount = getBombs(difficulty);
    setCurrentLevel(0);
    setSelectedPath([]);
    setGaming(false);
    setTower(generateTower(bombCount));
  };

  const clearGameData = () => {
    localStorage.removeItem(`${GAME_NAME}_currentLevel`);
    localStorage.removeItem(`${GAME_NAME}_selectedPath`);
    localStorage.removeItem(`${GAME_NAME}_gaming`);
  };


  if(loading) return <Loading />;

  return (
    <div className="flex flex-col lg:flex-row-reverse items-center min-h-screen bg-background text-text-primary p-3">
      {showWinningScreen && <Winning amount={betAmount * 100} />}
    

      <div className="mt-24 p-2 rounded-lg grid grid-cols-1 gap-4 w-full h-2/3 bg-background-section">
        {tower
        .map((level, levelIndex) => ({ level, levelIndex }))
        .reverse()
        .map(({ level, levelIndex }) => (
          <motion.div
            key={levelIndex}
            className={`flex justify-center  gap-4`}
          >
            {level.map((tile, tileIndex) => {
              const isSelected = selectedPath.some(
                (p) => p.level === levelIndex && p.index === tileIndex
              );
              const result = selectedPath.find(
                (p) => p.level === levelIndex && p.index === tileIndex
              );

              return (
                <motion.button
                  key={tileIndex}
                  className={`w-16 h-16 flex items-center justify-center rounded-md cursor-pointer ${
                    isSelected
                      ? result?.isSafe
                        ? "bg-background-secondary"
                        : "bg-red-500"
                      : levelIndex === currentLevel
                      ? gaming ? "bg-primary text-white" :"bg-[#557086]"
                      : "bg-[#557086]"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => levelIndex === currentLevel && handleTileClick(tileIndex)}
                >
                  {levelIndex === currentLevel && !isSelected ? (
                  gaming && (<motion.span
                      className="text-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      ?
                    </motion.span>)
                  ) : isSelected &&
                    (result?.isSafe ? (
                      <motion.img
                        src={egg}
                        alt="gem"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9 }}
                      />
                    ) : (
                      <motion.img
                        src={bomb}
                        alt="bomb"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.9 }}
                      />
                    ))}
                </motion.button>
              );
            })}
          </motion.div>
        ))}
      </div>
      <div className="p-3 w-full h-1/3">
        <div className="bg-background-section w-full p-4 rounded-lg mt-5">
        <div className="flex justify-between items-center gap-4">
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">WIN 100x</label>
    <input
      type="number"
      value={betAmount}
      disabled={gaming}
      onChange={(e) => setBetAmount(parseInt(e.target.value))}
      className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
      min="10"
    />
  </div>



{/* for seltected the game easy or medium  */}


  {/* <div className="w-1/2">
    <label className="block text-sm font-medium mb-1">Game Mode</label>
   
    <select
      value={difficulty}
      disabled={gaming}
      onChange={(e) => setDifficulty(e.target.value)}
      className="w-full bg-[#0F212E] text-white border border-gray-300 rounded-md px-3 py-2"
    >
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
    </select>
  </div> */}



</div>


          <Button onClick={handleGameStart} disabled={gaming} className="bg-primary w-full mt-4">
            {gaming ? "Game In Progress" : "Start Game"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DragonTower;