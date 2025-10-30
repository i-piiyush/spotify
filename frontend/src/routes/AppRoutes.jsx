import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import { useUser } from "../context/UserContext";
import Login from "../pages/Login";

const AppRoutes = () => {
  const { user,loading } = useUser();
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        {/* protected routes */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* public routes */}
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="/login"
          element={!user ? <Login />  : <Navigate to="/" replace />}
        />

      </Routes>
    </>
  );
};

export default AppRoutes;
