import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'

const ShowUser = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();

  useEffect(()=>{
    axios 
      .get(`http://localhost:5000/admin/customers/${id}`)
      .then((res)=>{
        setUser(res.data);
      })
      .catch((error)=>{
        console.log(error);
      })
  }, [])
  return (
    <div>
      <h1>Show User</h1>
      <div>
        <div>
          <span>ID: </span>
          <span>{user._id}</span>
        </div>
        <div>
          <span>Name: </span>
          <span>{user.Name}</span>
        </div>
        <div>
          <span>Username: </span>
          <span>{user.username}</span>
        </div>
        <div>
          <span>Gmail: </span>
          <span>{user.gmail}</span>
        </div>
      </div>
    </div>
  )
}

export default ShowUser