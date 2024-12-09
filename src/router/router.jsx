import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Layout from "../pages/layout/Layout";
import SpinningWheel from "../pages/games/SpinningWheel";
import Register from "../pages/auth/Register";
import Games from "../pages/games/allGames/Games";


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
    ],
  },
  {
    path:'/register',
    element:<Register/>
  }

]);

export default router;