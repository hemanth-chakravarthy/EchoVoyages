import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'

const DeleteUser = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const handleDeleteUser = () => {
    axios
      .delete(`http://localhost:5000/admin/${id}`)
      .then(()=>{
        navigate('/admin');
      })
      .catch((error)=>{
        alert('error occured')
        console.log(error)
      })
  }
  return (
    <div>
      <h1>Delete Book</h1>
      <div>
        <h3>Are you sure u want to delete this User?</h3>
        <button onClick={handleDeleteUser}>Yes, Delete it</button>
      </div>
    </div>
  )
}

export default DeleteUser