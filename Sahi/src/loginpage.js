import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const LoginPage = () => {
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

  const clearSession = () => {
    sessionStorage.clear();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearSession();

    try {
      const response = await axios.post(
        "http://localhost:3030/api/user/login",
        null,
        {
          params: { email, password },
        }
      );

      const user = response.data;
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("isAdmin", "false");
      console.log(user);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid email or password.");
    }
  };

  const handleAdminLogin = async () => {
    clearSession();

    try {
      const response = await axios.post(
        "http://localhost:3030/api/user/admin-login",
        null,
        {
          params: { email, password },
        }
      );

      const admin = response.data;
      sessionStorage.setItem("user", JSON.stringify(admin));
      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.setItem("admin", JSON.stringify(admin));
      navigate("/carlistpage");
    } catch (error) {
      console.error("Admin login failed", error);
      alert("Invalid admin credentials.");
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        backgroundImage: "url('logos/arabalar.png')",
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
          maxWidth: 400,
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
            Sign-in
          </Typography>

          <form onSubmit={handleLogin}>
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
              Login
            </Button>
          </form>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleAdminLogin}
            sx={{ mt: 2, borderColor: "#5c2e2e", color: "#5c2e2e" }}
          >
            Login as Admin
          </Button>

          <Typography textAlign="center" mt={2}>
            Don’t have an account?{" "}
            <a href="/signup" style={{ color: "#c1442e", fontWeight: "bold" }}>
              Signup Here
            </a>
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default LoginPage;
