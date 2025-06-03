import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyCarListingPage = () => {
  const [cars, setCars] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchCars();
    }
  }, [userId]);

  const fetchCars = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/api/car/user/${userId}`
      );
      setCars(response.data);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    }
  };

  const handleDelete = async (carId) => {
    try {
      await axios.delete(`http://localhost:3030/api/car/${userId}/${carId}`);
      fetchCars(); // Refresh after delete
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete car.");
    }
  };

  const handleUpdate = (carId) => {
    sessionStorage.setItem("updateCarId", carId);
    navigate("/update-my-car");
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Box sx={{ padding: "40px" }}>
      <Typography variant="h5" gutterBottom>
        My Car Listings
      </Typography>
      {cars.length === 0 ? (
        <Typography>You don't have any car listings yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {cars.map((car) => (
            <Card
              key={car.id}
              sx={{ width: 260, borderRadius: 2, boxShadow: 3 }}
            >
              {car.images?.[0]?.imageBase64 ? (
                <CardMedia
                  component="img"
                  height="160"
                  image={`data:image/jpeg;base64,${car.images[0].imageBase64}`}
                  alt={`${car.brand} ${car.model}`}
                  sx={{ objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    height: "160px",
                    backgroundColor: "#ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#555",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  No Image
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> {formatPrice(car.price)} ₺
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={() => handleUpdate(car.id)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    color="error"
                    onClick={() => handleDelete(car.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyCarListingPage;
