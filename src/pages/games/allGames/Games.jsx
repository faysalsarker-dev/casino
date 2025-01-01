import { Typography, Card, CardBody, CardFooter, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import img1 from "../../../images/img1.jpeg";
import img2 from "../../../images/img2.jpeg";
import img3 from "../../../images/img3.jpeg";
import img4 from "../../../images/img4.jpeg";
import img5 from "../../../images/img5.jpeg";
import GameCard from "../../../components/cards/GameCard";

const games = [
  { image: img1, path: "/", title: "Game 1", description: "Exciting adventure game." },
  { image: img2, path: "/", title: "Game 2", description: "Fast-paced action game." },
  { image: img3, path: "/spinnig", title: "Game 3", description: "Solve puzzles and challenges." },
  { image: img4, path: "/", title: "Game 4", description: "Explore new worlds." },
  { image: img5, path: "/", title: "Game 5", description: "Test your strategy skills." },
];

const Games = () => {
  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 text-center">
        <Typography variant="h4" className="font-bold ">
          All Games
        </Typography>
        <Typography variant="subtitle1" className="">
          Explore and discover your favorite games!
        </Typography>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game, idx) => (
          <GameCard key={idx} game={game} />
        ))}
      </div>
    </div>
  );
};

export default Games;
