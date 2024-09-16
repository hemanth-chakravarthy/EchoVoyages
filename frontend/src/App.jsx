import React from "react"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import DeleteUser from "./pages/DeleteUser"
import ShowUser from "./pages/ShowUser"
import UpdateUser from './pages/UpdateUser'


const App = () =>{
  return(
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/admin/customers" element={<Admin />}/>
      <Route path="/admin/customers/delete/:id" element={<DeleteUser />}/>
      <Route path="/admin/customers/:id" element={<ShowUser />}/>
      <Route path="/admin/customers/edit/:id" element={<UpdateUser/>}/>
    </Routes>
  )
}

export default App