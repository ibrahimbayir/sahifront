import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Marka logoları
const brandLogos = [
  { name: "HONDA", src: "/logos/honda.png" },
  { name: "JAGUAR", src: "/logos/jaguar.png" },
  { name: "NISSAN", src: "/logos/nissan.png" },
  { name: "VOLVO", src: "/logos/volvo.png" },
  { name: "AUDI", src: "/logos/audi.png" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          px: 4,
          py: 1,
        }}
      ></AppBar>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ mt: 8, mb: 10 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Sol yazı alanı */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
            >
              🔍 Find, compare and <br />
              choose the best car <br />
              for you
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              sx={{ mb: 4, fontSize: { xs: "1.2rem", md: "2rem" } }}
            >
              Easily and confidently
            </Typography>

            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                width: "fit-content",
                padding: "8px",
                ml: 6,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#5c2e2e",
                  borderRadius: "8px",
                  paddingX: 4,
                  paddingY: 1.5,
                  fontSize: "1.1rem",
                  boxShadow: "none",
                }}
                onClick={() => navigate("/carlistpage")}
              >
                Compare Now
              </Button>
            </Box>
          </Grid>

          {/* Sağ resimler */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "flex-end",
                justifyContent: "center",
                pr: 6,
              }}
            >
              <img
                src="/logos/v105_475.png" // Audi
                alt="Audi"
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  objectFit: "contain",
                }}
              />
              <img
                src="/logos/v107_20.png" // Lamborghini
                alt="Lamborghini"
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Marka logoları */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
          px: 6,
          pb: 8,
        }}
      >
        {brandLogos.map((brand) => (
          <img
            key={brand.name}
            src={brand.src}
            alt={brand.name}
            style={{
              height: 40,
              objectFit: "contain",
              marginInline: 12,
            }}
          />
        ))}
      </Box>
    </>
  );
};

export default HomePage;
