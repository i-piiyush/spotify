import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import { useUser } from "../context/UserContext";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { io } from "socket.io-client";

const AppRoutes = () => {
  const { user, loading } = useUser();
  const [socket, setSocket] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const newSocket = io(`http://localhost:3003`, { withCredentials: true });
  }, []);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        {/* protected routes */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/upload-music"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* public routes */}
        <Route
          path="/signup"
          element={
            !user ? (
              <Signup />
            ) : (
              <Navigate
                to={user.role == "artist" ? "/upload-music" : "/"}
                replace
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : (
              <Navigate
                to={user.role == "artist" ? "/upload-music" : "/"}
                replace
              />
            )
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
