import React from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import DeleteUser from "./pages/DeleteUser"
import ShowUser from "./pages/ShowUser"


const App = () =>{
  return(
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/admin" element={<Admin />}/>
      <Route path="/admin/delete/:id" element={<DeleteUser />}/>
      <Route path="/admin/:id" element={<ShowUser />}/>
    </Routes>
  )
}

export default App