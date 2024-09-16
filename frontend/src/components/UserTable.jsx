import React from 'react';
import { Link } from 'react-router-dom';

const UsersTable = ({ users }) => {
    return (
        <div>
            <div className='head1'>Users List:</div>
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
                                    <Link to={`/admin/customers/${user._id}`}>Show</Link>
                                    <Link to={`/admin/customers/edit/${user._id}`}>Update</Link>
                                    <Link to={`/admin/customers/delete/${user._id}`}>Delete</Link>
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
