import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCarListing = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    fuel: "",
    year: "",
    km: "",
    price: "",
    contact: "",
    description: "",
    avgConsumption: "",
    imagesBase64: [],
  });

  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  // Get session user
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("Session user:", storedUser);
    setUser(storedUser);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const convertFilesToBase64 = (files) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error("Failed to convert image"));
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("User not logged in.");
      return;
    }

    try {
      const imagesBase64 = await convertFilesToBase64(files);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        year: parseInt(formData.year),
        km: parseInt(formData.km),
        avgConsumption: parseFloat(formData.avgConsumption),
        userId: user.id,
        imagesBase64,
      };

      const response = await axios.post(
        "http://localhost:3030/api/car",
        payload
      );

      console.log("Created car:", response.data);
    } catch (err) {
      console.error("Error submitting car:", err);
      alert("Error submitting car!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Car Listing</h2>
      <form onSubmit={handleSubmit}>
        {[
          ["Brand", "brand", "text"],
          ["Model", "model", "text"],
          ["Fuel Type", "fuel", "text"],
          ["Year", "year", "number"],
          ["Kilometers (KM)", "km", "number"],
          ["Price", "price", "number"],
          ["Contact", "contact", "text"],
          ["Description", "description", "text"],
          ["Average Consumption (L/100km)", "avgConsumption", "number"],
        ].map(([label, name, type]) => (
          <div key={name} style={styles.formGroup}>
            <label htmlFor={name} style={styles.label}>
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              style={styles.input}
              placeholder={`Enter ${label}`}
              required
            />
          </div>
        ))}

        <div style={styles.formGroup}>
          <label htmlFor="images" style={styles.label}>
            Upload Images (1-3)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={{ ...styles.button, ...styles.submit }}>
            Add Car
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    background: "#f6f7fb",
  },
  title: {
    color: "#4b2c2c",
    marginBottom: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  buttonGroup: {
    marginTop: "20px",
    textAlign: "right",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  submit: {
    backgroundColor: "#603030",
    color: "#fff",
  },
};

export default AddCarListing;
