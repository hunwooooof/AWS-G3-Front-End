import { createContext, useCallback, useEffect, useState } from 'react';
import ec2Api from '../utils/ec2Api';
import fb from '../utils/fb';

export const AuthContext = createContext({
  isLogin: false,
  user: {},
  loading: false,
  jwtToken: '',
  login: () => {},
  logout: () => {},
  nativeLogin: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState();

  const handleLoginResponse = useCallback(async (response) => {
    const accessToken = response.authResponse.accessToken;
    const { data } = await ec2Api.signin({
      provider: 'facebook',
      access_token: accessToken,
    });
    const { access_token: tokenFromServer, user: userData } = data;
    setUser(userData);
    setJwtToken(tokenFromServer);
    window.localStorage.setItem('jwtToken', tokenFromServer);
    setIsLogin(true);
    return tokenFromServer;
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      await fb.init();
      const response = await fb.getLoginStatus();
      if (response.status === 'connected') {
        handleLoginResponse(response);
        setLoading(false);
      } else {
        window.localStorage.removeItem('jwtToken');
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [handleLoginResponse]);

  const login = async () => {
    setLoading(true);
    const response = await fb.login();
    if (response.status === 'connected') {
      const tokenFromServer = handleLoginResponse(response);
      setLoading(false);
      return tokenFromServer;
    } else {
      window.localStorage.removeItem('jwtToken');
      setLoading(false);
      return null;
    }
  };

  const nativeLogin = async (body) => {
    setLoading(true);
    const { data } = await ec2Api.signin(body);
    if (data) {
      const accessToken = data.access_token;
      const userData = await ec2Api.getProfile(accessToken);
      if (userData) {
        setUser(userData.data);
        setJwtToken(accessToken);
        window.localStorage.setItem('jwtToken', accessToken);
      }
      setLoading(false);
      setIsLogin(true);
      return accessToken;
    } else {
      window.localStorage.removeItem('jwtToken');
      setLoading(false);
      return null;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setIsLogin(false);
      setUser({});
      setJwtToken();
      window.localStorage.removeItem('jwtToken');
      setLoading(false);
      await fb.logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        loading,
        jwtToken,
        login,
        nativeLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
