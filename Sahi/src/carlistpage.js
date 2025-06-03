// CarListPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";                   // Sabitlenmiş Header
import CarFilterSidebar from "./carfiltersidebar"; // İçinde overlay (temporary) Drawer var
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HEADER_HEIGHT = 64; // Header.js'deki height ile aynı olmalı (örneğin "64px").

const CarListPage = () => {
  const navigate = useNavigate();

  // Kullanıcı ve admin bilgileri
  const storedUser = sessionStorage.getItem("user");
  const storedAdmin = sessionStorage.getItem("admin");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  let adminId = null;
  if (storedAdmin) {
    try {
      const adminObj = JSON.parse(storedAdmin);
      adminId = adminObj?.id || null;
    } catch {
      adminId = null;
    }
  }

  // Eğer giriş yapılmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!user && !isAdmin) {
      navigate("/login");
    }
  }, [user, isAdmin, navigate]);

  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [showCompareBar, setShowCompareBar] = useState(false);

  // Sayfa açılır açılmaz tüm araçları çek
  useEffect(() => {
    axios
      .get("http://localhost:3030/api/car/main")
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Failed to fetch cars", err));
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/carpage/${id}`);
  };

  const handleCompareClick = (carId) => {
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    let updated = [...selectedCars];
    if (updated.includes(carId)) return; // Aynı aracı tekrar seçme

    updated.push(carId);

    if (updated.length === 1) {
      setSelectedCars(updated);
      setShowCompareBar(true);
    } else if (updated.length === 2) {
      const [car1, car2] = updated;
      axios
        .post(`http://localhost:3030/api/comparison/${userId}/${car1}/${car2}`)
        .then(() => {
          navigate("/compare");
        })
        .catch((err) => {
          console.error("Comparison error", err);
          alert("Comparison failed.");
        });
    } else {
      // 2’den fazla seçilirse sadece son seçimi tut
      updated = [updated[1]];
      setSelectedCars(updated);
    }
  };

  const handleDeleteCar = (carId) => {
    if (!isAdmin || !adminId) {
      alert("You must be logged in as an admin to delete a car.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    axios
      .delete(`http://localhost:3030/api/car/${adminId}/${carId}`)
      .then(() => {
        setCars((prev) => prev.filter((car) => car.id !== carId));
      })
      .catch((err) => {
        console.error("Delete failed", err);
        alert("Deletion failed.");
      });
  };

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Filtreleme fonksiyonu
  const handleFilter = (filters) => {
    let url = "http://localhost:3030/api/car/main";

    if (filters.brand) {
      url = `http://localhost:3030/api/car/filter/brand/${filters.brand}`;
    } else if (filters.model) {
      url = `http://localhost:3030/api/car/filter/model/${filters.model}`;
    } else if (filters.fuel) {
      url = `http://localhost:3030/api/car/filter/fuel/${filters.fuel}`;
    } else if (filters.km) {
      url = `http://localhost:3030/api/car/filter/km/${filters.km}/${filters.kmDirection}`;
    } else if (filters.price) {
      url = `http://localhost:3030/api/car/filter/price/${filters.price}/${filters.priceDirection}`;
    }

    axios
      .get(url)
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Filtreleme hatası", err));
  };

  return (
    <Box sx={{ bgcolor: "#fff" }}>
      {/* 1) Sabitlenmiş Header */}
      <Header />

      {/* 2) Overlay Filtre Drawer */}
      <CarFilterSidebar onFilter={handleFilter} />

      {/* 3) Ana İçerik: Header’ın altından başlaması için pt veririz */}
      <Box sx={{ pt: `${HEADER_HEIGHT + 8}px`, px: 3, pb: 4 }}>
        {/* pt değerini HEADER_HEIGHT + 8px yapıyoruz ki, 
            hem header’ın altına hem de Filtre butonunun 
            kapladığı dikey boşluğa denk gelsin */}
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          color="#5c2e2e"
        >
          Car Listing
        </Typography>

        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                {car.images?.[0] && (
                  <CardMedia
                    component="img"
                    image={`data:image/jpeg;base64,${car.images[0].imageBase64}`}
                    alt={`${car.brand} ${car.model}`}
                    sx={{ height: 200, objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#5c2e2e" }}>
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.fuel} • {car.year} • {car.km} km
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {formatPrice(car.price)} ₺
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {car.contact}
                  </Typography>
                </CardContent>

                <Button
                  onClick={() => handleViewDetails(car.id)}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#5c2e2e",
                    borderRadius: 0,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#472121",
                    },
                  }}
                >
                  View Details
                </Button>

                <Button
                  onClick={() => handleCompareClick(car.id)}
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderColor: "#5c2e2e",
                    color: "#5c2e2e",
                    "&:hover": {
                      borderColor: "#472121",
                      backgroundColor: "#f8f8f8",
                    },
                  }}
                >
                  Compare
                </Button>

                {isAdmin && (
                  <Button
                    onClick={() => handleDeleteCar(car.id)}
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 1, borderRadius: 0 }}
                  >
                    Delete Car
                  </Button>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {showCompareBar && selectedCars.length === 1 && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "#eee",
              p: 2,
              boxShadow: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Typography>1. araç seçildi. Lütfen ikinci aracı seçin.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CarListPage;
