import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [users, setusers] = useState([]);
    useEffect(() => {
        axios
          .get('http://localhost:5000/admin')
          .then((res) => {
            setusers(res.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
    
  return (
    <div>
      <div className='head1'>users List:
        <Link to='/users/create'>
        </Link>
      </div>
      
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>UserName</th>
              <th>Phone Number</th>
              <th>Gmail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.Name}</td>
                <td>{user.username}</td>
                <td>{user.phno}</td>
                <td>{user.gmail}</td>
                <td>
                  <div>
                    <Link to={`/admin/${user._id}`}> Show
                    </Link>
                    <Link to={`/admin/edit/${user._id}`}> Update
                    </Link>
                    <Link to={`/admin/delete/${user._id}`}> Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Admin