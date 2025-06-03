import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profilepage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isLoggedIn = !!user;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

 useEffect(() => {
  if (user) {
    console.log("Kullanıcı bilgileri:", {
      username: user.username,
      email: user.email,
      password: user.password,
    });

    setFormData((prev) => ({
      ...prev,
      username: user.username || "",
      email: user.email || "",
    }));
  }
}, []); // ✅ sadece 1 kere çalışır


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("Yeni şifreler uyuşmuyor.");
      return;
    }

    const updatedUser = {
      id: user.id,
      username: formData.username,
      email: formData.email,
      password:
        formData.newPassword.trim() !== ""
          ? formData.newPassword
          : formData.currentPassword,
    };

    try {
      const res = await fetch("http://localhost:3030/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      sessionStorage.setItem("user", JSON.stringify(updated));
      window.location.reload(); // Sayfayı yenile
    } catch (err) {
      console.error("Update error", err);
      alert("Güncelleme başarısız.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "red", fontWeight: "bold" }}>
          You are not logged in
        </h1>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f8f9fc;
        }
        .container {
          display: flex;
        }
        .sidebar {
          width: 250px;
          padding: 30px;
          background-color: white;
          border-right: 1px solid #ccc;
        }
        .sidebar h3 { margin-bottom: 15px; }
        .sidebar ul {
          list-style: none;
          padding: 0;
        }
        .sidebar li {
          margin: 10px 0;
          color: #666;
          cursor: pointer;
        }
        .sidebar .active {
          color: #000;
          font-weight: bold;
        }
        .sidebar button {
          margin-top: 40px;
          padding: 10px 20px;
          background-color: #6b3d3d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .profile-content {
          flex: 1;
          padding: 40px;
          background-color: white;
        }
        .welcome {
          text-align: right;
          font-size: 14px;
        }
        .profile-content h2 {
          color: #6b3d3d;
        }
        .row {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
        }
        label {
          font-size: 14px;
          margin-bottom: 5px;
        }
        input[type="text"],
        input[type="email"],
        input[type="password"] {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          gap: 15px;
        }
        .cancel {
          background: none;
          border: none;
          color: #333;
          cursor: pointer;
        }
        .save {
          background-color: #6b3d3d;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>

      <div className="container">
        <aside className="sidebar">
          <h3>Manage My Account</h3>
        </aside>

        <main className="profile-content">
          <div className="welcome">
            Welcome! <strong>{formData.username}</strong>
          </div>
          <h2>Edit Your Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <h3>Password Changes</h3>
            <div className="row">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </div>

            <div className="buttons">
              <button type="button" className="cancel">
                Cancel
              </button>
              <button type="submit" className="save">
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default Profilepage;
