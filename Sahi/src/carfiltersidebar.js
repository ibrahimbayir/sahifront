import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const HEADER_HEIGHT = 64; // <-- Buraya kendi header yüksekliğini piksel olarak yaz.

const CarFilterSidebar = ({ onFilter }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    fuel: "",
    km: "",
    kmDirection: "less",
    price: "",
    priceDirection: "less",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setOpen(false);
  };

  return (
    <>
      {/* 1) Filtre açma butonu: header’ın hemen altında yer alacak */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: HEADER_HEIGHT + 10, // 10px boşluk bırak (isteğe bağlı)
          left: 10,
          zIndex: 1400,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
        }}
      >
        <FilterListIcon />
      </IconButton>

      {/* 2) Overlay (temporary) Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary" 
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          // Drawer’ın Paper kısmını header’ın altından başlatıyoruz
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            top: `${HEADER_HEIGHT}px`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#5c2e2e", fontWeight: "bold" }}
          >
            Filter Cars
          </Typography>

          <TextField
            label="Brand"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Model"
            name="model"
            value={filters.model}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fuel Type"
            name="fuel"
            value={filters.fuel}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Kilometer"
            name="km"
            type="number"
            value={filters.km}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Km Direction"
            name="kmDirection"
            value={filters.kmDirection}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="less">Less</MenuItem>
            <MenuItem value="bigger">More</MenuItem>
          </TextField>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={filters.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Price Direction"
            name="priceDirection"
            value={filters.priceDirection}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="less">Less</MenuItem>
            <MenuItem value="bigger">More</MenuItem>
          </TextField>

          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            sx={{
              mt: 2,
              backgroundColor: "#5c2e2e",
              "&:hover": { backgroundColor: "#4b2424" },
            }}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default CarFilterSidebar;
