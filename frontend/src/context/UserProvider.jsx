import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { authApi } from "../api/authApi";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await authApi.getUserProfile();
        setUser(res.data.user);
      } catch (error) {
        console.log("error fetching user", error?.response);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
