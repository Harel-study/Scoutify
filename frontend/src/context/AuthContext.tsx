/**
 * @module AuthContext
 *
 * Manages global authentication state, session persistence, and provides
 * functions for logging in, registering, and logging out via the API.
 */
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../utils/axios';

export interface User {
  /** @type {string} Unique identifier for the user. */
  id: string;
  /** @type {string} Display name of the user. */
  username: string;
  /** @type {string | undefined} Optional email address. */
  email?: string;
  /** @type {'player' | 'team' | 'staff'} The type of account role. */
  role: 'player' | 'team' | 'staff';
}

interface GoogleLoginResult {
  /** @type {boolean | undefined} True if the user needs to select a role to complete registration. */
  needsRoleSelection?: boolean;
  /** @type {string | undefined} Email address returned from Google. */
  email?: string;
  /** @type {string | undefined} Google unique ID. */
  googleId?: string;
}

interface AuthContextType {
  /** @type {User | null} The currently authenticated user, or null if unauthenticated. */
  user: User | null;
  /** @type {boolean} True if the session status is currently being verified. */
  loading: boolean;
  /**
   * Authenticates a user with username and password.
   *
   * @param  {string}  username  The username.
   * @param  {string}  password  The password.
   * @returns {Promise<void>} Resolves on success.
   * @throws  {Error} If login fails.
   */
  login: (username: string, password: string) => Promise<void>;
  /**
   * Registers a new user.
   *
   * @param  {string}  username  The username.
   * @param  {string}  email     The email address.
   * @param  {string}  password  The password.
   * @param  {'player' | 'team' | 'staff'}  role  The selected role.
   * @returns {Promise<void>} Resolves on success.
   * @throws  {Error} If registration fails.
   */
  register: (
    username: string,
    email: string,
    password: string,
    role: 'player' | 'team' | 'staff'
) => Promise<void>;
  /**
   * Authenticates or registers a user via Google ID Token.
   *
   * @param  {string}  idToken  Google ID token.
   * @param  {'player' | 'team' | 'staff'}  [role]  Optional role if completing registration.
   * @returns {Promise<GoogleLoginResult>} Contains registration context if role is missing.
   * @throws  {Error} If authentication fails.
   */
  googleLogin: (
    idToken: string,
    role?: 'player' | 'team' | 'staff'
  ) => Promise<GoogleLoginResult>;
  /**
   * Logs out the current user and clears local session data.
   *
   * @returns {Promise<void>} Resolves when logout is complete.
   */
  logout: () => Promise<void>;
  /**
   * Verifies the current session token with the backend API.
   *
   * @returns {Promise<void>} Resolves when session check completes.
   */
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and methods to the component tree.
 *
 * Automatically verifies session state on mount and listens for auth-expired
 * events to handle session termination gracefully.
 *
 * @param  {object}           props           The component props.
 * @param  {React.ReactNode}  props.children  The child components.
 * @returns {React.ReactElement} The Auth Provider element.
 */
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get('/profiles/me');
      const profile = response.data.profile;

      if (profile?.userID) {
        setUser({
          id: profile.userID._id,
          username: profile.userID.username,
          email: profile.userID.email,
          role: profile.userID.role,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void checkSession();

    const handleAuthExpired = (): void => {
      setUser(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<void> => {
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { accessToken, user: loggedUser } = response.data;

      localStorage.setItem('accessToken', accessToken);
      setUser(loggedUser);
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

 const register = async (
  username: string,
  email: string,
  password: string,
  role: 'player' | 'team' | 'staff'
): Promise<void> => {
  setLoading(true);

  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      role,
    });
    const { accessToken, user: registeredUser } = response.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(registeredUser);
  } catch (err: any) {
    console.error('Registration error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      baseURL: err.config?.baseURL,
      url: err.config?.url,
    });
    throw new Error(
      err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed'
    );
  } finally {
    setLoading(false);
  }
};
  const googleLogin = async (
    idToken: string,
    role?: 'player' | 'team' | 'staff'
  ): Promise<GoogleLoginResult> => {
    setLoading(true);

    try {
      const response = await api.post('/auth/google', {
        idToken,
        role,
      });

      if (response.data.needsRoleSelection) {
        return {
          needsRoleSelection: true,
          email: response.data.email,
          googleId: response.data.googleId,
        };
      }

      const { accessToken, user: loggedUser } = response.data;

      localStorage.setItem('accessToken', accessToken);
      setUser(loggedUser);

      return {};
    } catch (err: any) {
      console.error('Google login error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        baseURL: err.config?.baseURL,
        url: err.config?.url,
      });

      throw new Error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Google login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
/**
 * Hook to access the authentication context.
 *
 * Must be used within an AuthProvider component tree.
 *
 * @returns {AuthContextType} The current authentication context values.
 * @throws  {Error} If called outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};