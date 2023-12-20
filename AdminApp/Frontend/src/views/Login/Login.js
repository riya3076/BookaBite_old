import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log(user);
      toast.success("Login successful");
      const loginObj = { email: user.email, isLoggedIn: true };
      localStorage.setItem("user", JSON.stringify(loginObj));
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password");
      toast.error("Login unsuccessful");
      console.error("Error during login:", error);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url('https://img.freepik.com/free-psd/chalk-italian-food-isolated_23-2150788278.jpg?w=996&t=st=1698215694~exp=1698216294~hmac=31539d2ddf91d9c22704fd02eb0c9790c7a24e572996145992c17ee604ef320f')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const logoStyle = {
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "250px",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px 10px",
    justifyContent: "center",
    height: "100vh",
  };

  const paperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px 0px #000000",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  };

  const formStyle = {
    width: "100%",
    marginTop: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    display: "inline-block",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    borderRadius: "5px",
  };

  const submitStyle = {
    width: "100%",
    padding: "10px",
    margin: "20px 0",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={backgroundStyle}>
      <div style={containerStyle}>
        <div style={paperStyle}>
          <img
            src={logo}
            alt=""
            style={logoStyle}
            // onClick={() => {
            //   navigate("/");
            // }}
          />
          <h2>Login</h2>
          <form style={formStyle}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <Button style={submitStyle} onClick={handleLogin}>
              Login
            </Button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
