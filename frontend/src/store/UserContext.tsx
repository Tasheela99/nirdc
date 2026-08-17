import { createContext, useState, useEffect, ReactNode } from "react";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY;

interface IUserInfo {
  role: string;
  email: string;
  userName?: string;
  displayName?: string;
  id?: string;
}

interface IUserContext {
  userInfo: IUserInfo;
  isLoggedIn: boolean;
  isInitialized: boolean;
  updateUserInfo: (userData: IUserInfo, token: string) => void;
  resetUserInfo: () => void;
  checkAuthStatus: () => boolean;
  isAdmin?: boolean;
}

export const initialUserInfo: IUserInfo = {
  role: "",
  email: "",
  userName: "",
};

const UserContext = createContext<IUserContext>({
  userInfo: initialUserInfo,
  isLoggedIn: false,
  isInitialized: false,
  updateUserInfo: () => {},
  resetUserInfo: () => {},
  checkAuthStatus: () => false,
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>(initialUserInfo);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const encryptData = (data: any): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  };

  const decryptData = (encryptedData: string): any => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const validateToken = (token: string): boolean => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  const checkAuthStatus = (): boolean => {
    const encryptedToken = localStorage.getItem("token");
    const encryptedUserInfo = localStorage.getItem("userInfo");

    if (!encryptedToken || !encryptedUserInfo) {
      return false;
    }

    try {
      const token = decryptData(encryptedToken);
      const userInfo = decryptData(encryptedUserInfo);

      if (!validateToken(token)) {
        resetUserInfo();
        return false;
      }

      return !!userInfo?.role && !!userInfo?.email && !!userInfo?.userName;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const encryptedToken = localStorage.getItem("token");
      const encryptedUserInfo = localStorage.getItem("userInfo");

      if (encryptedToken && encryptedUserInfo) {
        try {
          const token = decryptData(encryptedToken);
          const userInfo = decryptData(encryptedUserInfo);

          if (validateToken(token)) {
            setUserInfo(userInfo);
            setIsLoggedIn(true);
          } else {
            resetUserInfo();
          }
        } catch {
          resetUserInfo();
        }
      } else {
        resetUserInfo();
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const updateUserInfo = (userData: IUserInfo, token: string) => {
    if (userData.email && userData.role && userData.userName) {
      const encryptedToken = encryptData(token);
      const encryptedUserInfo = encryptData(userData);

      localStorage.setItem("token", encryptedToken);
      localStorage.setItem("userInfo", encryptedUserInfo);

      setUserInfo(userData);
      setIsLoggedIn(true);
    } else {
      resetUserInfo();
    }
  };

  const resetUserInfo = () => {
    setUserInfo(initialUserInfo);
    setIsLoggedIn(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  const context = {
    userInfo,
    isLoggedIn,
    isInitialized,
    updateUserInfo,
    resetUserInfo,
    checkAuthStatus,
    isAdmin: userInfo.role === 'ADMIN' || userInfo.role === 'SUPER_ADMIN' || userInfo.role === 'DIRECTOR',
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
};

export default UserContext;