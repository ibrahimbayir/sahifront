import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Sayfalar
import MainPage from "./mainpage";
import ComparePage from "./comparepage";
import LoginPage from "./loginpage";
import SignupPage from "./signuppage";
import ProfilPage from "./profilpage";
import AddCar from "./addcar";
import CarPage from "./carpage";
import CarListPage from "./carlistpage";
import AdminPage from "./adminpage"; // eğer admin paneli ayrıysa
import FavouritePage from "./favouritepage"; // eksikti, eklendi
import LandingPage from "./landingpage";


// Header
import Header from "./header"; // Header bileşenini buraya koyduğun varsayımıyla
import MyCarListingPage from "./my-car-listing";
import UpdateMyCar from "./updatecar";

const AppWrapper = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/favourite" element={<FavouritePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profilepage" element={<ProfilPage />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/carpage/:id" element={<CarPage />} />
        <Route path="/carlistpage" element={<CarListPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/my-car-listing" element={<MyCarListingPage />} />
        <Route path="/update-my-car" element={<UpdateMyCar />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
