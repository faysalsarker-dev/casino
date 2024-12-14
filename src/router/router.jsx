import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Layout from "../pages/layout/Layout";
import SpinningWheel from "../pages/games/SpinningWheel";
import Register from "../pages/auth/Register";
import Games from "../pages/games/allGames/Games";
import Login from "../pages/auth/Login";
import Profile from "../pages/profile/Profile";
import Support from "../pages/support/Support";
import History from "../pages/history/History";
import DepositRequestPage from "../pages/Deposit/Deposit";




const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/> ,
    errorElement: <h3>error page</h3>,
    children: [
        {
            index:true,
            element:<Home/>
        },
        {
            path:'/games',
            element:<Games/>
        },
        {
            path:'/spinnig',
            element:<SpinningWheel/>
        },
        {
            path:'/profile',
            element:<Profile/>
        },
        {
            path:'/diposit',
            element:<DepositRequestPage/>
        },
      
        {
            path:'/support',
            element:<Support/>
        },
        {
            path:'/history',
            element:<History/>
        },
    ],
  },
  {
    path:'/register',
    element:<Register/>
  },
  {
    path:'/login',
    element:<Login/>
  },

]);

export default router;