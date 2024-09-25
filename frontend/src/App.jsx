import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn'
import Destination from './pages/Destination';
import ScrollToTop from './components/ScrollToTop';
import Admin from './pages/Admin';
import DeleteEntity from './pages/DeleteEntity';
import ShowEntity from './pages/ShowEntity';
import UpdateEntity from './pages/UpdateEntity';
import './App.css';

const App = () => {
  return (
    <div className="App">
      {/* Add Navbar to all routes */}
      <Navbar />
      {/* Scroll to top on route change */}
      <ScrollToTop>
        <Routes>
          {/* Routes from Main */}
          <Route path="/" exact element={<Home />} />
          <Route path="/services" exact element={<Services />} />
          <Route path="/sign-up" exact element={<SignUp />} />
          <Route path="/login" exact element={<LogIn />}/>
          <Route path="/services/activity" element={<Destination />} />
import React, {useEffect} from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import Admin from "./pages/Admin"
import DeleteEntity from './pages/DeleteEntity';
import ShowEntity from './pages/ShowEntity'
import UpdateEntity from "./pages/UpdateEntity";
import ViewPage from "./pages/ViewPage"
import DummyPage from "./pages/DummyPage"
import AgentHomePage from "./pages/AgentHomePage"
import AgentProfilePage from "./pages/AgentProfilePage"
import PrivateRoute from "./components/PrivateRoute"
import CustomerProfile from "./pages/CustomerProfile"
import CustomerWishlist from "./pages/CustomerWishlist"
import Search from './components/Search';
import GuideHome from "./pages/GuideHome"
import GuideProfile from "./pages/GuideProfile"
import CustomerGuide from "./pages/CustomerGuide"
import ViewGuide from "./components/ViewGuide"
import ViewBooking from "./pages/ViewBooking"

const App = () =>{

  useEffect(() => {
    const handleBeforeUnload = () => {
        localStorage.removeItem('token');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, []);

  return(
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      {/* For the /packages/:id route */}
  <Route path="/packages/:id" element={<PrivateRoute />}>
    <Route path="/packages/:id" element={<ViewPage />} />
  </Route>
  <Route path="/bookings/:bookingId" element={<PrivateRoute />}>
    <Route path="/bookings/:bookingId" element={<ViewBooking />} />
  </Route>

  {/* For the /home route */}
  <Route path="/home" element={<PrivateRoute />}>
    <Route path="/home" element={<Home />} />
  </Route>
  <Route path="/CustomerGuide" element={<PrivateRoute />}>
    <Route path="/CustomerGuide" element={<CustomerGuide />} />
  </Route>
  <Route path="/guides/:id" element={<PrivateRoute />}>
    <Route path="/guides/:id" element={<ViewGuide />} />
  </Route>
  <Route path="/AgentHome" element={<PrivateRoute />}>
    <Route path="/AgentHome" element={<AgentHomePage />} />
  </Route>
  <Route path="/GuideHome" element={<PrivateRoute />}>
    <Route path="/GuideHome" element={<GuideHome/>} />
  </Route>
  <Route path="/AgentProfilePage" element={<PrivateRoute />}>
    <Route path="/AgentProfilePage" element={<AgentProfilePage />} />
  </Route>
  <Route path="/GuideProfilePage" element={<PrivateRoute />}>
    <Route path="/GuideProfilePage" element={<GuideProfile />} />
  </Route>

  {/* For the /admin route */}
  {/* <Route path="/admin" element={<PrivateRoute />}> */}
    <Route path="/admin" element={<Admin />} />
  {/* </Route> */}
    <Route path="/customerWishlist" element={<PrivateRoute/>}>
      <Route path="/customerWishlist" element={<CustomerWishlist/>}/>
    </Route>
  {/* For the /createPackage route */}
  <Route path="/createPackage" element={<PrivateRoute />}>
    <Route path="/createPackage" element={<DummyPage />} />
  </Route>
 <Route path="/custProfilePage" element={<PrivateRoute />}>
  <Route path="/custProfilePage" element={<CustomerProfile/>}/>
 </Route>
  {/* For the /admin/:entity/delete/:id route */}
  <Route path="/admin/:entity/delete/:id" element={<PrivateRoute />}>
    <Route path="/admin/:entity/delete/:id" element={<DeleteEntity />} />
  </Route>

  {/* For the /admin/:entityType/:id route */}
  <Route path="/admin/:entityType/:id" element={<PrivateRoute />}>
    <Route path="/admin/:entityType/:id" element={<ShowEntity />} />
  </Route>

  {/* For the /admin/:entityType/edit/:id route */}
  <Route path="/admin/:entityType/edit/:id" element={<PrivateRoute />}>
    <Route path="/admin/:entityType/edit/:id" element={<UpdateEntity />} />
  </Route>
  <Route path="/search" element={<PrivateRoute />}>
        <Route path="/search" element={<Search />} />  {/* <-- Search component */}
  </Route>
      
    </Routes>
  )
}

          {/* Routes from Admin section */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:entity/delete/:id" element={<DeleteEntity />} />
          <Route path="/admin/:entityType/:id" element={<ShowEntity />} />
          <Route path="/admin/:entityType/edit/:id" element={<UpdateEntity />} />
        </Routes>
      </ScrollToTop>
    </div>
  );
};

export default App;
