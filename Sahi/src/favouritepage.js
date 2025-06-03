import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

const FavouritePage = () => {
  const [favourites, setFavourites] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    console.log(user);
    if (userId) {
      fetchFavourites();
    }
  }, [userId]);

  const fetchFavourites = async () => {
    try {
      const response = await axios.get("http://localhost:3030/api/favorites", {
        params: { userId },
      });

      const favoriteCars = await Promise.all(
        response.data.map(async (fav) => {
          const res = await axios.get(`http://localhost:3030/api/car/${fav.car.id}`);
          return res.data;
        })
      );

      setFavourites(favoriteCars);
    } catch (error) {
      console.error("Failed to fetch favorite cars:", error);
    }
  };

  const handleRemoveFavourite = async (carId) => {
    try {
      console.log(carId);
      await axios.delete("http://localhost:3030/api/favorites", {
        params: { userId, carId },
      });
      fetchFavourites();
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("An error occurred while removing the favorite.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Favorite Cars</h2>
      {favourites.length === 0 ? (
        <p>No favorite cars yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {favourites.map((car) => (
            <Card
              key={car.id}
              sx={{ width: 240, borderRadius: 2, boxShadow: 3 }}
            >
              {car.imagesBase64 && car.imagesBase64.length > 0 ? (
                <CardMedia
                  component="img"
                  height="150"
                  image={`data:image/jpeg;base64,${car.imagesBase64[0]}`}
                  alt={`${car.brand} ${car.model}`}
                  sx={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: "150px",
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
                </div>
              )}
              <CardContent>
                <Typography variant="h6">
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> {car.price} ₺
                </Typography>
                <Button
                  onClick={() => handleRemoveFavourite(car.id)}
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritePage;
