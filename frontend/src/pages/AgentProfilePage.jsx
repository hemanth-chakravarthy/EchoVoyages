import React from 'react'
import AgentInfo from '../components/AgentInfo'
import { Link } from 'react-router-dom'

const AgentProfilePage = () => {
  return (
    <div> 
      <AgentInfo/>
      
      <Link to={'/AgentHome'}>Home Page</Link>
      <Link to={`/createPackage`}>Create package</Link>
      <Link to={`/AgentProfilePage`}>Profile Page</Link>
    </div>
  )
}

export default AgentProfilePage