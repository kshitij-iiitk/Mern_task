import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import styles from "./styles.module.css";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // ✅ Decode token to get user ID and name
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded); // Debugging

      setUser({ name: decoded.name }); 
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Fakebook</h1>
        {user && (
          <span className={styles.user_info}>
            Hello, {user.name}!
          </span>
        )}
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Main;
