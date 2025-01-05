import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";


import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthContext from "./context/AuthContext";
import AppRouter from "./router/router";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContext>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRouter} />
        <Toaster position="top-center" reverseOrder={false} />
      </QueryClientProvider>
    </AuthContext>
  </React.StrictMode>
);