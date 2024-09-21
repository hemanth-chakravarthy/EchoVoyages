import React from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import Admin from "./pages/Admin"
import DeleteEntity from './pages/DeleteEntity';
import ShowEntity from './pages/ShowEntity'
import UpdateEntity from "./pages/UpdateEntity";
import ViewPost from "./components/ViewPost"
import DummyPage from "./pages/DummyPage"
import PrivateRoute from "./components/PrivateRoute"

const App = () =>{
  return(
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <PrivateRoute path="/packages/:id" element={<ViewPost/>}/>
      <Route path="/home" element={<Home />}/>
      <PrivateRoute path="/admin" element={<Admin />}/>
      <PrivateRoute path="/createPackage" element={<DummyPage/>}/>
      <PrivateRoute path="/admin/:entity/delete/:id" element={<DeleteEntity />} />
      <PrivateRoute path="/admin/:entityType/:id" element={<ShowEntity/>}/>
      <PrivateRoute path="/admin/:entityType/edit/:id" element={<UpdateEntity/>}/>
    </Routes>
  )
}

export default App