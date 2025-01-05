/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";


const GameCard = ({ game }) => (
  <Link to={game?.path}>
  <div className="w-full rounded-lg shadow-lg">
  
      <img
        src={game?.image}
        alt={game?.title}
        className="w-full h-full object-cover rounded-lg"
      />
  

 
  </div>
  </Link>
);

export default GameCard;
