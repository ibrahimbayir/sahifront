import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState(""); // fullName yerine
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // user state

  // Sayfa yüklendiğinde session'dan kullanıcıyı al
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("Session'dan gelen kullanıcı:", storedUser);
    setUser(storedUser);
  }, []);


  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3030/api/user/signup",
        {
          username,
          email,
          password,
        }
      );

      console.log("Signup response:", response);

      alert("Account created! You can now log in.");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Email already exists!");
      } else {
        alert("Signup failed!");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        backgroundImage: "url('/logos/arabalar.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "12px",
          boxShadow: 5,
          padding: 4,
          maxWidth: 450,
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            textAlign="center"
          >
            Create Account
          </Typography>

          <form onSubmit={handleSignup}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#5c2e2e", mt: 2 }}
            >
              Create Account
            </Button>
          </form>

          <Typography textAlign="center" mt={2}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#3f51b5", fontWeight: "bold" }}>
              Login
            </a>
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default SignupPage;
