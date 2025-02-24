// components/Context/userContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    setUser(userData);
    const finalData = {
      ...userData,
      email: userData.businessEmail,
    };
    localStorage.setItem('user', JSON.stringify(finalData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};