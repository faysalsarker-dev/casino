import { NavLink } from "react-router-dom";
import { IoHome, IoGameController } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: <IoHome size={24} />,
  },
  {
    name: "Games",
    path: "/games",
    icon: <IoGameController size={24} />,
  },
  {
    name: "Support",
    path: "/support",
    icon: <BiSupport size={24} />,
  },
  {
    name: "History",
    path: "/history",
    icon: <MdHistory size={24} />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <FaUserCircle size={24} />,
  },
];

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-background-section shadow-md border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-text-primary relative"
                  : "text-gray-500 hover:text-primary"
              }`
            }
          >
            {item.icon}
            <span className="mt-1">{item.name}</span>
    
           
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
