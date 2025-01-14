import { Button } from '@material-tailwind/react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import winCoin from '../../images/crown.png';
import depositCoin from '../../images/coin (2).png';
import { IoHome, IoGameController } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

// Navigation items
const navItems = [
  { name: "Home", path: "/", icon: <IoHome size={20} /> },
  { name: "Games", path: "/games", icon: <IoGameController size={20} /> },
  { name: "Support", path: "/support", icon: <BiSupport size={20} /> },
  { name: "History", path: "/history", icon: <MdHistory size={20} /> },
  { name: "Profile", path: "/profile", icon: <FaUserCircle size={20} /> },
];

const Topbar = () => {
  const { user, userInfo, userInfoloading } = useAuth();

  // Format balance
  const formatBalance = (balance) => {
    const balanceStr = parseFloat(balance || 0).toFixed(0);
    return balanceStr.length > 5 ? `${balanceStr.slice(0, 5)}...` : balanceStr;
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background-section px-4 py-3 shadow-xl rounded-lg flex justify-between items-center">
      {/* Logo Section */}
      <div className="text-3xl font-extrabold text-white">
     <Link to='/'> xBet<span className='text-blue-500'>Bd</span></Link>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden lg:block w-1/3">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex gap-2 items-center text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-text-primary relative" : "text-gray-500 hover:text-primary"
                }`
              }
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            {/* Login Button */}
            <Button className="bg-secondary px-5 py-2 text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary">
              <Link to="/login">Login</Link>
            </Button>

            {/* Sign-Up Button */}
            <Button className="bg-primary px-5 py-2 text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-secondary">
              <Link to="/register">Sign Up</Link>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* Balances */}
            <div className="flex items-center gap-4">
              {/* Deposit Balance */}
              <div className="flex items-center gap-2 bg-background-secondary border border-red-500 p-2 text-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <img src={depositCoin} alt="Deposit Icon" className="w-5 h-5" />
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
              <div className="flex items-center gap-2 bg-background-secondary border border-blue-500 p-2 text-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <img src={winCoin} alt="Win Icon" className="w-5 h-5" />
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
