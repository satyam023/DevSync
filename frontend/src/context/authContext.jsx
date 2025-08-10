import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const clearAuthState = () => {
    setUser(null);
    setAuthError(null);
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/auth/check-auth");
      if (data?.user) {
        setUser(data.user);
      } else {
        clearAuthState();
        redirectIfNotOnAuthPage();
      }
    } catch (error) {
      clearAuthState();
      redirectIfNotOnAuthPage();
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectIfNotOnAuthPage = () => {
    const publicRoutes = ["/", "/signup"];
    if (!publicRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const { data } = await API.post("/auth/signup", userData);
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const errorMsg = error.message || "Registration failed";
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", credentials);
      setUser(data.user);
      setAuthError(null);

      return { success: true, data };
    } catch (error) {
      const errorMsg = error.message || "Login failed";
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = async () => {
    try {
      setLoading(true);
      await API.post("/auth/logout");
      clearAuthState();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError("Failed to logout properly");
    } finally {
      setLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      const { data } = await API.delete("/auth/delete");
      if (!data?.success) {
        throw new Error(data?.message || "Account deletion failed");
      }
      clearAuthState();
      navigate("/", { replace: true });
      return { success: true, message: data.message };
    } catch (error) {
      const errorMsg = error.message || "Account deletion failed";
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const { data } = await API.put("/users/profile", profileData);
      //  Temporarily set minimal user so UI doesn't flicker
      setUser(data.user);
      // Now fetch full user info
      await checkAuth();

      setAuthError(null);
      return { success: true, data };
    } catch (error) {
      const errorMsg = error.message || "Profile update failed";
      setAuthError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        authError,
        clearAuthError: () => setAuthError(null),
        register,
        login,
        logout: () => setShowLogoutConfirm(true),
        updateProfile,
        deleteAccount,
        setUser,
        checkAuth,
      }}
    >
      {children}

      <Dialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? Any unsaved changes may be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Logging Out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </AuthContext.Provider>
  );
};
