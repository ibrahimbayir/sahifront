import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const isLoggedIn = isAdmin;
  

  // Kullanıcıyı session'dan al
  useEffect(() => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  console.log("Session'dan gelen kullanıcı:", storedUser);
  setUser(storedUser);

  if (admin?.id) {
    setAdminId(admin.id);
  }
}, []);



  // Kullanıcıları getir
  useEffect(() => {
    if (!isLoggedIn || !adminId) return;

    axios
      .get(`http://localhost:3030/api/user/getall/${adminId}`)
      .then((res) => {
        const incoming = res.data;
        if (Array.isArray(incoming)) {
          setUsers(incoming);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Kullanıcılar alınamadı", err);
        alert("Kullanıcılar yüklenemedi.");
      });
  }, [adminId, isLoggedIn]);

  const handleDeleteUser = (userToDeleteId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    axios
      .delete(`http://localhost:3030/api/user/${adminId}/${userToDeleteId}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== userToDeleteId));
      })
      .catch((err) => {
        console.error("Silme başarısız", err);
        alert("Kullanıcı silinemedi.");
      });
  };

  if (!isLoggedIn || !user) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h3" fontWeight="bold" color="error">
          You are not logged in
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Panel – Tüm Kullanıcılar
      </Typography>

      {users.length === 0 ? (
        <Typography mt={4}>Gösterilecek kullanıcı bulunamadı.</Typography>
      ) : (
        <List>
          {users.map((u) => (
            <Box key={u.id}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Delete
                  </Button>
                }
              >
                <ListItemText
                  primary={u.username || "İsimsiz"}
                  secondary={
                    <>
                      {u.email} <br />
                      ID: {u.id}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AdminPage;
