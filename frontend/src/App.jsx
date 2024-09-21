import React from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import Admin from "./pages/Admin"
import DeleteEntity from './pages/DeleteEntity';
import ShowEntity from './pages/ShowEntity'
import UpdateEntity from "./pages/UpdateEntity";
import ViewPost from "./components/ViewPost"

const App = () =>{
  return(
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/packages/:id" element={<ViewPost/>}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/admin" element={<Admin />}/>
      <Route path="/admin/:entity/delete/:id" element={<DeleteEntity />} />
      <Route path="/admin/:entityType/:id" element={<ShowEntity/>}/>
      <Route path="/admin/:entityType/edit/:id" element={<UpdateEntity/>}/>
    </Routes>
  )
}

export default App