import React, {useEffect} from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import Admin from "./pages/Admin"
import DeleteEntity from './pages/DeleteEntity';
import ShowEntity from './pages/ShowEntity'
import UpdateEntity from "./pages/UpdateEntity";
import ViewPost from "./components/ViewPost"
import DummyPage from "./pages/DummyPage"
import AgentHomePage from "./pages/AgentHomePage"
import PrivateRoute from "./components/PrivateRoute"
import ProfilePage from "./pages/CustomerProfile"
import CustomerWishlist from "./pages/CustomerWishlist"

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
    <Route path="/packages/:id" element={<ViewPost />} />
  </Route>

  {/* For the /home route */}
  <Route path="/home" element={<PrivateRoute />}>
    <Route path="/home" element={<Home />} />
  </Route>
  <Route path="/AgentHome" element={<PrivateRoute />}>
    <Route path="/AgentHome" element={<AgentHomePage />} />
  </Route>

  {/* For the /admin route */}
  {/* <Route path="/admin" element={<PrivateRoute />}> */}
    <Route path="/admin" element={<Admin />} />
  {/* </Route> */}
    <Route>
      <Route path="/customerWishlist" element={<CustomerWishlist/>}/>
    </Route>
  {/* For the /createPackage route */}
  <Route path="/createPackage" element={<PrivateRoute />}>
    <Route path="/createPackage" element={<DummyPage />} />
  </Route>
 <Route path="/custProfilePage" element={<PrivateRoute />}>
  <Route path="/custProfilePage" element={<ProfilePage/>}/>
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
    </Routes>
  )
}

export default App