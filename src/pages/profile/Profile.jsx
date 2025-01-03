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
    <div className=" p-4 bg-background text-text-primary">
      {/* Header Section */}
      <div className="bg-background-section p-4 rounded-lg mb-6 mt-20">
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded-full" src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/17a628eb-7f4e-44d7-808a-0851ac0a53f2/a87b5d6b-54a0-440e-a540-6e75fecdbe18.png" alt="" />
          
          <div>
            <h1 className="text-xl font-bold">{user?.displayName || 'name'}</h1>
            <p className="text-sm opacity-80">{user?.email || 'eaxmple@gmail.com'}</p>
          </div>
        </div>
      </div>

      {/* Main Wallet Section */}
      <div className="bg-background-secondary shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold">মেইন ওয়ালেট</h2>
        <div className="mt-4 space-y-4">
          {/* Win Balance */}
          <div className="flex justify-between items-center">
            <p className="text-sm ">জিতের ব্যালেন্স</p>
            <p className="text-xl font-bold text-primary">৳ {userInfo?.winBalance}</p>
          </div>

          {/* Deposit Balance */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">ডিপোজিট ব্যালেন্স</p>
            <p className="text-xl font-bold text-secondary">৳ {userInfo?.depositBalance}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Deposit and Withdraw */}
        <div className="bg-background-secondary shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">তহবিল</h3>
          <div className="grid grid-cols-2 gap-4">
       <Link to='/deposit'>
              <Button variant="filled" className="w-full bg-secondary flex items-center justify-center">
                <FaCreditCard className="mr-2" /> ডিপোজিট
              </Button>
       </Link>
       <Link to='/withdraw'>
              <Button variant="outlined" className="w-full bg-primary text-text-primary flex items-center justify-center">
                <FaCreditCard className="mr-2" /> উত্তোলন
              </Button>
       </Link>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-background-secondary shadow-md rounded-lg p-4">
          
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outlined"  className="w-full bg-background-section border-border border-2 flex items-center justify-center">
              <AiOutlineUser className="mr-2" /> ব্যাক্তিগত তথ্য
            </Button>
          <Link to='/reset'>
              <Button variant="outlined"  className="w-full border-border border-2 flex items-center justify-center">
                <AiOutlineKey className="mr-2" /> পাসওয়ার্ড রিসেট করুন
              </Button>
          </Link>
          
            <Button variant="outlined"  className="w-full border-border border-2 flex items-center justify-center">
              <BsPeopleFill className="mr-2" /> রেফারেল
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center mb-5">
          <Button onClick={OnLogout} variant="filled" color="red" className="w-full flex items-center justify-center">
            <FiLogOut className="mr-2" /> লগ আউট
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;