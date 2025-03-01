import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Restore user state from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false); // Set loading to false once user state is restored
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    const finalData = {
      ...userData,
      email: userData.businessEmail,
      role: userData.role // Ensure role is included
    };
    localStorage.setItem('user', JSON.stringify(finalData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};