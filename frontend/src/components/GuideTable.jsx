import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/tables.css'

const GuidesTable = ({ guides }) => {
    const now = new Date();
    const guidesLast24Hours = guides.filter(user => {
        const agentCreatedAt = new Date(user.createdAt); // Assuming `createdAt` is the timestamp field
        return (now - agentCreatedAt) < 24 * 60 * 60 * 1000; // Difference in milliseconds
    });
    return (
        <div>
            <div className='head1'>guides List:</div>
            <div className='head2'>
                Guides added in the last 24 hours: {guidesLast24Hours.length}
            </div>
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
                                <div className='linksPacks'>
                                    <Link className='links' to={`/admin/guides/${user._id}`}>Show</Link>
                                    <Link className='links' to={`/admin/guides/edit/${user._id}`}>Update</Link>
                                    <Link className='links' to={`/admin/guides/delete/${user._id}`}>Delete</Link>
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
