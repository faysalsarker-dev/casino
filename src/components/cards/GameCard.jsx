/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Card, CardHeader, CardFooter, Button } from "@material-tailwind/react";

const GameCard = ({ game }) => (
  <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-md bg-gray-800 hover:shadow-lg transition-shadow duration-200">
    {/* Game Image */}
    <CardHeader floated={false} className="p-0 relative">
      <img
        src={game?.image}
        alt={game?.title}
        className="w-full h-48 object-cover"
      />
    </CardHeader>

    {/* Play Button */}
    <CardFooter className="p-4">
      <Link to={game?.path}>
        <Button size="lg" fullWidth={true} className="bg-green-600 hover:bg-green-700 text-white">
          Play Now
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default GameCard;
