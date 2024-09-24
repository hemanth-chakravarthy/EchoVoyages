import React from 'react'
import { Link } from 'react-router-dom'

const GuideHome = () => {
  return (
    <div>GuideHome
      <div>
      <Link to={'/guideHome'}>Home Page</Link>
      <Link to={`/GuideProfilePage`}>Profile Page</Link>
      </div>
    </div>
  )
}

export default GuideHome