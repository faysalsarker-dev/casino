import { Button } from "@material-tailwind/react";
import { FaCreditCard, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useAuth from "../../hooks/useAuth/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import UserUpdate from "./UserUpdate";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import BalanceTransfer from "./BalanceTransfer/BalanceTransfer";
import Loading from './../../components/loading/Loading';

const Profile = () => {
  const { user, logOut, userInfo, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [BalanceOpen, setBalanceOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleBalanseOpen = () => setBalanceOpen(!BalanceOpen);

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
        window.location.reload();
        logOut();
        Swal.fire("Logged Out", "You have been successfully logged out.", "success");
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 bg-background text-text-primary max-w-3xl mx-auto md:p-8">
      {/* Header Section */}
      <div className="bg-background-section p-4 rounded-lg mb-6 mt-20 flex flex-col md:flex-row md:items-center md:space-x-6">
        <img
          className="w-16 h-16 rounded-full mx-auto md:mx-0"
          src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/17a628eb-7f4e-44d7-808a-0851ac0a53f2/a87b5d6b-54a0-440e-a540-6e75fecdbe18.png"
          alt=""
        />
        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold">{user?.displayName || 'name'}</h1>
          <p className="text-sm opacity-80">{user?.email || 'example@gmail.com'}</p>
        </div>
      </div>

      {/* Main Wallet Section */}
      <div className="bg-background-secondary shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold">Main Wallet</h2>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">Win Balance</p>
            <p className="text-xl font-bold text-primary">৳ {userInfo?.winBalance}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">Deposit Balance</p>
            <p className="text-xl font-bold text-secondary">৳ {userInfo?.depositBalance}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Deposit and Withdraw */}
        <div className="bg-background-secondary shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Deposit & Withdraw</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/deposit">
              <Button variant="filled" className="w-full bg-secondary flex items-center justify-center">
                <FaCreditCard className="mr-2" /> Deposit
              </Button>
            </Link>
            <Link to="/withdraw">
              <Button variant="outlined" className="w-full bg-primary text-text-primary flex items-center justify-center">
                <FaCreditCard className="mr-2" /> Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile */}
        <>
          <UserUpdate handleOpen={handleOpen} open={open} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={handleOpen}
              className="w-full p-3 rounded-lg gap-4 bg-background-section border-border border-2 flex items-center justify-start cursor-pointer"
            >
              <FaUser className="text-secondary" /> Personal info
            </div>
            <Link to="/reset">
              <div className="w-full p-3 bg-background-section rounded-lg gap-4 border-border border-2 flex items-center justify-start">
                <RiLockPasswordFill className="text-secondary" /> Password Reset
              </div>
            </Link>
            <BalanceTransfer handleOpen={handleBalanseOpen} open={BalanceOpen} />
            <div
              onClick={handleBalanseOpen}
              className="w-full p-3 bg-background-section rounded-lg gap-4 border-border border-2 flex items-center justify-start cursor-pointer"
            >
              <FaMoneyCheckDollar className="text-secondary" /> Balance Transfer
            </div>
          </div>
        </>

        {user && (
          <div className="text-center mb-10">
            <Button
              onClick={OnLogout}
              variant="filled"
              color="red"
              className="w-full flex items-center justify-center mb-20"
            >
              <FiLogOut className="mr-2" /> লগ আউট
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
