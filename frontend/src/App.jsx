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
