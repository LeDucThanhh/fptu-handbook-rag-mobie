import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { saveCredentials, loadCredentials, clearCredentials, normalizeTokenValue } from '../utils/storage';
import { setAuthToken, registerUnauthorizedHandler } from '../services/apiClient';

const defaultAuthState = {
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
  isHydrating: true
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(defaultAuthState);

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        const stored = await loadCredentials();

        if (!isMounted) {
          return;
        }

        if (stored?.token) {
          setAuthToken(stored.token);
          setState({
            user: stored.user,
            token: stored.token,
            roles: stored.roles ?? [],
            isAuthenticated: true,
            isHydrating: false
          });
        } else {
          setState((prev) => ({ ...prev, isHydrating: false }));
        }
      } catch (error) {
        console.warn('Failed to bootstrap auth context', error);
        if (isMounted) {
          setState(defaultAuthState);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async ({ token, user, roles = [] }) => {
    const normalizedToken = normalizeTokenValue(token);

    if (!normalizedToken) {
      throw new Error('Token is required to sign in.');
    }

    try {
      await saveCredentials({ token: normalizedToken, user, roles });
    } catch (error) {
      console.warn('Failed to persist credentials', error);
    }
    setAuthToken(normalizedToken);

    setState({
      user,
      token: normalizedToken,
      roles,
      isAuthenticated: Boolean(normalizedToken),
      isHydrating: false
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await clearCredentials();
    } catch (error) {
      console.warn('Failed to clear stored credentials', error);
    }
    setAuthToken(null);
    setState({
      ...defaultAuthState,
      isHydrating: false
    });
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(signOut);
  }, [signOut]);

  const updateUser = useCallback((updater) => {
    setState((prev) => {
      const nextUser = typeof updater === 'function' ? updater(prev.user) : updater;
      saveCredentials({ token: prev.token, user: nextUser, roles: prev.roles }).catch((error) => {
        console.warn('Failed to persist updated user profile', error);
      });
      return {
        ...prev,
        user: nextUser
      };
    });
  }, []);

  const hasRole = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
      if (!Array.isArray(requiredRoles)) {
        return state.roles.includes(requiredRoles);
      }
      return requiredRoles.some((role) => state.roles.includes(role));
    },
    [state.roles]
  );

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
      updateUser,
      hasRole
    }),
    [state, signIn, signOut, updateUser, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
