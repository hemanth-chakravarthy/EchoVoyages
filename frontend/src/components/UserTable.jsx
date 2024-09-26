import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/tables.css';

const UsersTable = ({ users }) => {
    const now = new Date();

    const usersLast24Hours = users.filter(user => {
        const userCreatedAt = new Date(user.createdAt); 
        return (now - userCreatedAt) < 24 * 60 * 60 * 1000; 
    });

    return (
        <div>
            <div className='head1'>Users List:</div>
            <div className='head2'>
                Users added in the last 24 hours: {usersLast24Hours.length}
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
                                    <Link className='links' to={`/admin/customers/${user._id}`}>Show</Link>
                                    <Link className='links' to={`/admin/customers/edit/${user._id}`}>Update</Link>
                                    <Link className='links' to={`/admin/customers/delete/${user._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
