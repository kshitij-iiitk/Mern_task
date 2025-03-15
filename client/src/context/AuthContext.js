import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const token = localStorage.getItem("token");
		return token ? { token } : null;
	});
	
	useEffect(() => {
		const updateUser = () => {
			const token = localStorage.getItem("token");
			setUser(token ? { token } : null);
		};
	
		// Listen for changes in localStorage
		window.addEventListener("storage", updateUser);
	
		// Cleanup event listener on unmount
		return () => window.removeEventListener("storage", updateUser);
	}, []);
	
	
	const login = (token) => {
		localStorage.setItem("token", token);
		setUser(token);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
