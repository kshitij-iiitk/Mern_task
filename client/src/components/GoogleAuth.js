import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

// GoogleAuth component to handle Google authentication
// It uses the GoogleOAuthProvider and GoogleLogin components from the react-oauth library
// It takes the client ID as a prop and handles the success and error callbacks

const GoogleAuth = () => {
  const clientId =
    "463140881685-i30nsivuf7kaoactdbik83qjob5uut2n.apps.googleusercontent.com";

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google Login Success:", credentialResponse);
      const { credential } = credentialResponse;

      // Send token to backend
      const response = await axios.post("http://localhost:8080/api/google", {
        token: credential,
      });

      console.log("Backend Response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store user token
      }
    } catch (error) {
      console.error("Google Authentication Error:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
