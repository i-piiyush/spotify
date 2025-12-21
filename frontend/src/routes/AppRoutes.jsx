import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import { useUser } from "../hooks/useUser";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { io } from "socket.io-client";
import Player from "../pages/Player";

const AppRoutes = () => {
  const { user, loading } = useUser();
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(`http://localhost:3003`, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("play", (data) => {
      const musicId = data;

      navigate(`/music/${musicId}`, { replace: true });
    });
  }, []);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        {/* protected routes */}
        <Route
          path="/"
          element={
            user ? <Home socket={socket} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/music/:id"
          element={user ? <Player /> : <Navigate to="/login" replace />}
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
