import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const Main = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Fetch user info when component loads
		const fetchUser = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
			    navigate("/login"); // Redirect if no token
			    return;
			}
			
			try {
			    const res = await axios.get("http://localhost:8080/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			    });
			    console.log("User data received:", res.data); // Debugging line
			    setUser(res.data);
			} catch (error) {
			    console.error("Error fetching user:", error);
			    localStorage.removeItem("token");
			    navigate("/login");
			}
		    };
		    
	    
		fetchUser();
	    }, [navigate]);
	    
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Fakebook</h1>
				{user && <span className={styles.user_info}>Hello, {user.firstName} {user.lastName}!</span>}
				<button className={styles.white_btn} onClick={handleLogout}>Logout</button>
			</nav>
		</div>
	);
};

export default Main;
