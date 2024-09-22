import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/tables.css'

const AgenciesTable = ({ agencies }) => {
    return (
        <div>
            <div className='head1'>Agencies List:</div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Specialization</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {agencies.map((agency, index) => (
                        <tr key={agency._id}>
                            <td>{index + 1}</td>
                            <td>{agency.name}</td>
                            <td>{agency.contactInfo?.email || 'N/A'}</td>
                            <td>{agency.contactInfo?.phone || 'N/A'}</td>
                            <td>{agency.specialization}</td>
                            <td>
                                <div className='linksPacks'>
                                    <Link className='links' to={`/admin/agency/${agency._id}`}>Show</Link>
                                    <Link className='links' to={`/admin/agency/edit/${agency._id}`}>Update</Link>
                                    <Link className='links' to={`/admin/agency/delete/${agency._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgenciesTable;
