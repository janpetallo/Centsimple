import { createContext, useContext, useState, useEffect } from "react";
import * as apiService from "../services/api.service";

// 1. Create the Context
// This creates a "box" or a "pipe" that components can use to share data
// without having to pass props down through many levels.
// We give it an empty object {} as a default value, but this will be overridden by the Provider.
const AuthContext = createContext({});

// 2. Create the Provider Component
// This component will "provide" the authentication state (like the current user)
// to all the components inside of it. You will wrap your entire app with this component.
export function AuthProvider({ children }) {
  // State to hold the currently logged-in user's data.
  const [user, setUser] = useState(null);

  // State to track whether the initial check is still happening
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkUserStatus() {
      try {
        const userData = await apiService.checkAuthStatus();
        if (userData) {
          login(userData);
        }
      } catch (error) {
        console.error("Server checkAuthStatus failed:", error.message);
      } finally {
        setLoading(false);
      }
    }
    checkUserStatus();
    apiService.setupApiInterceptor(logout);
  }, []);

  // Function to update the user state when someone logs in.
  function login(userData) {
    setUser(userData);
  }

  // Function to clear the user state when someone logs out.
  async function logout() {
    try {
      await apiService.logoutUser();
    } catch (error) {
      // Even if the server call fails, we should still log the user out on the client.
      console.error(
        "Server logout failed, logging out locally anyway:",
        error.message
      );
    } finally {
      // This ensures the user is always cleared from the client-side
      setUser(null);
    }
  }

  // 3. Create the value to be shared
  // This object holds the data and functions that we want to make available
  // to any component that consumes this context.
  const contextValue = {
    user,
    loading,
    login,
    logout,
  };

  // 4. Return the Provider with the shared value
  // We wrap the `children` (which will be our entire app) with the Provider. (See main.jsx)
  // The `value` prop is where we pass the data and functions that we want to share.
  // Any component inside `children` can now access this `value`.
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// 5. Create a Custom Hook for easy consumption
// This is a helper hook that makes it easier for other components to get the context data.
// Instead of importing `useContext` and `AuthContext` everywhere,
// components can just import and call `useAuth()`.
// It is a very common pattern to export the consumer hook from the same file as the provider.
// We can safely disable this specific linter rule here.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  // `useContext(AuthContext)` is the React hook that actually reads the value
  // from the nearest `AuthContext.Provider` up the component tree.
  return useContext(AuthContext);
}
