import { Button } from "@material-tailwind/react";
import { FaCreditCard } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineInbox } from "react-icons/md";
import { AiOutlineUser, AiOutlineKey } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import useAuth from "../../hooks/useAuth/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Profile = () => {
  const {user,logOut,userInfo}=useAuth()





  const OnLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14805E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload()
        logOut();
        Swal.fire("Logged Out", "You have been successfully logged out.", "success");
      }
    });
  };

  return (
    <div className=" p-4 text-white bg-gray-900">
      {/* Header Section */}
      <div className="bg-primary text-white p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded-full" src="https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg" alt="" />
          
          <div>
            <h1 className="text-xl font-bold">{user?.displayName || 'name'}</h1>
            <p className="text-sm opacity-80">{user?.email || 'eaxmple@gmail.com'}</p>
          </div>
        </div>
      </div>

      {/* Main Wallet Section */}
      <div className="bg-gray-800 shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold">মেইন ওয়ালেট</h2>
        <div className="mt-4 space-y-4">
          {/* Win Balance */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">জিতের ব্যালেন্স</p>
            <p className="text-xl font-bold text-green-400">৳ {userInfo?.winBalance}</p>
          </div>

          {/* Deposit Balance */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">ডিপোজিট ব্যালেন্স</p>
            <p className="text-xl font-bold text-blue-400">৳ {userInfo?.depositBalance}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Deposit and Withdraw */}
        <div className="bg-gray-800 shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">তহবিল</h3>
          <div className="grid grid-cols-2 gap-4">
       <Link to='/deposit'>
              <Button variant="filled" color="blue" className="w-full flex items-center justify-center">
                <FaCreditCard className="mr-2" /> ডিপোজিট
              </Button>
       </Link>
       <Link to='/withdraw'>
              <Button variant="outlined" color="blue" className="w-full flex items-center justify-center">
                <FaCreditCard className="mr-2" /> উত্তোলন
              </Button>
       </Link>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-gray-800 shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">প্রোফাইল</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outlined"  className="w-full border-border border-2 flex items-center justify-center">
              <AiOutlineUser className="mr-2" /> ব্যাক্তিগত তথ্য
            </Button>
          <Link to='/reset'>
              <Button variant="outlined"  className="w-full border-border border-2 flex items-center justify-center">
                <AiOutlineKey className="mr-2" /> পাসওয়ার্ড রিসেট করুন
              </Button>
          </Link>
            <Button variant="outlined"  className="w-full flex items-center justify-between">
              <MdOutlineInbox className="mr-2" /> ইনবক্স <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">2</span>
            </Button>
            <Button variant="outlined"  className="w-full border-border border-2 flex items-center justify-center">
              <BsPeopleFill className="mr-2" /> রেফারেল
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <Button onClick={OnLogout} variant="filled" color="red" className="w-full flex items-center justify-center">
            <FiLogOut className="mr-2" /> লগ আউট
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;