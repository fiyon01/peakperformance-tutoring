import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Landing page
      return;
    }

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/students-login");
      }
    } catch (err) {
      console.error("Token decode error:", err);
      navigate("/");
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
