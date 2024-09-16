import React from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import DeleteEntity from './pages/DeleteEntity';
import ShowEntity from './pages/ShowEntity'
import UpdateEntity from "./pages/UpdateEntity";

const App = () =>{
  return(
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/admin" element={<Admin />}/>
      <Route path="/admin/:entity/delete/:id" element={<DeleteEntity />} />
      <Route path="/admin/:entityType/:id" element={<ShowEntity/>}/>
      <Route path="/admin/:entityType/edit/:id" element={<UpdateEntity/>}/>
    </Routes>
  )
}

export default App