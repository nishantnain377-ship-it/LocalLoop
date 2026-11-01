
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListingDetails from "./pages/ListingDetails";

import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Messages from "./pages/Messages";
import Chat from "./pages/Chat";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Listings from "./pages/Admin/Listings";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />

        <Route path="/marketplace" element={<Marketplace />} />

        <Route
          path="/listing/:id"
          element={<ListingDetails />}
        />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/create-listing"
            element={<CreateListing />}
          />

          <Route
            path="/my-listings"
            element={<MyListings />}
          />

          <Route
            path="/edit-listing/:id"
            element={<EditListing />}
          />

          {/* Messaging Pages */}
          <Route path="/messages" element={<Messages />} />

          <Route
            path="/messages/:conversationId"
            element={<Chat />}
          />

          {/* Admin Pages */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

          <Route
            path="/admin/listings"
            element={<Listings />}
          />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
