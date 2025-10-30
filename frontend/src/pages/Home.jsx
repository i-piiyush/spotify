import React from "react";
import { axiosClient } from "../api/axiosClient";
import { authApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  return (
    <div>
      Home
      <button
        className="bg-black text-white px-5 py-3 "
        onClick={() => {
          try {
            authApi.logout();

            navigate("/login");
            setUser(null);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Home;
