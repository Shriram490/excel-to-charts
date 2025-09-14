import React from "react";
import { msalInstance } from "../authConfig.js"; // 👈 fixed path (../ not ..authConfig.js)
import "./Login.css";
const Login = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ["User.Read"], // request Graph API scope
      });

      msalInstance.setActiveAccount(response.account);

      // ✅ Use accessToken (for Graph API validation), not idToken
      const token = response.accessToken;

      await fetch("http://127.0.0.1:8000/api/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // ✅ Let App.js know login worked
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div  className="login-container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login with Microsoft</h2>
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
};

export default Login;
