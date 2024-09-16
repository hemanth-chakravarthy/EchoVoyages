import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateUser = () => {
  const [Name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {id} = useParams();
  useEffect(()=>{
    axios.get(`http://localhost:5000/admin/${id}`)
    .then((res)=>{
      setUsername(res.data.username)
      setGmail(res.data.gmail)
      setName(res.data.Name)
      setPassword(res.data.password)
    }).catch((error)=>{
      alert('error occured')
      console.log(error)
    })
  },[])
  const handleEditUser = () =>{
    const data = {
      Name,
      username,
      gmail,
      password
    };
    setPassword(true);
    axios
      .put(`http://localhost:5000/admin/${id}`, data)
      .then(()=>{
        navigate('/admin');
      })
      .catch((error)=>{
        alert('error occured')
        console.log(error)
      })
  };
  return (
    <div>
      <h1>Edit Book</h1>
      <div>
        <div>
          <label>Name</label>
          <input
            type = 'text'
            value={Name}
            onChange={(e)=>setName(e.target.value)}
          />
          <label>username</label>
          <input
            type = 'text'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
          <label>Gmail</label>
          <input
            type = 'text'
            value={gmail}
            onChange={(e)=>setGmail(e.target.value)}
          />
          <label>Password</label>
            <input
                type='passwoord'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
        </div>
        <button onClick={handleEditUser}>
          Save
        </button>
      </div>
      
    </div>
  )
}

export default UpdateUser