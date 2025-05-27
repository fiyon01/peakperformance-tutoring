import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
  
    // Step 1: If no user, redirect to landing page
    if (!user) {
      navigate("/");
      return;
    }
  
    // Step 2: Check token
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/students-login");
      return;
    }
  
    try {
      const { exp } = jwtDecode(token);
  
      // Step 3: Check token expiry
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/students-login");
      } else {
        // Optional: stay on current route or navigate home
        navigate("/");
      }
    } catch (err) {
      console.error("Token decode error:", err);
      localStorage.removeItem("token");
      navigate("/auth/students-login");
    }
  }, [navigate]);
  

  return children;
};

export default ProtectedRoute;
