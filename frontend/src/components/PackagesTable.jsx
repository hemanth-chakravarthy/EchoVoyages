import React from 'react';
import { Link } from 'react-router-dom';

const PackagesTable = ({ packages }) => {
    return (
        <div>
            <div className='head1'>Packages List:</div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Package Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map((pkg, index) => (
                        <tr key={pkg._id}>
                            <td>{index + 1}</td>
                            <td>{pkg.name}</td>
                            <td>{pkg.description}</td>
                            <td>{pkg.price}</td>
                            <td>
                                <div>
                                    <Link to={`/admin/packages/${pkg._id}`}>Show</Link>
                                    <Link to={`/admin/packages/edit/${pkg._id}`}>Update</Link>
                                    <Link to={`/admin/packages/delete/${pkg._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PackagesTable;
