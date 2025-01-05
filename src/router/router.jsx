import  { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Loading from "../components/loading/Loading";
import Protector from "./protector/Protector";


import ErrorPage from './../pages/ErrorPage/ErrorPage';
import Home from './../pages/home/Home';
import Games from './../pages/games/allGames/Games';
import GemMins from './../pages/games/GemMins/GemMins';
import DragonTower from './../pages/games/Dragon/DragonTower';
import Lucky777 from './../pages/games/lucky777/Lucky';

import Profile from './../pages/profile/Profile';
import { DepositPage } from './../pages/deposit/DepositPage';
import { WithdrowPage } from './../pages/withdraw/WithdrowPage';
import Support from './../pages/support/Support';
import PasswordReset from './../pages/passwordReset/PasswordReset';
import SpinningWheel from "./../pages/games/spinning/SpinningWheel";
import Register from './../pages/auth/Register';
import Login from './../pages/auth/Login';
import History from "../pages/history/History";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/games",
        element: (
          <Suspense fallback={<Loading />}>
            <Games />
          </Suspense>
        ),
      },
      {
        path: "/games/spinning",
        element: (
          <Suspense fallback={<Loading />}>
            <SpinningWheel />
          </Suspense>
        ),
      },
      {
        path: "/games/mins",
        element: (
          <Suspense fallback={<Loading />}>
            <GemMins />
          </Suspense>
        ),
      },
      {
        path: "/games/dragon-tower",
        element: (
          <Suspense fallback={<Loading />}>
            <DragonTower />
          </Suspense>
        ),
      },
      {
        path: "/games/lucky",
        element: (
          <Suspense fallback={<Loading />}>
            <Lucky777 />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "/deposit",
        element: (
          <Suspense fallback={<Loading />}>
            <DepositPage />
          </Suspense>
        ),
      },
      {
        path: "/withdraw",
        element: (
          <Protector>
            <Suspense fallback={<Loading />}>
              <WithdrowPage />
            </Suspense>
          </Protector>
        ),
      },
      {
        path: "/support",
        element: (
          <Protector>
            <Suspense fallback={<Loading />}>
              <Support />
            </Suspense>
          </Protector>
        ),
      },
      {
        path: "/reset",
        element: (
          <Suspense fallback={<Loading />}>
            <PasswordReset />
          </Suspense>
        ),
      },
      {
        path: "/history",
        element: (
          <Protector>
            <Suspense fallback={<Loading />}>
              <History />
            </Suspense>
          </Protector>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loading />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
]);

export default router;
