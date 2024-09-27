import React from 'react'
import AgentInfo from '../components/AgentInfo'
import { Link } from 'react-router-dom'
import "../styles/AgentHomePage.css"

const AgentProfilePage = () => {
  return (
    <div> 
      <nav className="navbarr">
        <ul className="nav-linkss">
          <li><Link to="/AgentHome">Home Page</Link></li>
          <li><Link to="/createPackage">Create Package</Link></li>
          <li><Link to="/AgentProfilePage">Profile Page</Link></li>
        </ul>
      </nav>
      <AgentInfo/>
    </div>
  )
}

export default AgentProfilePage