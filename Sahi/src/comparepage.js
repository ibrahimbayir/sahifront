import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const ComparePage = () => {
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:3030/api/comparison/${userId}`)
      .then((res) => {
        const dto = res.data;
        setCar1(dto.car2);
        setCar2(dto.car1);
      })
      .catch((err) => console.error("Failed to fetch comparison data:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (car1 && car2) {
      const a = [];
      if (car1.km !== car2.km) {
        const better = car1.km < car2.km ? car1 : car2;
        a.push(`${better.brand} ${better.model} has lower mileage.`);
      }
      if (car1.year !== car2.year) {
        const newer = car1.year > car2.year ? car1 : car2;
        a.push(`${newer.brand} ${newer.model} is a newer model.`);
      }
      if (car1.price !== car2.price) {
        const cheaper = car1.price < car2.price ? car1 : car2;
        a.push(`${cheaper.brand} ${cheaper.model} is more affordable.`);
      }
      if (a.length === 0) a.push("Both vehicles are very similar.");
      setAnalysis(a.join(" "));
    }
  }, [car1, car2]);

const highlight = (key, carValue, otherValue) => {
  const isBetter =
    key === "km" || key === "price" || key === "avgConsumption"
      ? carValue < otherValue
      : key === "year"
      ? carValue > otherValue
      : false;

  return {
    color: isBetter ? "green" : "inherit",
    fontWeight: isBetter ? "bold" : "normal",
    icon: isBetter ? (
      <CheckIcon sx={{ color: "green", fontSize: 16, ml: 1 }} />
    ) : null,
  };
};

  const renderSpecs = (car, otherCar) => {
    const specs = [
      { label: "Price", key: "price", suffix: "₺" },
      { label: "Kilometers", key: "km", suffix: " km" },
      { label: "Model Year", key: "year", suffix: "" },
      { label: "Average Consumption", key: "avgConsumption", suffix: " litre" },
      { label: "Fuel Type", key: "fuel", suffix: "" },
      { label: "Contact", key: "contact", suffix: "" },
      { label: "Description", key: "description", suffix: "" },
    ];

    return (
      <Box mt={2} p={2}>
        {specs.map(({ label, key, suffix }) => {
          const val = car[key];
          const otherVal = otherCar[key];
          const { color, fontWeight, icon } = highlight(key, val, otherVal);

          const isDescription = key === "description";

          return (
            <Typography
              key={key}
              sx={{
                color,
                fontWeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                mt: isDescription ? 1 : 0,
              }}
            >
              <strong>{label}:</strong>
              <Box
                component="span"
                sx={
                  isDescription
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mt: 0.5,
                      }
                    : {}
                }
              >
                {val} {suffix} {icon}
              </Box>
            </Typography>
          );
        })}
      </Box>
    );
  };

  if (loading) return <CircularProgress sx={{ m: 5 }} />;
  if (!car1 || !car2)
    return <Typography m={5}>Comparison data not available.</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom textAlign="center">
        🚗 Vehicle Comparison
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        {[car1, car2].map((car, index) => {
          const other = index === 0 ? car2 : car1;
          return (
            <Grid item xs={12} md={5} key={index}>
              <Paper
                elevation={3}
                sx={{
                  minHeight: 620,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {car.images?.[0] ? (
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    <Box
                      component="img"
                      src={`data:image/jpeg;base64,${car.images[0].imageBase64}`}
                      alt={`${car.brand} ${car.model}`}
                      sx={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ddd",
                      color: "#444",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Görsel Yok
                  </Box>
                )}

                <Box p={2} textAlign="center">
                  <Typography variant="h6">
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.fuel}
                  </Typography>
                </Box>

                <Divider />
                {renderSpecs(car, other)}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🧠 Smart Analysis
        </Typography>
        <Typography>{analysis}</Typography>
      </Paper>
    </Box>
  );
};

export default ComparePage;
