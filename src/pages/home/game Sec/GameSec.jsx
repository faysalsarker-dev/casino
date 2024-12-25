import { Typography } from "@material-tailwind/react";

import img1 from "../../../images/img1.jpeg";
import img2 from "../../../images/img2.jpeg";
import img3 from "../../../images/img3.jpeg";
import img4 from "../../../images/img4.jpeg";
import img5 from "../../../images/img5.jpeg";
import GameCard from "../../../components/cards/GameCard";

const games = [
  {
    image: img1,
    path: "/lucky",
    title: "Game 1",
  },
  {
    image: img2,
    path: "/stakes",
    title: "Game 2",
  },
  {
    image: img3,
    path: "/spinnig",
    title: "Game 3",
  },
  {
    image: img4,
    path: "/dragon-tower",
    title: "Game 4",
  },
  {
    image: img5,
    path: "/",
    title: "Game 5",
  },
];



const GameSec = () => {
  return (
    <div className="px-4 py-6">
      <Typography variant="h2" className="mb-4 text-start pl-2 border-l-4 border-l-primary text-text-white">
        Games
      </Typography>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map((game, idx) => (
          <GameCard key={idx} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GameSec;
