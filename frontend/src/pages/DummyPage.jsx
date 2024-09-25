import React from 'react'
import { Link } from 'react-router-dom'
import CreatePackage from '../components/createPackage'

const DummyPage = () => {
  return (
    <div>
      <CreatePackage/>
    
    <Link to={'/AgentHome'}>Home Page</Link>
    <Link to={`/createPackage`}>Create package</Link>
    <Link to={`/AgentProfilePage`}>Profile Page</Link>
    </div>
  )
}

export default DummyPage