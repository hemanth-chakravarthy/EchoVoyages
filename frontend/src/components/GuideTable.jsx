import React from 'react';
import { Link } from 'react-router-dom';

const GuidesTable = ({ guides }) => {
    return (
        <div>
            <div className='head1'>guides List:</div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Experience</th>
                        <th>Email</th>
                        <th>Languages</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {guides.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.experience}</td>
                            <td>{user.contact?.email || 'N/A'}</td>
                            <td>{user.languages}</td>
                            <td>
                                <div>
                                    <Link to={`/admin/guides/${user._id}`}>Show</Link>
                                    <Link to={`/admin/guides/edit/${user._id}`}>Update</Link>
                                    <Link to={`/admin/guides/delete/${user._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuidesTable;
