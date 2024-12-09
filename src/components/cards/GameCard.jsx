/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

 const GameCard = ({ game }) => (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link to={game?.path}>
        <img
          src={game?.image}
          alt={game?.title}
          className="w-full h-auto object-cover"
        />
      </Link>
    </div>
  );

  export default GameCard