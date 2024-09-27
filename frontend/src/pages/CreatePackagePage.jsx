import React from 'react'
import { Link } from 'react-router-dom'
import CreatePackage from '../components/createPackage'
import "../styles/AgentHomePage.css"

const CreatePackagePage = () => {
  return (
    <div>
      <nav className="navbarr">
        <ul className="nav-linkss">
          <li><Link to="/AgentHome">Home Page</Link></li>
          <li><Link to="/createPackage">Create Package</Link></li>
          <li><Link to="/AgentProfilePage">Profile Page</Link></li>
        </ul>
      </nav>
        <CreatePackage/>
    </div>
  )
}

export default CreatePackagePage