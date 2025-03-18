import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "./styles.module.css";

import AgentForm from "../Agents/pages";
import AgentList from "../Agent_table/page";
import UploadContacts from "../Uploadcontact/page.js";
import AgentProvider from "../../context/AgentContext.js";

// Main component to display the main dashboard
// It displays the user's name, a logout button, and the agent form and list

const Main = () => {
  const [user, setUser] = useState(null);
  const [userId, setuserId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode token to get user ID and name
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      setUser({ name: decoded.name });
      setuserId(decoded._id);
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
        {user && <span className={styles.user_info}>Hello, {user.name}!</span>}
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className={styles.above_div}></div>
      <AgentProvider>
        <AgentForm userId={userId} />
        <UploadContacts userId={userId} />
        <AgentList userId={userId} />
      </AgentProvider>
    </div>
  );
};

export default Main;
