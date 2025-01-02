import { Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import winCoin from '../../images/crown.png';
import depositCoin from '../../images/coin (2).png';

const Topbar = () => {
  const { user, userInfo, userInfoloading } = useAuth();

  // Function to format balance
  const formatBalance = (balance) => {
    const balanceStr = parseFloat(balance || 0).toFixed(0);
    return balanceStr.length > 5 ? `${balanceStr.slice(0, 5)}...` : balanceStr;
  };

  return (
    <div className="fixed top-0 w-full z-50 left-0 bg-background-section px-4 py-3 flex justify-between items-center shadow-xl rounded-lg">
      {/* Logo Section */}
      <div className="text-3xl font-extrabold flex items-center text-white">
    BDxBet
      </div>

      {/* Balance Information and Buttons */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            {/* Login Button */}
            <button
              className="px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-secondary hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <Link to="/login">Login</Link>
            </button>

            {/* Sign-Up Button */}
            <Button
              className="bg-primary px-5 py-2 text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-secondary"
            >
              <Link to="/register">Sign Up</Link>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* Balance Display */}
            <div className="flex items-center gap-4">
              {/* Deposit Balance */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-red-500 px-4 py-2 text-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <img src={depositCoin} alt="Deposit Icon" className="w-6 h-6" />
                <div className="flex flex-col items-start">
          
                  <span className="text-lg font-bold">
                    {userInfoloading ? (
                      <Skeleton width={50} height={20} />
                    ) : (
                      formatBalance(userInfo?.depositBalance)
                    )}
                  </span>
                </div>
              </div>

              {/* Win Balance */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-blue-500 px-4 py-2 text-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <img src={winCoin} alt="Win Icon" className="w-6 h-6" />
                <div className="flex flex-col items-start">
                
                  <span className="text-lg font-bold">
                    {userInfoloading ? (
                      <Skeleton width={50} height={20} />
                    ) : (
                      formatBalance(userInfo?.winBalance)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
