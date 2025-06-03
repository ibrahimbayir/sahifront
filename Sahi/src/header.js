import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { FavoriteBorder, Person, DirectionsCar } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleAddCar = () => {
    if (isAdmin) {
      alert("Admin kullanıcılar araç ekleyemez.");
      return;
    }
    navigate("/add-car");
  };

  return (
    <Box
      sx={{
        position: "fixed",       // Header’ı sayfanın en üstüne sabitler
        top: 0,
        left: 0,
        right: 0,
        height: "64px",          // Header’ın net yüksekliği (gerekirse değiştir: örn. "72px")
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        backgroundColor: "white",
        borderBottom: "4px solid #6b3d3d",
        zIndex: 1500,            // Drawer veya diğer bileşenlerin altında kalmaması için yüksek bir değer
      }}
    >
      {/* Logo ve Başlık */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="img"
          src="logos/logo.png"
          alt="Logo"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #6b3d3d",
            backgroundColor: "#fff",
          }}
        />
        <Typography fontWeight="bold" fontSize="18px">
          Sahibinden
        </Typography>
      </Box>

      {/* Navigasyon Öğeleri */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          Home
        </Link>

        <IconButton component={Link} to="/favourite">
          <FavoriteBorder />
        </IconButton>

        <IconButton component={Link} to="/profilepage">
          <Person />
        </IconButton>

        {/* Normal kullanıcılar için "Add Car" ve "My Cars" */}
        {!isAdmin && (
          <>
            <Button
              onClick={handleAddCar}
              sx={{
                backgroundColor: "#2e7d32",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
            >
              Add Car
            </Button>

            <Button
              onClick={() => navigate("/my-car-listing")}
              startIcon={<DirectionsCar />}
              sx={{
                backgroundColor: "#6a1b9a",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#4a148c",
                },
              }}
            >
              My Cars
            </Button>
          </>
        )}

        {/* Admin kullanıcı için "Admin Page" */}
        {isAdmin && (
          <Button
            onClick={() => navigate("/admin")}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "8px",
              px: 2,
              py: 1,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            Admin Page
          </Button>
        )}

        {/* Log Out */}
        <Button
          onClick={handleLogout}
          sx={{
            backgroundColor: "#5c2e2e",
            color: "white",
            textTransform: "uppercase",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#4a2323",
            },
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
