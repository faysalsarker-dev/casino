import { Typography } from "@material-tailwind/react";

import img1 from "../../../images/img1.jpeg";
import img2 from "../../../images/img2.jpeg";
import img3 from "../../../images/img3.jpeg";
import img4 from "../../../images/img4.jpeg";

import GamelistCard from "../../../components/cards/Gamelist/GamelistCard";

const games = [
  { image: img1, name: "Lucky777", path: "/games/lucky", title: "Game 1", description: "Try your luck and hit the jackpot!" },
  { image: img2, name: "Mins", path: "/games/mins", title: "Game 2", description: "Mine gems to grow your wealth." },
  { image: img3, name: "Spinning Wheel", path: "games/spinning", title: "Game 3", description: "Spin the wheel and win rewards." },
  { image: img4, name: "Dragon Tower", path: "/games/dragon-tower", title: "Game 4", description: "Climb the tower by guessing right." },
];



const Games = () => {
  return (
    <div className="px-6 py-8">
   
      <div className="mb-6 text-center mt-20">
      <Typography variant="h2" className="mb-4 text-text-primary text-start pl-2 border-l-4 border-l-text-text-primary ">
       All Games
      </Typography>
      </div>

      
      <div className="grid grid-cols-1  md:grid-cols-2  gap-3">
      {games.map((game, idx) => (
          <GamelistCard key={idx} data={game} />
        ))}
      </div>
    </div>
  );
};

export default Games;
