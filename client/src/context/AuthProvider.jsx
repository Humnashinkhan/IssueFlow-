import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
} from '../services/authService';
import { getToken, setToken, removeToken } from '../utils/token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Only "loading" if there is a saved token we still need to verify
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  // On first load, restore the session from the saved token
  useEffect(() => {
    if (!getToken()) return;

    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { user, token } = await loginUser(credentials);
    setToken(token);
    setUser(user);
  };

  const register = async (details) => {
    const { user, token } = await registerUser(details);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}