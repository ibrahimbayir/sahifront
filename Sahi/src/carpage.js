import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const CarPage = () => {
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  const [car, setCar] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3030/api/car/${id}`)
      .then((res) => setCar(res.data))
      .catch((err) => console.error("Failed to fetch car data", err));
  }, [id]);

  useEffect(() => {
    if (!userId || !id) return;

    axios
      .get("http://localhost:3030/api/favorites", {
        params: { userId },
      })
      .then((res) => {
        const list = res.data || [];
        const match = list.find(
          (fav) => fav.car.id.toString() === id.toString()
        );
        if (match) setIsFavorite(true);
      })
      .catch((err) => console.error("Failed to fetch favorites", err));
  }, [userId, id]);

  const handleFavorite = () => {
    if (!userId || !id) return;

    if (isFavorite) {
      axios
        .delete("http://localhost:3030/api/favorites", {
          params: { userId, carId: id },
        })
        .then(() => setIsFavorite(false))
        .catch((err) => console.error("Failed to remove from favorites", err));
    } else {
      axios
        .post("http://localhost:3030/api/favorites", null, {
          params: { userId, carId: id },
        })
        .then(() => setIsFavorite(true))
        .catch((err) => {
          if (err.response?.status === 409) {
            alert("This car is already in favorites.");
            setIsFavorite(true);
          } else {
            console.error("Failed to add to favorites", err);
          }
        });
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (!car) return <Typography>Loading...</Typography>;

  return (
    <Box display="flex" justifyContent="center" mt={4} px={2}>
      <Card
        sx={{ width: "100%", maxWidth: 1000, borderRadius: 4, boxShadow: 6 }}
      >
        {car.imagesBase64 && car.imagesBase64.length > 0 ? (
          <Box
            component="img"
            src={`data:image/jpeg;base64,${car.imagesBase64[0]}`}
            alt={`${car.brand} ${car.model}`}
            sx={{ width: "100%", height: 400, objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 400,
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            No Image
          </Box>
        )}

        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" fontWeight="bold">
              {car.brand} {car.model}
            </Typography>
            <IconButton
              color="error"
              onClick={handleFavorite}
              size="large"
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Fuel Type:</strong> {car.fuel}
              </Typography>
              <Typography>
                <strong>Model Year:</strong> {car.year}
              </Typography>
              <Typography>
                <strong>Kilometers:</strong> {car.km} km
              </Typography>
              <Typography>
                <strong>Average Consumption:</strong> {car.avgConsumption}{" "}
                L/100km
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>Price:</strong> {formatPrice(car.price)} ₺
              </Typography>
              <Typography>
                <strong>Contact:</strong> {car.contact}
              </Typography>
              <Typography>
                <strong>Description:</strong> {car.description}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CarPage;
