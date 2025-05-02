import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import Admin from "./pages/Admin";
import DeleteEntity from "./pages/DeleteEntity";
import ShowEntity from "./pages/ShowEntity";
import UpdateEntity from "./pages/UpdateEntity";
import ViewPage from "./pages/ViewPage";
import Login from "./components/Login";
import CreatePackagePage from "./pages/CreatePackagePage";
import AgentHomePage from "./pages/AgentHomePage";
import AgentProfilePage from "./pages/AgentProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerWishlist from "./pages/CustomerWishlist";
import Search from "./pages/Search";
import GuideHome from "./pages/GuideHome";
import GuideProfile from "./pages/GuideProfile";
import CustomerGuide from "./pages/CustomerGuide";
import ViewGuide from "./components/ViewGuide";
import ViewBooking from "./pages/ViewBooking";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ViewReq from "./components/ViewReq";
import RealLandingPage from "./components/RealLandingPage";
import AgentViewAll from "./pages/AgentViewAll";
import ActHomePage from "./pages/ActHomePage";
import PaymentGateway from './pages/PaymentGateway';
import GuideRequests from './pages/GuideRequests';
import AgencyGuideRequests from './pages/AgencyGuideRequests';
import AgencyGuideDirectory from './pages/AgencyGuideDirectory';
import AgencyAnalytics from './pages/AgencyAnalytics';
import AgencyPayments from './pages/AgencyPayments';
import Layout from './components/Layout';

const App = () => {
  return (
    <Routes>
      {/* Public routes without navbar */}
      <Route path="/signup" element={<LandingPage />} />
      <Route path="/" element={<RealLandingPage />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

      {/* Routes with navbar */}
      <Route element={<Layout />}>
        {/* Public routes with navbar */}
        <Route path="/realhome" element={<ActHomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/:entityType/:id" element={<ShowEntity />} />
        <Route path="/admin/:entityType/edit/:id" element={<UpdateEntity />} />
        <Route path="/admin/:entityType/delete/:id" element={<DeleteEntity />} />
        <Route path="/admin/*/edit/:id" element={<UpdateEntity />} />
        <Route path="/payment" element={<PaymentGateway />} />

        {/* Protected routes with navbar */}
        <Route path="/packages/:id" element={<PrivateRoute />}>
          <Route path="/packages/:id" element={<ViewPage />} />
        </Route>

        <Route path="/bookings/:bookingId" element={<PrivateRoute />}>
          <Route path="/bookings/:bookingId" element={<ViewBooking />} />
        </Route>

        <Route path="/home" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

        <Route path="/CustomerGuide" element={<PrivateRoute />}>
          <Route path="/CustomerGuide" element={<CustomerGuide />} />
        </Route>

        <Route path="/guides/:id" element={<PrivateRoute />}>
          <Route path="/guides/:id" element={<ViewGuide />} />
        </Route>

        <Route path="/requests/:id" element={<PrivateRoute />}>
          <Route path="/requests/:id" element={<ViewReq />} />
        </Route>

        <Route path="/AgentHome" element={<PrivateRoute />}>
          <Route path="/AgentHome" element={<AgentHomePage />} />
        </Route>

        <Route path="/GuideHome" element={<PrivateRoute />}>
          <Route path="/GuideHome" element={<GuideHome />} />
        </Route>

        <Route path="/guide-requests" element={<PrivateRoute />}>
          <Route path="/guide-requests" element={<GuideRequests />} />
        </Route>

        <Route path="/agency-guide-requests" element={<PrivateRoute />}>
          <Route path="/agency-guide-requests" element={<AgencyGuideRequests />} />
        </Route>

        <Route path="/agency-guide-directory" element={<PrivateRoute />}>
          <Route path="/agency-guide-directory" element={<AgencyGuideDirectory />} />
        </Route>

        <Route path="/agency-analytics" element={<PrivateRoute />}>
          <Route path="/agency-analytics" element={<AgencyAnalytics />} />
        </Route>

        <Route path="/agency-payments" element={<PrivateRoute />}>
          <Route path="/agency-payments" element={<AgencyPayments />} />
        </Route>

        <Route path="/AgentProfilePage" element={<PrivateRoute />}>
          <Route path="/AgentProfilePage" element={<AgentProfilePage />} />
        </Route>

        <Route path="/GuideProfile" element={<PrivateRoute />}>
          <Route path="/GuideProfile" element={<GuideProfile />} />
        </Route>

        <Route path="/customerWishlist" element={<PrivateRoute />}>
          <Route path="/customerWishlist" element={<CustomerWishlist />} />
        </Route>

        <Route path="/createPackage" element={<PrivateRoute />}>
          <Route path="/createPackage" element={<CreatePackagePage />} />
        </Route>

        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<CustomerProfile />} />
        </Route>

        <Route path="/mylistings" element={<PrivateRoute />}>
          <Route path="/mylistings" element={<AgentViewAll />} />
        </Route>

        <Route path="/search" element={<PrivateRoute />}>
          <Route path="/search" element={<Search />} />
        </Route>

        <Route path="/wishlist" element={<PrivateRoute />}>
          <Route path="/wishlist" element={<CustomerWishlist />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
