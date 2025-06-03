import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateCar = () => {
  const navigate = useNavigate();
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

  const [user, setUser] = useState(null);
  const [carId, setCarId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedCarId = sessionStorage.getItem("updateCarId");
    if (!storedUser || !storedCarId) {
      alert("Geçersiz işlem.");
      navigate("/my-car-listing");
      return;
    }

    setUser(storedUser);
    setCarId(storedCarId);

    axios.get(`http://localhost:3030/api/car/${storedCarId}`)
      .then((res) => {
        const car = res.data;
        setFormData({
          brand: car.brand,
          model: car.model,
          fuel: car.fuel,
          year: car.year,
          km: car.km,
          price: car.price,
          contact: car.contact,
          description: car.description,
          avgConsumption: car.avgConsumption,
          imagesBase64: car.images?.map(img => img.imageBase64) || [],
        });
      })
      .catch((err) => {
        console.error("Araç bilgisi alınamadı:", err);
        alert("Araç bilgisi alınamadı.");
        navigate("/my-car-listing");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id || !carId) {
      alert("Eksik bilgi.");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        year: parseInt(formData.year),
        km: parseInt(formData.km),
        avgConsumption: parseFloat(formData.avgConsumption),
        userId: user.id,
        imagesBase64: formData.imagesBase64, // değişmiyor
      };

      await axios.put(`http://localhost:3030/api/car/${carId}`, payload);

     
      sessionStorage.removeItem("updateCarId");
      navigate("/my-car-listing");
    } catch (err) {
      console.error("Araç güncelleme hatası:", err);
      alert("Araç güncellenemedi.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update Car Listing</h2>
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
              required
            />
          </div>
        ))}

        {formData.imagesBase64.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <label style={styles.label}>Existing Images</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {formData.imagesBase64.map((img, idx) => (
                <img
                  key={idx}
                  src={`data:image/jpeg;base64,${img}`}
                  alt="preview"
                  style={{ height: "100px", borderRadius: "4px" }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button type="submit" style={{ ...styles.button, ...styles.submit }}>
            Update Car
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

export default UpdateCar;
